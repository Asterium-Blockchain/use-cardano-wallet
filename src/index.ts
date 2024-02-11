import { useEffect } from 'react';

import { useStore, DetectedWallet as _, State } from './store';
import { WalletName } from './typescript/cip30';

export type UseCardanoWalletOptions = {
  /**
   * Specify if the connector should automatically try to connect
   * to previously connected wallets. Relies on localStorage.
   */
  autoConnect?: boolean;

  /**
   * Specify a local storage key to store the connected wallet name
   */
  localStorageKey?: string;

  /**
   * If specified, it will call `api.getUtxos()` using the specified
   * interval (in milliseconds). When `utxos` is referenced from the
   * hook, it will return the prefetched array.
   *
   * This is useful for saving on load times when building transactions.
   */
  // prefetchUtxosInterval?: number | null;
};

const defaultOptions: UseCardanoWalletOptions = {
  autoConnect: true,
  localStorageKey: 'cardano-wallet-name',
  // prefetchUtxosInterval: null,
};

type ReturnVal = Omit<State, 'connect' | 'getDetectedWallets'> & {
  connect: (walletName: WalletName) => Promise<void>;
};

const useCardanoWallet = ({
  autoConnect = true,
  localStorageKey = 'cardano-wallet-name',
}: UseCardanoWalletOptions = defaultOptions): ReturnVal => {
  const { connect: connectWithStore, getDetectedWallets, ...rest } = useStore();

  useEffect(() => {
    getDetectedWallets();
  }, [getDetectedWallets]);

  useEffect(() => {
    // Check localStorage in case we are in SSR
    if (autoConnect && typeof localStorage !== 'undefined') {
      const connectedWalletName = localStorage.getItem(
        localStorageKey
      ) as WalletName | null;

      if (!connectedWalletName) {
        return;
      }

      // Setting timeout to let the wallet be injected and not get undefined
      setTimeout(() => {
        connectWithStore(connectedWalletName, localStorageKey);
      }, 10);
    }
  }, [autoConnect, localStorageKey, connectWithStore]);

  const connect = async (walletName: WalletName) => {
    await connectWithStore(walletName, localStorageKey);
  };

  return { connect, ...rest };
};

export * from './typescript/cip30';

export default useCardanoWallet;
