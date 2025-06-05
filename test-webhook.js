import axios from 'axios';

async function sendTestWebhook() {
    try {
        const webhookUrl = '${process.env.JIRA_BASE_URL}:${process.env.PORT}/webhook';
        
        const testPayload = {
            issue: {
                key: 'TEST-123',
                fields: {
                    status: {
                        name: 'Ready to pay'
                    }
                }
            }
        };

        console.log('Sending test webhook...');
        const response = await axios.post(webhookUrl, testPayload);
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error sending webhook:', error.message);
    }
}

sendTestWebhook(); 