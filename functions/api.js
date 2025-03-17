const { google } = require('googleapis');

exports.handler = async function(event, context) {
    console.log("Function invoked with event:", event);

    // CORS-Header für alle Antworten
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // OPTIONS-Anfrage für CORS Preflight behandeln
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    // Parse request body
    let body;
    try {
        body = JSON.parse(event.body || '{}');
    } catch (error) {
        console.error("Failed to parse request body:", error);
        return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: "Invalid request body" }) };
    }
    console.log("Parsed body:", body);

    const { action, username, password, balance, bankBalance, memecoins, hasHouse, credits, invoices, cars, investmentValue, stocksValue, lastWorkTime, countdownTime } = body;

    if (!action || !username || !password) {
        console.log("Missing required parameters");
        return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: "Missing required parameters" }) };
    }

    // Google Sheets Authentifizierung
    const auth = new google.auth.GoogleAuth({
        keyFile: './service-account-key.json', // Stelle sicher, dass diese Datei im Projektverzeichnis liegt
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1eRYBV8zfSXhPnCBTHIIkSJkbUJyA_UflaDBL2SE_mfc'; // Deine Spreadsheet-ID

    const normalizedAction = action.trim().toLowerCase();
    switch (normalizedAction) {
        case "registerplayer":
            console.log("Handling registerPlayer for:", username);
            const regValues = [[username, password, 100.00, 0.00, '{}', 'true', '[]', '[]', '[]', 0.00, 0.00, 0, 60]];
            await sheets.spreadsheets.values.append({
                spreadsheetId,
                range: 'Sheet1!A:M',
                valueInputOption: 'RAW',
                resource: { values: regValues },
            });
            return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: `Spieler ${username} registriert` }) };

        case "getplayerdata":
            console.log("Handling getPlayerData for:", username);
            const getResponse = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range: 'Sheet1!A:M',
            });
            const rows = getResponse.data.values || [];
            const playerRow = rows.find(row => row[0] === username && row[1] === password);
            if (playerRow) {
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        success: true,
                        data: {
                            username: playerRow[0],
                            balance: parseFloat(playerRow[2]) || 100.00,
                            bankBalance: parseFloat(playerRow[3]) || 0.00,
                            memecoins: JSON.parse(playerRow[4] || '{}'),
                            hasHouse: playerRow[5] === 'true',
                            credits: JSON.parse(playerRow[6] || '[]'),
                            invoices: JSON.parse(playerRow[7] || '[]'),
                            cars: JSON.parse(playerRow[8] || '[]'),
                            investmentValue: parseFloat(playerRow[9]) || 0.00,
                            stocksValue: parseFloat(playerRow[10] || 0.00,
                            lastWorkTime: parseInt(playerRow[11]) || 0,
                            countdownTime: parseInt(playerRow[12]) || 60
                        }
                    })
                };
            }
            return { statusCode: 404, headers, body: JSON.stringify({ success: false, error: "Player not found or wrong password" }) };

        case "updateplayer":
            console.log("Handling updatePlayer for:", username);
            const updateValues = [
                [
                    username,
                    password,
                    balance || 0,
                    bankBalance || 0,
                    JSON.stringify(memecoins || {}),
                    hasHouse !== undefined ? hasHouse.toString() : 'false',
                    JSON.stringify(credits || []),
                    JSON.stringify(invoices || []),
                    JSON.stringify(cars || []),
                    investmentValue || 0,
                    stocksValue || 0,
                    lastWorkTime || 0,
                    countdownTime || 60
                ]
            ];

            const existingData = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range: 'Sheet1!A:M',
            });
            const rowsUpdate = existingData.data.values || [];
            const rowIndex = rowsUpdate.findIndex(row => row[0] === username);

            if (rowIndex >= 0) {
                // Update vorhandenen Eintrag
                await sheets.spreadsheets.values.update({
                    spreadsheetId,
                    range: `Sheet1!A${rowIndex + 1}:M${rowIndex + 1}`,
                    valueInputOption: 'RAW',
                    resource: { values: updateValues },
                });
            } else {
                // Neuen Eintrag hinzufügen
                await sheets.spreadsheets.values.append({
                    spreadsheetId,
                    range: 'Sheet1!A:M',
                    valueInputOption: 'RAW',
                    resource: { values: updateValues },
                });
            }
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    message: `Spielstand für ${username} erfolgreich aktualisiert`
                })
            };

        default:
            console.log("Unbekannte Aktion:", normalizedAction);
            return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: "Unbekannte Aktion" }) };
    }
};