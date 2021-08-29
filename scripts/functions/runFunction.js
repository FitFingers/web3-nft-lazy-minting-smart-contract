const OWNER_ADDRESS = process.env.OWNER_ADDRESS;

const defaultOptions = {
  estimateGas: true,
  verbose: true,
  callFunction: true,
};

function log(verbose, ...msgs) {
  if (verbose) console.log(...msgs);
}

exports.default = async function (name, contract, opts, params) {
  const options = { ...defaultOptions, ...opts };
  try {
    const funcRef = await contract.methods[name];

    if (options.estimateGas) {
      log(options.verbose, `Estimating gas for ${name}...`);
      const gasCost = await funcRef(/* params */).estimateGas({
        from: OWNER_ADDRESS,
      });
      log(
        options.verbose,
        `Gas estimate for ${name}: ${gasCost} (${
          gasCost / Math.pow(10, 9)
        } ETH)`
      );
    }

    if (options.callFunction) {
      const result = await funcRef(/* params */).call({
        from: OWNER_ADDRESS,
      });
      log(options.verbose, `${name} result:`, result);
      return result;
    }

    return funcRef;
  } catch (err) {
    console.debug("ERROR", err);
  }
};
