import { bech32 } from 'bech32';
import produce from 'immer';
import create from 'zustand';

import { NetworkId, WalletApi, WalletName } from '../typescript/cip30';
import { walletPrettyNames } from '../wallets';
import { fromHex, parseBalance } from '../utils';

export interface DetectedWallet {
  name: WalletName;
  icon: string;
  displayName: string;
}

export type State = {
  isConnected: boolean;
  isConnecting: boolean;
  isRefetchingBalance: boolean;

  detectedWallets: DetectedWallet[];

  address: null | string;

  rewardAddress: null | string;

  /**
   * The wallet that was selected to connect.
   */
  selectedWallet: null | string;

  /**
   * The wallet that is currently connected.
   */
  connectedWallet: null | string;

  lovelaceBalance: null | number;
  api: null | WalletApi;
  network: null | NetworkId;

  connect: (walletName: WalletName, localStorageKey: string) => Promise<void>;
  getDetectedWallets: () => void;
  disconnect: () => void;
  refetchBalance: () => Promise<void>;
};

const defaults = {
  isConnecting: false,
  isConnected: false,
  detectedWallets: [],
  address: null,
  lovelaceBalance: null,
  api: null,
  selectedWallet: null,
  connectedWallet: null,
  network: null,
  isRefetchingBalance: false,
  rewardAddress: null,
};

export const useStore = create<State>()((set, get) => ({
  ...defaults,
  disconnect: () => {
    set(defaults);
  },

  refetchBalance: async () => {
    const api = get().api;

    if (api === null) return;

    set(
      produce((draft: State) => {
        draft.isRefetchingBalance = true;
      })
    );

    const balance = await api.getBalance();
    const lovelace = parseBalance(balance);

    set(
      produce((draft: State) => {
        draft.isRefetchingBalance = false;
        draft.lovelaceBalance = lovelace;
      })
    );
  },

  getDetectedWallets: async () => {
    if (typeof window === 'undefined' || !(window as any).cardano) {
      return;
    }

    const ns = (window as any).cardano;

    set(
      produce((draft: State) => {
        draft.detectedWallets = Object.keys(ns)
          .filter(ns => Object.values(WalletName).includes(ns as WalletName))
          .map(n => ({
            name: n as WalletName,
            displayName: walletPrettyNames[n as WalletName],
            icon: ns[n].icon,
          }));
      })
    );
  },

  connect: async (walletName: WalletName, localStorageKey: string) => {
    set(
      produce((draft: State) => {
        draft.isConnecting = true;
        draft.selectedWallet = walletName;
      })
    );

    try {
      // Exit early if the Cardano dApp-Wallet Web Bridge (CIP 30) has not been injected
      // This can happen in a SSR scenario for example
      if (typeof window === 'undefined' || !(window as any).cardano) {
        throw Error('window.cardano is undefined');
      }

      const api: WalletApi = await (window as any).cardano[walletName].enable();
      let rawAddress = await api.getChangeAddress();
      if (!rawAddress) {
        [rawAddress] = await api.getUsedAddresses();
      }
      if (!rawAddress) {
        [rawAddress] = await api.getUnusedAddresses();
      }

      let [rewardAddress] = await api.getRewardAddresses();

      if (rewardAddress) {
        const buf = fromHex(rewardAddress);
        const words = bech32.toWords(buf);
        rewardAddress = bech32.encode(
          buf[0] === NetworkId.MAINNET ? 'stake' : 'stake_test',
          words,
          130
        );
      }

      const address = fromHex(rawAddress);
      const balance = await api.getBalance();

      const decodedBalance = parseBalance(balance);
      const words = bech32.toWords(address);

      const bechAddr = bech32.encode(
        address[0] === NetworkId.MAINNET ? 'addr' : 'addr_test',
        words,
        130
      );

      localStorage.setItem(localStorageKey, walletName);

      set(
        produce((draft: State) => {
          draft.isConnecting = false;
          draft.isConnected = true;
          draft.api = api;
          draft.lovelaceBalance = decodedBalance;
          draft.rewardAddress = rewardAddress;
          draft.address = bechAddr;
          draft.network = address[0] as NetworkId;
          draft.connectedWallet = walletName;
        })
      );
    } catch (e) {
      console.error(e);
      set(
        produce((draft: State) => {
          draft.isConnecting = false;
          draft.selectedWallet = null;
        })
      );
    }
  },
}));
