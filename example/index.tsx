import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import useCardanoWallet, { WalletName } from '../.';

const App = () => {
  const {
    connect,
    isConnecting,
    lovelaceBalance,
    address,
    network,
    selectedWallet,
    connectedWallet,
  } = useCardanoWallet();
  return (
    <div
      style={{
        padding: '10%',
        fontFamily: 'Arial',
      }}
    >
      {Object.values(WalletName).map(walletName => (
        <button
          onClick={() => connect(walletName)}
          style={{ margin: '.5em' }}
          key={walletName}
        >
          {isConnecting && selectedWallet === walletName
            ? 'Connecting...'
            : `Connect ${walletName}`}
        </button>
      ))}
      <ul>
        <li>Address: {address}</li>
        <li>Network: {network}</li>
        <li>
          Balance:{' '}
          {typeof lovelaceBalance === 'number' &&
            `${lovelaceBalance / 1000000}ADA`}
        </li>
        <li>Selected wallet: {selectedWallet}</li>
        <li>Connected wallet: {connectedWallet}</li>
      </ul>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
