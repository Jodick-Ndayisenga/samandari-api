const ably = require('ably');

exports.ablyUserConnection = async (req, res) => {
    const userId = req.query.clientId;
    const client = new ably.Rest(process.env.ABLY_API_KEY);
    const tokenRequestData = await client.auth.createTokenRequest({
        clientId: userId,
      });

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    if(tokenRequestData) {
        res.status(200).json(tokenRequestData);
    }
};

