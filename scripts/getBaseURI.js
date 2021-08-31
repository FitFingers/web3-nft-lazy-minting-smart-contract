const initialiseWeb3 = require("./init-web3");
const functions = require("./functions");

const { contract } = initialiseWeb3();

async function getBaseURI() {
  try {
    // PRINT BASE URI
    const baseURI = await functions.run("getBaseURI", contract, {
      estimateGas: false,
    });

    console.log("BaseURI:", baseURI);
  } catch (err) {
    console.log("ERROR", err);
  }

  process.exit();
}

getBaseURI();
