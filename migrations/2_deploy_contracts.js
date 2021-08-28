const Creature = artifacts.require("./Creature.sol");
const CreatureFactory = artifacts.require("./CreatureFactory.sol");

const DEPLOY_ALL = process.env.DEPLOY_ALL;
const DEPLOY_CREATURES_SALE = process.env.DEPLOY_CREATURES_SALE || DEPLOY_ALL;
const DEPLOY_CREATURES = process.env.DEPLOY_CREATURES || DEPLOY_CREATURES_SALE || DEPLOY_ALL;

module.exports = async (deployer, network, addresses) => {
  let proxyRegistryAddress = "";
  if (network === "rinkeby") {
    proxyRegistryAddress = "0xf57b2c51ded3a29e6891aba85459d600256cf317";
  } else {
    proxyRegistryAddress = "0xa5409ec958c83c3f309868babaca7c86dcb077c1";
  }

  if (DEPLOY_CREATURES) {
    await deployer.deploy(Creature, proxyRegistryAddress, { gas: 5000000 });
  }

  if (DEPLOY_CREATURES_SALE) {
    await deployer.deploy(
      CreatureFactory,
      proxyRegistryAddress,
      Creature.address,
      { gas: 7000000 }
    );
    const creature = await Creature.deployed();
    await creature.transferOwnership(CreatureFactory.address);
  }
};
