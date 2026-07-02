import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from "@stellar/stellar-sdk/contract";
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
};
export const VZeroError = {
    1: { message: "LengthMismatch" }
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy(null, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAAAAAAAOtSb3V0ZXMgYSBzaGllbGRlZCB0cmFuc2FjdGlvbiB0aHJvdWdoIHRoZSBTUFAgbGlxdWlkaXR5IHBvb2wgYW5kCm1pcnJvcnMgdGhlIHBlci1jb21taXRtZW50IGVuY3J5cHRlZCBhdWRpdCBtZXRhZGF0YSBpbnRvIHRoZQpBdWRpdFJlZ2lzdHJ5IGluIHRoZSBzYW1lIGNhbGwsIHNvIG9uLWNoYWluIGNvbXBsaWFuY2Ugc3RhdGUgbmV2ZXIKZHJpZnRzIGZyb20gdGhlIHBvb2wncyBvd24gY29tbWl0bWVudCBzZXQuAAAAAAh0cmFuc2FjdAAAAAgAAAAAAAAACWRlcG9zaXRvcgAAAAAAABMAAAAAAAAAEHNwcF9wb29sX2FkZHJlc3MAAAATAAAAAAAAABZhdWRpdF9yZWdpc3RyeV9hZGRyZXNzAAAAAAATAAAAAAAAAAZwcm9vZnMAAAAAAA4AAAAAAAAADXB1YmxpY19hbW91bnQAAAAAAAALAAAAAAAAAAtjb21taXRtZW50cwAAAAPqAAAD7gAAACAAAAAAAAAACm51bGxpZmllcnMAAAAAA+oAAAPuAAAAIAAAAAAAAAAOYXVkaXRfcGF5bG9hZHMAAAAAA+oAAAfQAAAADUVuY3J5cHRlZE5vdGUAAAAAAAAA",
            "AAAABAAAAAAAAAAAAAAAClZaZXJvRXJyb3IAAAAAAAEAAAAAAAAADkxlbmd0aE1pc21hdGNoAAAAAAAB",
            "AAAAAQAAAAAAAAAAAAAADUVuY3J5cHRlZE5vdGUAAAAAAAADAAAAAAAAAApjaXBoZXJ0ZXh0AAAAAAAOAAAAAAAAAAxlcGhlbWVyYWxfcGsAAAPuAAAAIAAAAAAAAAAFbm9uY2UAAAAAAAPuAAAADA=="]), options);
        this.options = options;
    }
    fromJSON = {
        transact: (this.txFromJSON)
    };
}
