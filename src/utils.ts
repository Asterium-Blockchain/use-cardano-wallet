import { decode } from 'cbor-x';

export const fromHex = (hexString: string) => Buffer.from(hexString, 'hex');

export const parseBalance = (balance: string) => {
  const decodedBalance = decode(fromHex(balance));

  const lovelace =
    typeof decodedBalance === 'number'
      ? decodedBalance.toString()
      : (decodedBalance[0] ?? 0).toString();

  return lovelace;
};
