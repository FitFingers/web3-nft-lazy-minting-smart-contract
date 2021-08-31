const initialiseWeb3 = require("./init-web3");
const functions = require("./functions");

const { contract } = initialiseWeb3();

const OWNER_ADDRESS = process.env.OWNER_ADDRESS;

async function mint() {
  try {
    const NUM_MUSHROOMS = process.argv[2];

    // TOTAL CIRCULATING SUPPLY
    const totalSupply = await functions.run("totalSupply", contract);
    if (totalSupply + NUM_MUSHROOMS > MAX_SUPPLY) {
      throw new Error("Purchase would exceed total supply of Satoshi Shrooms");
    }

    // MAX # TO PURCHASE
    const maxMushroomPurchase = await functions.run(
      "maxMushroomPurchase",
      contract,
      { estimateGas: false }
    );
    if (NUM_MUSHROOMS > maxMushroomPurchase) {
      throw new Error(
        `You may only mint ${maxMushroomPurchase} Satoshi Shrooms at once`
      );
    }

    // MUSHROOM PRICE
    const mushroomPrice = await functions.run("mushroomPrice", contract, {
      estimateGas: false,
    });

    // MINT MUSHROOMS
    await contract.methods
      .mintSatoshiShroom(NUM_MUSHROOMS)
      .send({
        from: OWNER_ADDRESS,
        value: mushroomPrice * NUM_MUSHROOMS,
      })
      .on("transactionHash", function (hash) {
        console.log("transactionHash", hash);
      });

    console.log("Minting complete.");
  } catch (err) {
    console.log("ERROR", err);
  }

  process.exit();
}

mint();
