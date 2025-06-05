# Jira Cloud Mock API

This is a mock cloud API for Jira that returns relatively good data for testing processes in the chain. You'll find it useful if you need it.

## Setup

1. Create a `.env` file in the test-app directory with the following content:
```
PORT=3000
JIRA_BASE_URL=http://localhost:3000
JIRA_CLIENT_ID=test-client-id
JIRA_CLIENT_SECRET=test-client-secret
S3_BUCKET_NAME=test-bucket
DYNAMODB_TABLE=test-table

# AWS credentials for local testing
AWS_ACCESS_KEY_ID=test-access-key
AWS_SECRET_ACCESS_KEY=test-secret-key
AWS_REGION=us-east-1
```

2. Create a test-files directory and add a test PDF:
```bash
mkdir test-files
# Add your test.pdf file to the test-files directory
```

3. Install dependencies:
```bash
npm install
```

## Running the Test Application

1. Start the test server:
```bash
npm start
```


2. In a separate terminal, run the test webhook:
```bash
npm test
```

## What This Test App Does

1. Simulates a JIRA environment by providing endpoints for:
   - Webhook reception
   - OAuth token generation
   - Issue details
   - Attachment serving

2. Provides a local testing environment

3. Includes a test script to send webhook events

## Test Endpoints

- Webhook URL: http://localhost:3000/webhook
- JIRA OAuth: http://localhost:3000/oauth/token
- JIRA Issue: http://localhost:3000/rest/api/3/issue/:issueKey
- Attachments: http://localhost:3000/attachments/:filename

## Monitoring

The test server provides console output for:
- Incoming webhooks
- Error messages
- Server status 