const { google } = require('googleapis');
const keys = require('../service-account-key.json');

exports.handler = async function(event, context) {
    console.log("Function invoked with event:", event);

    try {
        console.log("Loading service account keys...");
        console.log("Client email:", keys.client_email);

        const client = new google.auth.JWT(
            keys.client_email,
            null,
            keys.private_key,
            ['https://www.googleapis.com/auth/spreadsheets']
        );
        console.log("JWT client created");

        const sheets = google.sheets({ version: 'v4', auth: client });
        console.log("Google Sheets API initialized");

        // Logik für Google Sheets hier (z. B. Daten lesen oder schreiben)
        // Fürs Debugging vorerst leer lassen oder nur eine einfache Operation
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: JSON.stringify({ success: true, message: "Google Sheets integration successful" })
        };
    } catch (error) {
        console.error("Error in Netlify function:", error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: JSON.stringify({ success: false, error: error.message })
        };
    }
};