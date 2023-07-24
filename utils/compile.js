const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

async function compile(sourceCode, name) {
  const contractFileName = name + '.sol';
  const config = createConfiguration(sourceCode, contractFileName);

  const zeppelinPath =
    path.resolve(__dirname, '..', 'node_modules', '@openzeppelin') + '/';

  const { abi, bytecode } = await compileSources(
    config,
    zeppelinPath,
    contractFileName,
    name,
  );

  const abiString = JSON.stringify(abi);
  return { abiString, bytecode, sourceCode };
}

function createConfiguration(sourceCode, contractFileName) {
  return {
    language: 'Solidity',
    sources: {
      [contractFileName]: {
        content: sourceCode,
      },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['abi', 'evm.bytecode'],
        },
      },
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  };
}

async function compileSources(config, zeppelinPath, contractFileName, name) {
  try {
    const output = JSON.parse(
      solc.compile(JSON.stringify(config), {
        import: getImportCallback(zeppelinPath),
      }),
    );

    errorHandling(output);

    const artifact = output.contracts[contractFileName][name];
    return {
      abi: artifact.abi,
      bytecode: artifact.evm.bytecode.object,
    };
  } catch (e) {
    console.log(e);
  }
}

function getImportCallback(zeppelinPath) {
  return (path) => {
    let contents;
    if (path.startsWith('@openzeppelin/')) {
      const filePath = zeppelinPath + path.replace('@openzeppelin/', '');
      contents = fs.readFileSync(filePath, 'utf8');
    } else {
      contents = fs.readFileSync(path, 'utf8');
    }
    return { contents };
  };
}

function errorHandling(outputSources) {
  if (!outputSources) {
    console.error(
      '>>>>>>>>>>>>>>>>>>>>>>>> ERRORS <<<<<<<<<<<<<<<<<<<<<<<<\n',
      'NO OUTPUT',
    );
  } else if (outputSources.errors) {
    // something went wrong.
    console.error('>>>>>>>>>>>>>>>>>>>>>>>> ERRORS <<<<<<<<<<<<<<<<<<<<<<<<\n');
    outputSources.errors.map((error) => console.log(error.formattedMessage));
  }
}

module.exports = compile;
