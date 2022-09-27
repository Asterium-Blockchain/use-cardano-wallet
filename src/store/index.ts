import produce from 'immer';
import create from 'zustand';
import { NetworkId, WalletApi, WalletName } from '../typescript/cip30';
import cbor from 'cbor';
import { fromHex } from '../utils';
import { bech32 } from 'bech32';

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
      const api: WalletApi = await (window as any).cardano[walletName].enable();

      let addresses = await api.getUnusedAddresses();
      if(addresses.length == 0)
        addresses = await api.getUsedAddresses();
      
      const address = fromHex(addresses[0]);
      const words = bech32.toWords(address);

      const bechAddr = bech32.encode(
        address[0] == NetworkId.MAINNET ? 'addr' : 'addr_test',
        words,
        130
      );
      let decodedBalance = 0;
      try{
        const balance = await api.getBalance();
        decodedBalance = cbor.decode(fromHex(balance)) ?? 0;
      }catch(e){}
      
      localStorage.setItem(localStorageKey, walletName);

      set(
        produce((draft: State) => {
          draft.isConnecting = false;
          draft.isConnected = true;
          draft.api = api;
          draft.lovelaceBalance = decodedBalance;
          draft.address = bechAddr;
          draft.network = address[0] as NetworkId;
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
