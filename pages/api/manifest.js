
const jwt = require('jsonwebtoken');

function makeManifest() {
  return {
    id: 'community.jellyfin.useraddon',
    version: '1.0.0',
    name: 'Jellyfin (user) - private',
    description: 'Private Jellyfin library (user-level) via Vercel',
    resources: ['catalog', 'stream'],
    types: ['movie', 'series'],
    catalogs: [
      { type: 'movie', id: 'jellyfin_movies', name: 'My Jellyfin Movies' },
      { type: 'series', id: 'jellyfin_series', name: 'My Jellyfin Series' }
    ]
  };
}

module.exports = async (req, res) => {
  const token = req.query.token;
  if (!token) return res.status(400).json({ error: 'token required' });
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.json(makeManifest());
  } catch {
    res.status(401).json({ error: 'invalid token' });
  }
};
