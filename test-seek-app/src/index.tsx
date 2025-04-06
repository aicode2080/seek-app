import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import styles from './index.module.less';
import './global.css';

const App = () => {
  const [first, setfirst] = useState(0);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-4">Seek App Demo</h1>
        <p className="text-gray-700 mb-4">计数: {first}</p>
        <div className="flex space-x-2">
          <button 
            onClick={() => setfirst(first + 1)}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
          >
            增加
          </button>
          <button 
            onClick={() => setfirst(Math.max(0, first - 1))}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
          >
            减少
          </button>
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800">这是一个 Tailwind CSS 示例</p>
        </div>
        <div className={styles.button}>自定义样式</div>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
