# use-cardano-wallet

A simple react hook to connect your application to cardano wallets. This library does not take care of transaction building. For that, you should use something like [Lucid](https://github.com/Berry-Pool/lucid).

> ℹ This library does not depend on `cardano-serialization-lib`, so you don't have to worry about big budle sizes!

## Installation

```
npm i @asterium-dev/use-cardano-wallet
```

```
yarn add @asterium-dev/use-cardano-wallet
```

## Basic usage

```ts
const {
  connect,
  isConnecting,
  isConnected,
  lovelaceBalance,
  address,
  network,
  selectedWallet,
  connectedWallet,
  api,
  disconnect,
  isRefetchingBalance,
  refetchBalance,
} = useCardanoWallet();
```

## Example

Check out the example in [this](./example/) folder

---

## API

▸ **useCardanoWallet**(`options?`): ReturnVal

### Parameters

| Name      | Type                    | Default value    |
| :-------- | :---------------------- | :--------------- |
| `options` | UseCardanoWalletOptions | `defaultOptions` |

### UseCardanoWalletOptions:

| Name               | Type    | Description                                                                                                           |
| :----------------- | :------ | :-------------------------------------------------------------------------------------------------------------------- |
| `autoConnect?`     | boolean | Specify if the connector should automatically try to connect to previously connected wallets. Relies on localStorage. |
| `localStorageKey?` | string  | Specify a local storage key to store the connected wallet name                                                        |

### Returns object:

| Name                  | Type              | Description                                                                      |
| :-------------------- | :---------------- | :------------------------------------------------------------------------------- |
| `address`             | null \| string    | bech32 representation of the wallet address                                      |
| `api`                 | null \| WalletApi | The [CIP30](https://cips.cardano.org/cips/cip30/) object of the connected wallet |
| `connect`             | Function          | Primary function to connect the desired wallet                                   |
| `connectedWallet`     | null \| string    | The wallet that is currently connected.                                          |
| `disconnect`          | Function          | Disconnects the current wallet                                                   |
| `isConnected`         | boolean           | True if the wallet is connected                                                  |
| `isConnecting`        | boolean           | Loading indicator for the wallet connection                                      |
| `isRefetchingBalance` | boolean           | Loading indicator for balance refetch                                            |
| `lovelaceBalance`     | null \| number    | Wallet balance, in lovelace (1 ADA = 1000000 lovelace)                           |
| `network`             | null \| NetworkId | 0 if testnet, 1 if mainnet                                                       |
| `refetchBalance`      | Function          | Refresh the wallet's balance                                                     |
| `selectedWallet`      | null \| string    | The wallet that was selected to connect.                                         |
