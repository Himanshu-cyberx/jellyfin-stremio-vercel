
import React, { useState } from 'react';

export default function Home() {
  const [baseUrl, setBaseUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [manifestUrl, setManifestUrl] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const resp = await fetch('/api/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ baseUrl, username, password })
    });
    const data = await resp.json();
    if (!resp.ok) return setError(data.error || 'Login failed');
    const token = data.token;
    const url = `${window.location.origin}/api/manifest?token=${encodeURIComponent(token)}`;
    setManifestUrl(url);
  }

  return (
    <div style={{ maxWidth: 720, margin: '2rem auto', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Jellyfin Stremio Addon</h1>
      <form onSubmit={handleSubmit}>
        <label>Jellyfin server URL</label>
        <input value={baseUrl} onChange={e=>setBaseUrl(e.target.value)} placeholder="https://jellyfin.example:8096" style={{width:'100%'}} />
        <label>Username</label>
        <input value={username} onChange={e=>setUsername(e.target.value)} style={{width:'100%'}} />
        <label>Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%'}} />
        <button type="submit">Create private manifest</button>
      </form>
      {error && <p style={{color:'red'}}>{error}</p>}
      {manifestUrl && (
        <div>
          <h3>Private manifest URL</h3>
          <pre>{manifestUrl}</pre>
          <p>Copy this into Stremio → Add-ons → Community → Manual.</p>
        </div>
      )}
    </div>
  );
}
