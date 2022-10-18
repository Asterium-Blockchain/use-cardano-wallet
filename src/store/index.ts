import { bech32 } from 'bech32';
import cbor from 'cbor';
import produce from 'immer';
import create from 'zustand';

import { NetworkId, WalletApi, WalletName } from '../typescript/cip30';
import { fromHex } from '../utils';

export type State = {
  isConnected: boolean;
  isConnecting: boolean;
  isRefetchingBalance: boolean;

  address: null | string;

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
  disconnect: () => void;
  refetchBalance: () => Promise<void>;
};

const defaults = {
  isConnecting: false,
  isConnected: false,
  address: null,
  lovelaceBalance: null,
  api: null,
  selectedWallet: null,
  connectedWallet: null,
  network: null,
  isRefetchingBalance: false,
};

const getRawAddress = async (api: WalletApi) => {
  const [rawUnusedAddress] = await api.getUnusedAddresses();

  if (rawUnusedAddress) {
    return fromHex(rawUnusedAddress);
  }

  const [rawUsedAddress] = await api.getUsedAddresses();

  return fromHex(rawUsedAddress);
};

const getAddressInfo = async (api: WalletApi) => {
  const address = await getRawAddress(api);

  const words = bech32.toWords(address);

  const bechAddr = bech32.encode(
    address[0] === NetworkId.MAINNET ? 'addr' : 'addr_test',
    words,
    130
  );

  return {
    address: bechAddr,
    network: address[0] as NetworkId,
  };
};

const getLovelaceBalance = async (api: WalletApi) => {
  const balance = await api.getBalance();

  const [lovelaceBalance] = cbor.decode(fromHex(balance));

  return lovelaceBalance || 0;
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
    const [lovelace] = cbor.decode(fromHex(balance));

    set(
      produce((draft: State) => {
        draft.isRefetchingBalance = false;
        draft.lovelaceBalance = lovelace;
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

      const { address, network } = await getAddressInfo(api);
      const lovelaceBalance = await getLovelaceBalance(api);

      localStorage.setItem(localStorageKey, walletName);

      set(
        produce((draft: State) => {
          draft.isConnecting = false;
          draft.isConnected = true;
          draft.api = api;
          draft.lovelaceBalance = lovelaceBalance;
          draft.address = address;
          draft.network = network;
          draft.connectedWallet = walletName;
        })
      );
    } catch (e) {
      set(
        produce((draft: State) => {
          draft.isConnecting = false;
          draft.selectedWallet = null;
        })
      );
    }
  },
}));
