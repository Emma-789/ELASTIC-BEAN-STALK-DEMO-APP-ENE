# Elastic Beanstalk Demo App

A simple Node.js Express application deployed to AWS Elastic Beanstalk to demonstrate the core deployment workflow: packaging code, provisioning an environment, verifying health, and configuring a health check endpoint.

## Overview

The app serves a landing page with live instance information (hostname, platform, uptime, Node version, server time) and exposes two API endpoints: `/health` and `/api/info`.

## Project Structure

```
eb-demo-app/
├── app.js           # Application entry point (Express server)
├── package.json     # Dependencies and start script
├── Procfile         # Tells Beanstalk how to start the app
└── README.md
```

## Prerequisites

- Node.js 18+ and npm
- An AWS account (Free Tier eligible)

## Running Locally

Install dependencies:

```bash
npm install
```

Start the server:

```bash
node app.js
```

The app runs at `http://localhost:8080`. Confirmed working locally before deployment, showing hostname, platform, uptime, Node version, and server time on the landing page.

## Deployment Process

### 1. Packaged the project

Since `zip` was not available on Windows by default, the archive was created using PowerShell's built-in compression instead of installing an external tool:

```powershell
Compress-Archive -Path app.js, package.json, Procfile -DestinationPath eb-demo-app.zip
```

`node_modules` was excluded — Elastic Beanstalk installs dependencies automatically during deployment.

### 2. Created the Elastic Beanstalk environment

- AWS Console → Elastic Beanstalk → **Create application**
- Environment tier: Web server environment
- Application name: `eb-demo-app`
- Platform: Node.js 24, running on 64-bit Amazon Linux 2023
- Application code: Uploaded `eb-demo-app.zip`
- Preset: Single instance (Free Tier eligible)
- Service access: Created a service role and an EC2 instance profile with the `AWSElasticBeanstalkWebTier` policy attached
- Environment provisioned in a few minutes

### 3. Verified the deployment

Environment health showed **Ok** (green) after provisioning.

Live URL:
`https://Eb-demo-app-env.eba-w5nfj4iv.us-east-1.elasticbeanstalk.com`

Visiting the URL returned the landing page with live instance data pulled from the actual EC2 instance, confirming the deployment worked end-to-end — for example:

- Hostname: `ip-172-31-81-222.ec2.internal`
- Platform: `linux`
- Node version: `v24.19.0`
- Environment: `development`

### 4. Health check endpoint

The app exposes `GET /health`, returning `{"status": "ok"}`, matching Elastic Beanstalk's expected health check path configuration under **Configuration → Instance traffic and scaling → Processes**.

## API Endpoints

| Endpoint     | Description                              |
|--------------|-------------------------------------------|
| `/`          | Landing page with live instance info      |
| `/health`    | Health check — returns `{"status":"ok"}`  |
| `/api/info`  | Same instance info, returned as JSON      |

## Deploying Updates

1. Modify the code
2. Re-zip the project (excluding `node_modules`)
3. In the Beanstalk console: environment → **Upload and deploy** → select the new zip → set a version label → **Deploy**

## Cleaning Up

To avoid ongoing charges once finished:

1. Elastic Beanstalk console → environment → **Actions** → **Terminate environment**
2. To remove everything: **Applications** list → select the app → **Actions** → **Delete application**

## Technologies

- Node.js
- Express
- AWS Elastic Beanstalk

## License

MIT
