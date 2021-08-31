const { initialiseWeb3 } = require("./init-web3");
const functions = require("./functions");


async function getBaseURI() {
  try {
    const { contract } = await initialiseWeb3();
    
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
