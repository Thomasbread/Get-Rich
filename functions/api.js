exports.handler = async function(event, context) {
  console.log("Function invoked with event:", event);

  // Parse the request body
  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (error) {
    console.error("Failed to parse request body:", error);
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, error: "Invalid request body" })
    };
  }
  console.log("Parsed body:", body);

  const { action, username, password } = body;

  // Validate required fields
  if (!action) {
    console.log("Missing action parameter");
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, error: "Missing action parameter" })
    };
  }

  if (!username || !password) {
    console.log("Missing username or password:", { username, password });
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, error: "Missing username or password" })
    };
  }

  // Log the received action for debugging
  console.log("Received action:", action);

  // Normalize the action (remove spaces, convert to lowercase)
  const normalizedAction = action.trim().toLowerCase();
  console.log("Normalized action:", normalizedAction);

  // Handle the action
  switch (normalizedAction) {
    case "registerplayer":
      console.log("Handling registerPlayer for:", username);
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true })
      };

    case "getplayerdata":
      console.log("Handling getPlayerData for:", username);
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          data: {
            username: username,
            balance: 100.00,
            bankBalance: 0.00,
            memecoins: {
              PEPE: { unlocked: false, value: 0, price: 0.5, leverage: 1, prevPrice: 0 },
              PEIPEI: { unlocked: false, value: 0, price: 0.5, leverage: 1, prevPrice: 0 },
              GIGACHAD: { unlocked: false, value: 0, price: 0.5, leverage: 1, prevPrice: 0 },
              GAMESTOP: { unlocked: false, value: 0, price: 0.5, leverage: 1, prevPrice: 0 }
            }
          }
        })
      };

    default:
      console.log("Unbekannte Aktion nach Normalisierung:", normalizedAction);
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "Unbekannte Aktion" })
      };
  }
};