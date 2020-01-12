import React, { useEffect, useState } from 'react';
import {
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import lottery from '../../lottery';
import web3 from '../../web3';
import styles from './App.module.scss';

const App = () => {
  const [manager, setManager] = useState('');
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState('');
  const [donateValue, setDonateValue] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async event => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    setMessage('Waiting on transaction success...');
    setSuccess(false);
    setLoading(true);
    setDonateValue('');

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(donateValue, 'ether'),
    });

    setMessage('You have been entered!');
    setSuccess(true);
    setLoading(false);
  };

  const handleInputChange = event => {
    setDonateValue(event.target.value);
  };

  const pickWinner = async () => {
    const accounts = await web3.eth.getAccounts();

    setMessage('Waiting on transaction success...');
    setSuccess(false);
    setLoading(true);

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    const winner = await lottery.methods.getWinner().call();

    setMessage(`The winner is ${winner}`);
    setSuccess(true);
    setLoading(false);
  };

  const renderStatus = () => {
    if (message) {
      return success ? (
        <Alert icon={false} severity="success" className={styles.alert}>
          {message}
          {loading ? (
            <CircularProgress className={styles.circleProgress} />
          ) : null}
        </Alert>
      ) : (
        <Alert icon={false} severity="info" className={styles.alert}>
          {message}
          {loading ? (
            <CircularProgress className={styles.circleProgress} />
          ) : null}
        </Alert>
      );
    } else {
      return null;
    }
  };

  useEffect(() => {
    const getLotteryData = async () => {
      const newManager = await lottery.methods.manager().call();
      const newPlayers = await lottery.methods.getPlayers().call();
      const newBalance = await web3.eth.getBalance(lottery.options.address);
      setManager(newManager);
      setPlayers(newPlayers);
      setBalance(newBalance);
    };

    getLotteryData();
  }, [message]);

  return (
    <div className={styles.container}>
      <Typography variant="h2">Lottery Contract</Typography>
      <div className={styles.description}>
        <Typography variant="h4" className={styles.manager}>
          Contract manager: {manager}
        </Typography>
        <Typography variant="h4" className={styles.manager}>
          Currently players entered competition: {players.length}
        </Typography>
        <Typography variant="h4" className={styles.manager}>
          Compotition prize fund: {web3.utils.fromWei(balance, 'ether')} ether!
        </Typography>
      </div>
      <Paper className={styles.paperContainer}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h4" className={styles.subtitle}>
            Want to try luck?(minimum amount 0.01 ether)
          </Typography>
          <div className={styles.enterLotteryInput}>
            <TextField
              className={styles.inputField}
              required
              label="Amount of ether to enter"
              variant="outlined"
              value={donateValue}
              onChange={handleInputChange}
            />
            <Button
              type="submit"
              className={styles.submitButtom}
              variant="contained"
              color="primary"
            >
              Enter
            </Button>
          </div>
        </form>
      </Paper>
      <Paper className={styles.paperContainer}>
        <Typography variant="h4" className={styles.subtitle}>
          Ready to pick a winner?
        </Typography>
        <Button variant="contained" color="primary" onClick={pickWinner}>
          Pick a winner!
        </Button>
      </Paper>
      <div>{renderStatus()}</div>
    </div>
  );
};

export default App;
