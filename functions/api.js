exports.handler = async function(event, context) {
    console.log("Function invoked with event:", event);
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        body: JSON.stringify({ success: true, message: "Test successful" })
    };
};