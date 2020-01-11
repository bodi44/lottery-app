import React, { useEffect, useState } from 'react';
import lottery from './lottery';
import logo from './logo.svg';
import './App.css';

const App = () => {
  const [manager, setManager] = useState('');

  useEffect(async () => {
    const newManager = await lottery.methods.manager().call();
    setManager(newManager);
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
};

export default App;
