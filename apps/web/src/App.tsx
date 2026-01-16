import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Honolulu App</h1>
      <p>Start building your app here.</p>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
    </div>
  );
}

export default App;
