
const jwt = require('jsonwebtoken');
const { jellyfinLogin } = require('../../lib/jellyfin');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { baseUrl, username, password } = req.body || {};
  if (!baseUrl || !username || !password) return res.status(400).json({ error: 'Missing fields' });

  try {
    const loginResp = await jellyfinLogin(baseUrl, username, password);
    const payload = { jellyfin: { baseUrl, accessToken: loginResp.AccessToken, userId: loginResp.User.Id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Login error' });
  }
};
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb'
    }
  }
};

