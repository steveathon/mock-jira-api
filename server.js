import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import * as S3 from '@aws-sdk/client-s3';
import * as DynamoDB from '@aws-sdk/client-dynamodb';
import * as DynamoDBDocumentClient from '@aws-sdk/lib-dynamodb';
import axios from 'axios';
import { PDFDocument } from 'pdf-lib';
//import { handler } from '../index.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

// Initialize environment variables
dotenv.config();

const app = express();
app.use(bodyParser.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Endpoint to simulate JIRA webhook
app.post('/webhook', async (req, res) => {
    console.log('Received webhook:', JSON.stringify(req.body, null, 2));
    
    try {
        // Simulate event
        const result = await handler({
            body: JSON.stringify(req.body)
        });
        
        console.log('Function result:', result);
        res.json(result);
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to simulate JIRA OAuth token endpoint
app.post('/oauth/token', (req, res) => {
    console.log('OAuth token requested');
    res.json({
        access_token: 'test-access-token',
        token_type: 'Bearer',
        expires_in: 3600
    });
});

// Endpoint to simulate JIRA issue endpoint
app.get('/rest/api/3/issue/:issueKey', (req, res) => {
    console.log('Issue details requested for:', req.params.issueKey);
    res.json({
        key: req.params.issueKey,
        fields: {
            attachment: [
                {
                    id: 'test-attachment-1',
                    filename: 'test.pdf',
                    mimeType: 'application/pdf',
                    size: 12345,
                    content: `http://${process.env.JIRA_BASE_URL}:${process.env.PORT || 3000}/attachments/test.pdf`
                }
            ],
            status: {
                name: 'Ready to pay'
            },
            customfield_10001: 'Custom Value 1',
            customfield_10002: 'Custom Value 2'
        },
        changelog: {
            histories: [
                {
                    author: {
                        displayName: 'Test User'
                    },
                    created: '2024-03-20T10:00:00.000Z',
                    items: [
                        {
                            field: 'status',
                            toString: 'Approved'
                        }
                    ]
                }
            ]
        }
    });
});


// Endpoint to serve test attachments
app.get('/attachments/:filename', async (req, res) => {
    try {
        const testPdfPath = join(__dirname, 'test-files', req.params.filename);
        console.log('Serving attachment:', testPdfPath);
        const fileContent = await fs.readFile(testPdfPath);
        res.contentType('application/pdf');
        res.send(fileContent);
    } catch (error) {
        console.error('Error serving attachment:', error);
        res.status(404).send('File not found');
    }
});

// Mock S3 endpoints
app.put('/s3/:bucket/:key', express.raw({type: '*/*', limit: '10mb'}), (req, res) => {
    console.log('S3 PUT request:', req.params.bucket, req.params.key);
    res.status(200).send('OK');
});

app.get('/s3/:bucket/:key', (req, res) => {
    console.log('S3 GET request:', req.params.bucket, req.params.key);
    res.status(200).send('Mock S3 Content');
});

// Mock DynamoDB endpoint
app.post('/dynamodb', (req, res) => {
    console.log('DynamoDB request:', req.body);
    res.status(200).json({ success: true });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
    console.log(`Webhook URL: ${process.env.JIRA_BASE_URL}:${PORT}/webhook`);
    console.log(`Mock JIRA base URL: ${process.env.JIRA_BASE_URL}:${PORT}`);
});
