const fastReplace = require("fast-replace/src/fastReplace");
const nextConfig = require("../next.config");
const environmentVariables = nextConfig.publicRuntimeConfig;

function camelToUnderscore(key) {
  var result = key.replace(/([A-Z])/g, " $1");
  return result.split(" ").join("_").toUpperCase();
}

async function main(process) {
  for (let keyName in environmentVariables) {
    const key = camelToUnderscore(keyName);

    if (process.env[key]) {
      const options = {
        "--globs": ".next/**",
        "--quiet": true,
      };

      await fastReplace(
        environmentVariables[keyName],
        process.env[key],
        options
      );
    }
  }
}

main(process)
  .then(() => {
    process.exit();
  })
  .catch((e) => {
    console.log(e);
    process.exit(-1);
  });
