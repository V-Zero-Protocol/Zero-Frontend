import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Timepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CBFQUJET4C7EVFPGLNEZOYKYIQJIAEY4TTOC2API2BJ4AKUW6WIRSKHE",
  }
} as const

export const VZeroError = {
  1: {message:"LengthMismatch"}
}


export interface EncryptedNote {
  ciphertext: Buffer;
  ephemeral_pk: Buffer;
  nonce: Buffer;
}

export interface Client {
  /**
   * Construct and simulate a transact transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Routes a shielded transaction through the SPP liquidity pool and
   * mirrors the per-commitment encrypted audit metadata into the
   * AuditRegistry in the same call, so on-chain compliance state never
   * drifts from the pool's own commitment set.
   */
  transact: ({depositor, spp_pool_address, audit_registry_address, proofs, public_amount, commitments, nullifiers, audit_payloads}: {depositor: string, spp_pool_address: string, audit_registry_address: string, proofs: Buffer, public_amount: i128, commitments: Array<Buffer>, nullifiers: Array<Buffer>, audit_payloads: Array<EncryptedNote>}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAAAAAOtSb3V0ZXMgYSBzaGllbGRlZCB0cmFuc2FjdGlvbiB0aHJvdWdoIHRoZSBTUFAgbGlxdWlkaXR5IHBvb2wgYW5kCm1pcnJvcnMgdGhlIHBlci1jb21taXRtZW50IGVuY3J5cHRlZCBhdWRpdCBtZXRhZGF0YSBpbnRvIHRoZQpBdWRpdFJlZ2lzdHJ5IGluIHRoZSBzYW1lIGNhbGwsIHNvIG9uLWNoYWluIGNvbXBsaWFuY2Ugc3RhdGUgbmV2ZXIKZHJpZnRzIGZyb20gdGhlIHBvb2wncyBvd24gY29tbWl0bWVudCBzZXQuAAAAAAh0cmFuc2FjdAAAAAgAAAAAAAAACWRlcG9zaXRvcgAAAAAAABMAAAAAAAAAEHNwcF9wb29sX2FkZHJlc3MAAAATAAAAAAAAABZhdWRpdF9yZWdpc3RyeV9hZGRyZXNzAAAAAAATAAAAAAAAAAZwcm9vZnMAAAAAAA4AAAAAAAAADXB1YmxpY19hbW91bnQAAAAAAAALAAAAAAAAAAtjb21taXRtZW50cwAAAAPqAAAD7gAAACAAAAAAAAAACm51bGxpZmllcnMAAAAAA+oAAAPuAAAAIAAAAAAAAAAOYXVkaXRfcGF5bG9hZHMAAAAAA+oAAAfQAAAADUVuY3J5cHRlZE5vdGUAAAAAAAAA",
        "AAAABAAAAAAAAAAAAAAAClZaZXJvRXJyb3IAAAAAAAEAAAAAAAAADkxlbmd0aE1pc21hdGNoAAAAAAAB",
        "AAAAAQAAAAAAAAAAAAAADUVuY3J5cHRlZE5vdGUAAAAAAAADAAAAAAAAAApjaXBoZXJ0ZXh0AAAAAAAOAAAAAAAAAAxlcGhlbWVyYWxfcGsAAAPuAAAAIAAAAAAAAAAFbm9uY2UAAAAAAAPuAAAADA==" ]),
      options
    )
  }
  public readonly fromJSON = {
    transact: this.txFromJSON<null>
  }
}