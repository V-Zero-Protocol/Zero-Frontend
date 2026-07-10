# V-Zero Protocol: Smart Contracts

Core WebAssembly smart contracts for the **V-Zero Protocol**, a confidential on-chain payroll and compliance infrastructure built on the Stellar network using Soroban.

---

## 🏗️ Architecture Overview

The protocol splits responsibility across two major smart contracts to maintain validation state and manage transactional logic cleanly:

                  +-----------------------------+
                  |     Client / Frontend       |
                  +--------------+--------------+
                                 |
                                 | Invokes methods
                                 v
                  +--------------+--------------+
                  |    Orchestrator Contract    |
                  |    (Primary Engine)         |
                  +--------------+--------------+
                                 |
                                 | Internal Cross-Call
                                 v
                  +--------------+--------------+
                  |   Audit Registry Contract   |
                  |    (Immutable State Log)    |
                  +-----------------------------+

* **Audit Registry (`audit_registry.wasm`):** Acts as the immutable data log. It stores, tracks, and archives verified historical compliance records and validator state hashes.
* **Orchestrator (`orchestrator.wasm`):** The primary execution engine. It interfaces between user actions, handles cryptographic state configurations, balances conditional execution flows, and communicates directly with the Audit Registry via cross-contract calls.

---

## 🛠️ Prerequisites & Environment Setup

Ensure you have the native global Rust toolchain and Stellar CLI installed locally:

* **Rust:** Stable channel (`wasm32-unknown-unknown` target added)
* **Stellar CLI:** Global binary workspace toolchain installed via Cargo

---

## 📦 Compilation & Build Pipeline

Standard compiler outputs can occasionally embed modern WebAssembly feature proposals (like `reference-types`) that certain CLI runtimes strictly check. To generate perfectly optimized, minimized, and clean binaries ready for Soroban transaction simulation, compile using the following custom configuration:

```cmd
cargo build --target wasm32-unknown-unknown --release --target-dir C:\Users\USER\Desktop\vzero_temp_build --config "target.wasm32-unknown-unknown.rustflags=['-C', 'target-feature=-reference-types']"
🧹 Optimization Flag Bypass
If the compiler links cached modules containing unneeded headers, clear the cargo build directory cache entirely and force a fresh optimization cycle using the built-in CLI module optimizer:

DOS
# 1. Clean build directory cache
cargo clean --target-dir C:\Users\USER\Desktop\vzero_temp_build

# 2. Build via the feature exclusion configuration flag above
# 3. Strip legacy headers using the Stellar compiler engine
stellar contract optimize --wasm C:\Users\USER\Desktop\vzero_temp_build\wasm32-unknown-unknown\release\orchestrator.wasm
This outputs a clean, minimized production file named orchestrator.optimized.wasm under the release folder.

🚀 Network Deployment (Stellar Testnet)
1. Initialize Network Identity Configuration
Generate or register your developer deployment private secret key using an interactive hidden prompt session:

DOS
stellar keys add deployer
When prompted, paste your Testnet-funded secret key starting with S securely.

2. Deploy Smart Contracts to Ledger
Execute the network payload submissions sequentially to upload your optimized bytecode modules:

DOS
# Deploy the Audit Registry Contract Module
stellar contract deploy --network testnet --source deployer --wasm C:\Users\USER\Desktop\vzero_temp_build\wasm32-unknown-unknown\release\audit_registry.wasm

# Deploy the Main Orchestrator Contract Module
stellar contract deploy --network testne
