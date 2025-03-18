const { google } = require('googleapis');
const keys = require('../service-account-key.json');

exports.handler = async function(event, context) {
    console.log("Function invoked with event:", event);

    try {
        const body = JSON.parse(event.body || '{}');
        console.log("Parsed body:", body);

        const action = body.action;
        if (!action) {
            throw new Error("No action specified in request body");
        }

        const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzIbp6v4hQhfDaK4PPldbkWSlOy_Oo5G17A1t3vpVfKGVw4pd6p8WN8rc5z_3fXT8ejDQ/exec"; // Ersetze dies mit deiner URL

        if (action === 'registerPlayer') {
            const username = body.username;
            const password = body.password;
            console.log("Registering player with username:", username);

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
        } else if (action === 'updatePlayerData') {
            console.log("Updating player data for username:", body.username);

            const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'updatePlayerData',
                    username: body.username,
                    password: body.password,
                    balance: body.balance,
                    bankBalance: body.bankBalance,
                    memecoins: body.memecoins,
                    hasHouse: body.hasHouse,
                    credits: body.credits,
                    invoices: body.invoices,
                    cars: body.cars,
                    investmentValue: body.investmentValue,
                    stocksValue: body.stocksValue,
                    lastWorkTime: body.lastWorkTime,
                    countdownTime: body.countdownTime
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