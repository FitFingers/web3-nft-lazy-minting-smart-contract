const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const ABI = require("./satoshi-shroom-abi");

const MNEMONIC = process.env.MNEMONIC;
const NODE_API_KEY = process.env.INFURA_KEY || process.env.ALCHEMY_KEY;
const isInfura = !!process.env.INFURA_KEY;
const ORIG_CONTRACT_ADDRESS = process.env.ORIG_CONTRACT_ADDRESS;
const OWNER_ADDRESS = process.env.OWNER_ADDRESS;
const NETWORK = process.env.NETWORK;

exports.initialiseWeb3 = async function () {
  if (!MNEMONIC || !NODE_API_KEY || !OWNER_ADDRESS || !NETWORK) {
    console.error(
      "Please set a mnemonic, Alchemy/Infura key, owner, network, and contract address."
    );
    return;
  }

  const network =
    NETWORK === "mainnet" || NETWORK === "live" ? "mainnet" : "rinkeby";
  const provider = new HDWalletProvider(
    MNEMONIC,
    isInfura
      ? "https://" + network + ".infura.io/v3/" + NODE_API_KEY
      : "https://eth-" + network + ".alchemyapi.io/v2/" + NODE_API_KEY
  );
  const web3 = new Web3(provider);

  const contract = new web3.eth.Contract(
    ABI.ORIG_SHROOM_ABI,
    ORIG_CONTRACT_ADDRESS,
    { gasLimit: "1000000" }
  );

  return { contract, web3 };
};
