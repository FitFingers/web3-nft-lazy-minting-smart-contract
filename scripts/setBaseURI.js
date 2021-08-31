const initialiseWeb3 = require("./init-web3");

const { contract } = initialiseWeb3();

async function setBaseURI() {
  try {
    const newBaseURI = process.argv[2];

    // UPDATE BASE URI
    const gas = await contract.methods
      .setBaseURI(newBaseURI)
      .estimateGas({ from: OWNER_ADDRESS });

    await nftContract.methods.setBaseURI(newBaseURI).send({
      from: OWNER_ADDRESS,
      value: gas,
    });

    console.log("Set BaseURI to", newBaseURI);
  } catch (err) {
    console.log("ERROR", err);
  }

  process.exit();
}

setBaseURI();
