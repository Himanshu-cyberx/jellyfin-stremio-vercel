
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { token, id } = req.query;
  if (!token || !id) return res.status(400).json({ error: 'token and id required' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { baseUrl, accessToken } = payload.jellyfin;
    const url = `${baseUrl.replace(/\/$/, '')}/Videos/${id}/stream?Static=true&api_key=${accessToken}`;
    res.json({ streams: [{ title: 'Play from Jellyfin', url }] });
  } catch {
    res.status(401).json({ error: 'invalid token' });
  }
};
