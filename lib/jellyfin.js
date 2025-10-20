
const fetch = require('node-fetch');

async function jellyfinLogin(baseUrl, username, password) {
  const url = `${baseUrl.replace(/\/$/, '')}/Users/AuthenticateByName`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ Username: username, Pw: password })
  });
  if (!res.ok) throw new Error('Login failed: ' + res.status);
  return res.json();
}

module.exports = { jellyfinLogin };
