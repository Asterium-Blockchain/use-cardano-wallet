import { Encoder } from 'cbor-x';
import { WalletName } from './typescript/cip30';
import { WalletInfo } from './store';
import { walletPrettyNames } from './wallets';

export const fromHex = (hexString: string) => Buffer.from(hexString, 'hex');

export const parseBalance = (balance: string) => {
  const encoder = new Encoder({ mapsAsObjects: false });
  const decodedBalance = encoder.decode(Buffer.from(balance, 'hex'));

  if (typeof decodedBalance === 'bigint') {
    return decodedBalance.toString();
  }
  if (typeof decodedBalance === 'number') {
    return decodedBalance.toString();
  }
  return (decodedBalance[0] ?? 0).toString();
};

export const toWalletInfo = (walletName: WalletName): WalletInfo => {
  const ns = (window as any).cardano;

  return {
    name: walletName,
    displayName: walletPrettyNames[walletName],
    icon: ns[walletName].icon,
  };
};
