import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import styles from './index.module.less'

const App = () => {
  const [first, setfirst] = useState(0)
  return <div className={styles.button} onClick={() => {
    setfirst(first + 1)
  }}>Seek App{first}</div>;
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
