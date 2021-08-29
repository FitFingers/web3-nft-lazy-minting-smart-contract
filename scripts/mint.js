const HDWalletProvider = require("truffle-hdwallet-provider");
const web3 = require("web3");
const SATOSHI_SHROOM_ABI = require("./satoshi-shroom-abi").default;
const MNEMONIC = process.env.MNEMONIC;
const NODE_API_KEY = process.env.INFURA_KEY || process.env.ALCHEMY_KEY;
const isInfura = !!process.env.INFURA_KEY;
const SHROOM_CONTRACT_ADDRESS = process.env.SHROOM_CONTRACT_ADDRESS;
const OWNER_ADDRESS = process.env.OWNER_ADDRESS;
const NETWORK = process.env.NETWORK;
const NUM_CREATURES = 1;

if (!MNEMONIC || !NODE_API_KEY || !OWNER_ADDRESS || !NETWORK) {
  console.error(
    "Please set a mnemonic, Alchemy/Infura key, owner, network, and contract address."
  );
  return;
}

const NFT_ABI = [
  {
    constant: false,
    inputs: [
      {
        name: "_to",
        type: "address",
      },
    ],
    name: "mintTo",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];

async function main() {
  try {
    const network =
      NETWORK === "mainnet" || NETWORK === "live" ? "mainnet" : "rinkeby";
    const provider = new HDWalletProvider(
      MNEMONIC,
      isInfura
        ? "https://" + network + ".infura.io/v3/" + NODE_API_KEY
        : "https://eth-" + network + ".alchemyapi.io/v2/" + NODE_API_KEY
    );
    const web3Instance = new web3(provider);

    if (SHROOM_CONTRACT_ADDRESS) {
      const nftContract = new web3Instance.eth.Contract(
        SATOSHI_SHROOM_ABI,
        SHROOM_CONTRACT_ADDRESS,
        { gasLimit: "1000000" }
      );

      // MAX PURCHASE
      console.log("Estimating gas for maxPurchase...");
      const maxPurchaseFn = await nftContract.methods.maxMushroomPurchase();
      const maxPurchaseGasCost = await maxPurchaseFn.estimateGas();
      console.log(
        `Gas estimate for maxPurchase: ${maxPurchaseGasCost} (${
          maxPurchaseGasCost / Math.pow(10, 9)
        })`
      );
      const maxPurchase = await maxPurchaseFn.call();
      console.log("maxMushroomPurchase:", maxPurchase);

      // MUSHROOM PRICE
      console.log("Estimating gas for mushroomPrice...");
      const mushroomPriceFn = await nftContract.methods.mushroomPrice();
      const mushroomPriceGasCost = await mushroomPriceFn.estimateGas();
      console.log(
        `Gas estimate for mushroomPrice: ${mushroomPriceGasCost} (${
          mushroomPriceGasCost / Math.pow(10, 9)
        })`
      );
      const mushroomPrice = await mushroomPriceFn.call();
      console.log("mushroomPrice:", mushroomPrice);

      // MINTING
      console.log("Estimating gas for minting...");
      const gasCost = await nftContract.methods
        .mintSatoshiShroom(1)
        .estimateGas({
          from: OWNER_ADDRESS,
          value: mushroomPrice,
        });
      // const gasCost = await mintFn.estimateGas({
      //   from: OWNER_ADDRESS,
      //   value: mushroomPrice,
      // });
      console.log(
        `Gas estimate for minting: ${gasCost} (${gasCost / Math.pow(10, 9)})`
      );

      // Creatures issued directly to the owner.
      // for (var i = 0; i < NUM_CREATURES; i++) {
      //   const result = await nftContract.methods.mintSatoshiShroom().call(1);
      //   // .send({ from: OWNER_ADDRESS });
      //   console.log("Minted creature. Transaction: " + result.transactionHash);
      // }

      console.log("Minting complete.");
    } else {
      console.error("Add NFT_CONTRACT_ADDRESS to the environment variables");
    }
  } catch (err) {
    console.log("ERROR", err);
  }

  process.exit();
}

main();
