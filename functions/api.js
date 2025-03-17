const { google } = require('googleapis');
const keys = require('../service-account-key.json');

exports.handler = async function(event, context) {
    console.log("Function invoked with event:", event);

    try {
        // Parse den eingehenden Request
        const body = JSON.parse(event.body || '{}');
        console.log("Parsed body:", body);

        const action = body.action;
        if (!action) {
            throw new Error("No action specified in request body");
        }

        // URL des Google Apps Script Web-App-Endpunkts
        const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwYY7-Jhx9GMu-UWCOrt5-Ql9870P9I8mzgaER4lEislG7P9aO0A0nK1ArYj5olzSjVwQ/exec"; // Ersetze dies mit der URL deiner Web-App

        if (action === 'registerPlayer') {
            const username = body.username;
            const password = body.password;
            console.log("Registering player with username:", username);

            // Sende die Registrierungsanfrage an Google Apps Script
            const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'registerPlayer',
                    username: username,
                    password: password
                })
            });

            const result = await response.json();
            console.log("Response from Google Apps Script:", result);

            return {
                statusCode: response.status,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS'
                },
                body: JSON.stringify(result)
            };
        } else if (action === 'getPlayerData') {
            // Ähnliche Logik für Anmeldung
            const username = body.username;
            const password = body.password;
            console.log("Fetching player data for username:", username);

            const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'getPlayerData',
                    username: username,
                    password: password
                })
            });

            const result = await response.json();
            console.log("Response from Google Apps Script:", result);

            return {
                statusCode: response.status,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS'
                },
                body: JSON.stringify(result)
            };
        } else {
            throw new Error(`Unsupported action: ${action}`);
        }
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