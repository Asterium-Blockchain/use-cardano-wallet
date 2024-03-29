import { decode } from 'cbor-x';

export const fromHex = (hexString: string) => Buffer.from(hexString, 'hex');

export const parseBalance = (balance: string) => {
  const decodedBalance = decode(fromHex(balance));

  if (typeof decodedBalance === 'bigint') {
    return decodedBalance.toString();
  }
  if (typeof decodedBalance === 'number') {
    return decodedBalance.toString();
  }
  return (decodedBalance[0] ?? 0).toString();
};
