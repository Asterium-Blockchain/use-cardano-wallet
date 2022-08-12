[use-cardano-wallet](README.md) / Exports

# use-cardano-wallet

## Table of contents

### Enumerations

- [NetworkId](undefined)
- [WalletName](undefined)

### Interfaces

- [Cip30DataSignature](undefined)
- [WalletApi](undefined)

### Type Aliases

- [Bytes](undefined)
- [Cbor](undefined)
- [GetBalance](undefined)
- [GetChangeAddress](undefined)
- [GetCollateral](undefined)
- [GetNetworkId](undefined)
- [GetRewardAddresses](undefined)
- [GetUnusedAddresses](undefined)
- [GetUsedAddresses](undefined)
- [GetUtxos](undefined)
- [Paginate](undefined)
- [SignData](undefined)
- [SignTx](undefined)
- [SubmitTx](undefined)
- [UseCardanoWalletOptions](undefined)
- [WalletMethod](undefined)

### Functions

- [default](undefined)

## Enumerations

### NetworkId

• **NetworkId**: Enum NetworkId

#### Defined in

typescript/cip30.ts:1

___

### WalletName

• **WalletName**: Enum WalletName

#### Defined in

typescript/cip30.ts:171

## Interfaces

### Cip30DataSignature

• **Cip30DataSignature**: Interface Cip30DataSignature

#### Defined in

typescript/cip30.ts:31

___

### WalletApi

• **WalletApi**: Interface WalletApi

#### Defined in

typescript/cip30.ts:177

## Type Aliases

### Bytes

Ƭ **Bytes**: string

A hex-encoded string of the corresponding bytes.

#### Defined in

typescript/cip30.ts:8

___

### Cbor

Ƭ **Cbor**: string

A hex-encoded string representing CBOR either inside
of the Shelley Multi-asset binary spec or, if not present there,
from the CIP-0008 signing spec.

#### Defined in

typescript/cip30.ts:15

___

### GetBalance

Ƭ **GetBalance**: Function

#### Type declaration

▸ (): Promise<Cbor\>

Returns the total balance available of the wallet.

This is the same as summing the results of `api.getUtxos()`, but it is both useful to dApps
and likely already maintained by the implementing wallet in a more efficient manner
so it has been included in the API as well.

**`Throws`**

ApiError

##### Returns

Promise<Cbor\>

#### Defined in

typescript/cip30.ts:84

___

### GetChangeAddress

Ƭ **GetChangeAddress**: Function

#### Type declaration

▸ (): Promise<Cbor\>

Returns an address owned by the wallet that should be used as a change address to return
leftover assets during transaction creation back to the connected wallet.

This can be used as a generic receive address as well.

**`Throws`**

ApiError

##### Returns

Promise<Cbor\>

#### Defined in

typescript/cip30.ts:111

___

### GetCollateral

Ƭ **GetCollateral**: Function

#### Type declaration

▸ (`params?`): Promise<Cbor[] \| null\>

**`Throws`**

ApiError

##### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | Object |
| `params.amount?` | Cbor |

##### Returns

Promise<Cbor[] \| null\>

a list of one or more UTxOs (unspent transaction outputs) controlled by the wallet
that are required to reach AT LEAST the combined ADA value target specified in amount
AND the best suitable to be used as collateral inputs
for transactions with plutus script inputs (pure ADA-only UTxOs).

#### Defined in

typescript/cip30.ts:71

___

### GetNetworkId

Ƭ **GetNetworkId**: Function

#### Type declaration

▸ (): Promise<NetworkId\>

Returns the network id of the currently connected account.
0 is testnet and 1 is mainnet but other networks can possibly be returned by wallets.
Those other network ID values are not governed by this document.

This result will stay the same unless the connected account has changed.

**`Throws`**

ApiError

##### Returns

Promise<NetworkId\>

#### Defined in

typescript/cip30.ts:45

___

### GetRewardAddresses

Ƭ **GetRewardAddresses**: Function

#### Type declaration

▸ (): Promise<Cbor[]\>

Returns the reward addresses owned by the wallet. This can return multiple addresses e.g. CIP-0018.

**`Throws`**

ApiError

##### Returns

Promise<Cbor[]\>

#### Defined in

typescript/cip30.ts:118

___

### GetUnusedAddresses

Ƭ **GetUnusedAddresses**: Function

#### Type declaration

▸ (): Promise<Cbor[]\>

Returns a list of unused addresses controlled by the wallet.

**`Throws`**

ApiError

##### Returns

Promise<Cbor[]\>

#### Defined in

typescript/cip30.ts:101

___

### GetUsedAddresses

Ƭ **GetUsedAddresses**: Function

#### Type declaration

▸ (`paginate?`): Promise<Cbor[]\>

Returns a list of all used (included in some on-chain transaction) addresses controlled by the wallet.

The results can be further paginated by `paginate` if it is not `undefined`.

**`Throws`**

ApiError

**`Throws`**

PaginateError

##### Parameters

| Name | Type |
| :------ | :------ |
| `paginate?` | Paginate |

##### Returns

Promise<Cbor[]\>

#### Defined in

typescript/cip30.ts:94

___

### GetUtxos

Ƭ **GetUtxos**: Function

#### Type declaration

▸ (`amount?`, `paginate?`): Promise<Cbor[] \| undefined\>

If `amount` is `undefined`, this shall return a list of all UTxOs (unspent transaction outputs)
controlled by the wallet.

If `amount` is not `undefined`, this request shall be limited to just the UTxOs that are required
to reach the combined ADA/multi-asset value target specified in `amount`,
and if this cannot be attained, `undefined` shall be returned.

The results can be further paginated by `paginate` if it is not `undefined`.

**`Throws`**

ApiError

**`Throws`**

PaginateError

##### Parameters

| Name | Type |
| :------ | :------ |
| `amount?` | Cbor |
| `paginate?` | Paginate |

##### Returns

Promise<Cbor[] \| undefined\>

#### Defined in

typescript/cip30.ts:59

___

### Paginate

Ƭ **Paginate**: `Object`

Used to specify optional pagination for some API calls.
Limits results to {limit} each page, and uses a 0-indexing {page}
to refer to which of those pages of {limit} items each.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `limit` | number |
| `page` | number |

#### Defined in

typescript/cip30.ts:22

___

### SignData

Ƭ **SignData**: Function

#### Type declaration

▸ (`addr`, `payload`): Promise<Cip30DataSignature\>

This endpoint utilizes the CIP-0008 signing spec for standardization/safety reasons.

It allows the dApp to request the user to sign data conforming to said spec.

The user's consent should be requested and the details of `sig_structure` shown to them in an informative way.

Please refer to the CIP-0008 spec for details on how to construct the sig structure.

**`Throws`**

ApiError

**`Throws`**

DataSignError

##### Parameters

| Name | Type |
| :------ | :------ |
| `addr` | string |
| `payload` | Bytes |

##### Returns

Promise<Cip30DataSignature\>

#### Defined in

typescript/cip30.ts:153

___

### SignTx

Ƭ **SignTx**: Function

#### Type declaration

▸ (`tx`, `partialSign?`): Promise<Cbor\>

Requests that a user sign the unsigned portions of the supplied transaction.

The wallet should ask the user for permission, and if given,
try to sign the supplied body and return a signed transaction.

If `partialSign` is `true`, the wallet only tries to sign what it can.

If `partialSign` is `false` and the wallet could not sign the entire transaction,
`TxSignError` shall be returned with the `ProofGeneration` code.

Likewise if the user declined in either case it shall return the `UserDeclined` code.

Only the portions of the witness set that were signed as a result of this call are
returned to encourage dApps to verify the contents returned by this endpoint while building the final transaction.

**`Throws`**

ApiError

**`Throws`**

TxSignError

##### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | Cbor |
| `partialSign?` | boolean |

##### Returns

Promise<Cbor\>

#### Defined in

typescript/cip30.ts:139

___

### SubmitTx

Ƭ **SubmitTx**: Function

#### Type declaration

▸ (`tx`): Promise<string\>

As wallets should already have this ability, we allow dApps to request that a transaction be sent through it.

If the wallet accepts the transaction and tries to send it, it shall return the transaction id for the dApp to track.

The wallet is free to return the `TxSendError` with code `Refused` if they do not wish to send it,
or `Failure` if there was an error in sending it (e.g. preliminary checks failed on signatures).

**`Throws`**

ApiError

**`Throws`**

TxSendError

##### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | Cbor |

##### Returns

Promise<string\>

#### Defined in

typescript/cip30.ts:169

___

### UseCardanoWalletOptions

Ƭ **UseCardanoWalletOptions**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `autoConnect?` | boolean | Specify if the connector should automatically try to connect to previously connected wallets. Relies on localStorage. |
| `localStorageKey?` | string | Specify a local storage key to store the connected wallet name |

#### Defined in

index.ts:5

___

### WalletMethod

Ƭ **WalletMethod**: keyof WalletApi

#### Defined in

typescript/cip30.ts:201

## Functions

### default

▸ **default**(`__namedParameters?`): ReturnVal

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `__namedParameters` | UseCardanoWalletOptions | `defaultOptions` |

#### Returns

ReturnVal

#### Defined in

index.ts:37
