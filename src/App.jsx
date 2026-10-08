import { useState } from 'react';
import GrowthControlTower from '../GrowthControlTower.jsx';
import Login from './Login.jsx';

export default function App() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('gct-auth') === 'true');

  if (!authed) {
    return <Login onSuccess={() => setAuthed(true)} />;
  }
  return <GrowthControlTower />;
}
