import { useState } from 'react';
import { Lock } from 'lucide-react';
import { T, FS, FU, BrandMark } from '../GrowthControlTower.jsx';

const VALID_USER = 'gtmuser';
const VALID_PASS = 'gtm-tower';

export default function Login({ onSuccess }) {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (id === VALID_USER && pw === VALID_PASS) {
      sessionStorage.setItem('gct-auth', 'true');
      setError('');
      onSuccess();
    } else {
      setError('Incorrect ID or password.');
    }
  }

  return (
    <div
      className="flex items-center justify-center"
      style={{ minHeight: '100vh', background: T.deck, fontFamily: FU }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: T.panel, border: `1px solid ${T.rule}`, borderRadius: 4,
          padding: '32px 36px', width: 340, boxShadow: '0 12px 32px rgba(25,25,26,0.12)',
        }}
      >
        <div style={{ marginBottom: 22 }}>
          <BrandMark height={34} />
        </div>
        <div
          style={{
            fontFamily: FS, fontSize: 19, color: T.navy, marginBottom: 4, letterSpacing: '-0.01em',
          }}
        >
          Assisted Decisioning System
        </div>
        <div style={{ fontFamily: FU, fontSize: 12, color: T.ink60, marginBottom: 22 }}>
          Sign in to continue
        </div>

        <label style={{ display: 'block', fontFamily: FU, fontSize: 11.5, color: T.ink60, marginBottom: 5 }}>
          ID
        </label>
        <input
          autoFocus
          value={id}
          onChange={(e) => setId(e.target.value)}
          style={{
            width: '100%', boxSizing: 'border-box', fontFamily: FU, fontSize: 13.5,
            color: T.ink, padding: '8px 10px', marginBottom: 14,
            border: `1px solid ${T.rule}`, borderRadius: 3, background: T.deck,
          }}
        />

        <label style={{ display: 'block', fontFamily: FU, fontSize: 11.5, color: T.ink60, marginBottom: 5 }}>
          Password
        </label>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          style={{
            width: '100%', boxSizing: 'border-box', fontFamily: FU, fontSize: 13.5,
            color: T.ink, padding: '8px 10px', marginBottom: 14,
            border: `1px solid ${T.rule}`, borderRadius: 3, background: T.deck,
          }}
        />

        {error && (
          <div style={{ fontFamily: FU, fontSize: 12, color: T.risk, marginBottom: 14 }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          className="flex items-center justify-center"
          style={{
            width: '100%', gap: 7, fontFamily: FU, fontSize: 13, fontWeight: 600,
            color: '#fff', background: T.navy, border: 'none', borderRadius: 3,
            padding: '10px 0', cursor: 'pointer',
          }}
        >
          <Lock size={13} /> Sign in
        </button>
      </form>
    </div>
  );
}
