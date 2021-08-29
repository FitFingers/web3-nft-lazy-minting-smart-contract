const HDWalletProvider = require("truffle-hdwallet-provider");
const web3 = require("web3");
const SATOSHI_SHROOM_ABI = require("./satoshi-shroom-abi");
const functions = require("./functions");

const MNEMONIC = process.env.MNEMONIC;
const NODE_API_KEY = process.env.INFURA_KEY || process.env.ALCHEMY_KEY;
const isInfura = !!process.env.INFURA_KEY;
const NEW_CONTRACT = process.env.NEW_CONTRACT;
// const SHROOM_CONTRACT_ADDRESS = process.env.SHROOM_CONTRACT_ADDRESS;
const OWNER_ADDRESS = process.env.OWNER_ADDRESS;
const NETWORK = process.env.NETWORK;
const NUM_MUSHROOMS = 1;

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

    if (NEW_CONTRACT) {
      const nftContract = new web3Instance.eth.Contract(
        SATOSHI_SHROOM_ABI.newOne,
        NEW_CONTRACT,
        { gasLimit: "1000000" }
      );

      // // ALL AVAILABLE METHODS
      // const methods = await nftContract.methods;
      // console.log("NFT METHODS", methods);

      const mushroomPrice = await functions.runFunction(
        "mushroomPrice",
        nftContract,
        { estimateGas: false }
      );

      // const maxMushroomPurchase = await functions.runFunction(
      //   "maxMushroomPurchase",
      //   nftContract,
      //   { estimateGas: false }
      // );

      // PRINT BASE URI
      // await functions.runFunction("getBaseURI", nftContract, {
      //   estimateGas: false,
      // });

      // UPDATE BASE URI
      // await functions.runFunction("owner", nftContract)

      // // MINT NFT
      // // const mintFunctionRef = await functions.runFunction(
      // //   "mintSatoshiShroom",
      // //   nftContract,
      // //   { callFunction: false },
      // //   1
      // // );
      // // const mintFn = mintFunctionRef(1);
      // // const result = await mintFn(1).send({
      // const result = await nftContract.methods.mintSatoshiShroom(1).send({
      //   from: OWNER_ADDRESS,
      //   value: mushroomPrice,
      // });
      // console.log(`MINT TX / RESULT: ${result.transactionHash} / `, result);

      // // Mushrooms issued directly to the owner.
      // for (var i = 0; i < NUM_MUSHROOMS; i++) {
      const result = await nftContract.methods
        .mintSatoshiShroom(1)
        // .call(1)
        .send({
          from: OWNER_ADDRESS,
          value: mushroomPrice,
        })
        .on("transactionHash", function (hash) {
          console.log("transactionHash", hash);
        });
      console.log("Minted creature. Transaction: " + result.transactionHash);
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
