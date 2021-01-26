const fastReplace = require("fast-replace/src/fastReplace");
const nextConfig = require("../next.config");

async function main(process) {
  for (let keyName in nextConfig.envVars) {
    if (process.env[keyName]) {
      const options = {
        globs: [".next/**"],
        quiet: false,
      };

      await fastReplace(
        nextConfig.envVars[keyName],
        process.env[keyName],
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
