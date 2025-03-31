import React, { useEffect } from 'react';
import styles from './index.module.css';

const ReactModule = () => {
  useEffect(() => {
    console.log('我是自动化创建文件');
  }, []);
  return <div>React Module</div>;
};
