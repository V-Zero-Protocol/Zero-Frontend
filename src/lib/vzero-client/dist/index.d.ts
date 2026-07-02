import { Buffer } from "buffer";
import { AssembledTransaction, Client as ContractClient, ClientOptions as ContractClientOptions, MethodOptions } from "@stellar/stellar-sdk/contract";
import type { i128 } from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";
export declare const networks: {
    readonly testnet: {
        readonly networkPassphrase: "Test SDF Network ; September 2015";
        readonly contractId: "CBFQUJET4C7EVFPGLNEZOYKYIQJIAEY4TTOC2API2BJ4AKUW6WIRSKHE";
    };
};
export declare const VZeroError: {
    1: {
        message: string;
    };
};
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
    transact: ({ depositor, spp_pool_address, audit_registry_address, proofs, public_amount, commitments, nullifiers, audit_payloads }: {
        depositor: string;
        spp_pool_address: string;
        audit_registry_address: string;
        proofs: Buffer;
        public_amount: i128;
        commitments: Array<Buffer>;
        nullifiers: Array<Buffer>;
        audit_payloads: Array<EncryptedNote>;
    }, options?: MethodOptions) => Promise<AssembledTransaction<null>>;
}
export declare class Client extends ContractClient {
    readonly options: ContractClientOptions;
    static deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions & Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
    }): Promise<AssembledTransaction<T>>;
    constructor(options: ContractClientOptions);
    readonly fromJSON: {
        transact: (json: string) => AssembledTransaction<null>;
    };
}
