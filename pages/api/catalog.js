
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { token, type } = req.query;
  if (!token) return res.status(400).json({ error: 'token required' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { baseUrl, accessToken, userId } = payload.jellyfin;
    const includeTypes = type === 'series' ? 'Series' : 'Movie';
    const url = `${baseUrl.replace(/\/$/, '')}/Users/${userId}/Items?IncludeItemTypes=${includeTypes}&Recursive=true&Limit=100`;
    const r = await fetch(url, { headers: { 'X-Emby-Token': accessToken } });
    const data = await r.json();
    const metas = (data.Items || []).map(item => ({
      id: item.Id,
      type: type === 'series' ? 'series' : 'movie',
      name: item.Name,
      poster: `${baseUrl.replace(/\/$/, '')}/Items/${item.Id}/Images/Primary?fill=true&tag=${item.PrimaryImageTag}`
    }));
    res.json({ metas });
  } catch (err) {
    res.status(401).json({ error: 'invalid token or fetch failed' });
  }
};
