// functions/api.js
exports.handler = async (event, context) => {
  const body = JSON.parse(event.body || '{}');
  const { action, username, password } = body;

  if (action === 'registerPlayer') {
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: `Registrierung für ${username}` }),
    };
  } else if (action === 'getPlayerData') {
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: { username, password, balance: 100, bankBalance: 0, memecoins: {} },
      }),
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify({ success: false, error: 'Unbekannte Aktion' }),
  };
};