const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // Allows frontend form requests

// Set your target WhatsApp Group ID here
const TARGET_GROUP_ID = '120363294698480815@g.us';

// Initialize WhatsApp Web Client with saved session
const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    console.log('Scan QR Code with WhatsApp:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ WhatsApp Bot is authenticated and running!');
});

// Endpoint to receive complaint submissions
app.post('/api/submit-complaint', async (req, res) => {
    try {
        const { name, phone, department, issue } = req.body;

        if (!name || !issue) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        // Format message
        const message = `🚨 *NEW COMPLAINT SUBMISSION*\n\n` +
                        `👤 *Name:* ${name}\n` +
                        `📞 *Contact:* ${phone || 'N/A'}\n` +
                        `🏢 *Department:* ${department || 'General'}\n` +
                        `📝 *Issue Description:*\n${issue}\n\n` +
                        `⏰ *Submitted:* ${new Date().toLocaleString()}`;

        // Send to WhatsApp Group
        await client.sendMessage(TARGET_GROUP_ID, message);

        res.status(200).json({ success: true, message: 'Complaint posted to WhatsApp group' });
    } catch (err) {
        console.error('Error posting to WhatsApp:', err);
        res.status(500).json({ success: false, error: 'Failed to post message' });
    }
});

client.initialize();

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});