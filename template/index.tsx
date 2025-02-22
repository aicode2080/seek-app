import React, { useEffect } from 'react';
import styles from './index.module.css';

const ReactModule = () => {
  useEffect(() => {
    console.log('React Module');
  }, []);
  return <div>React Module</div>;
};
