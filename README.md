# Satoshi Shrooms
## Solidity Smart Contract and JavaScript Minting and Callables

#### Setup

- Alchemy project API key (or infura key)
- MetaMask seed phrase (to instantiate the provider)
- `.env` file with this data in it

#### Contract Deployment

From a terminal session with the env loaded (`. .env`), run

`yarn truffle deploy --network rinkeby`

(add `--reset` if this is a redeployment of an existing contract).

The compiler will return the contract address(es); take note.


#### Minting an NFT

Add the following data to the same `.env` as before:

- MetaMask wallet address (of the owner of the contract)
- The solidity contract address

From a terminal session with these env variable loaded, run:

`node scripts/mint.js`

#### Extra Contract Functions

There are a number of extra contract functions available in this contract. To run them, there is a helper function in `util` and a few already commented out and labeled in the `mint.js` script.

#### Notes

- When deploying the same contract to a new Alchemy app, delete the `build` directory.
- After making changes to the smart contract (during testing, for example), you **must** change the ABI passed to the `web3.Contract`. The ABI can be found in the `build` directory of the edited contract.