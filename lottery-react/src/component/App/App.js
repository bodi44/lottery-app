import React, { useEffect, useState } from 'react';
import lottery from '../../lottery';
import web3 from '../../web3';

const App = () => {
  const [manager, setManager] = useState('');

  useEffect(() => {
    const getManager = async () => {
      const newManager = await lottery.methods.manager().call();
      console.log(newManager);
      setManager(newManager);
    }

    getManager();
  }, []);

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>This contract is managed by {manager}</p>
    </div>
  );
};

export default App;
