const webpack = require('webpack');
const fs = require('fs');
const path = require('path');

async function run() {
  const projectRoot = path.resolve(__dirname, '..');
  const env = {
    mode: 'production',
    projectRoot,
    // platform default is web
  };
  const createConfig = require('@expo/webpack-config');
  const config = await createConfig(env, {});
  // Ensure output path is web-build to match netlify.toml
  config.output = config.output || {};
  config.output.path = path.resolve(projectRoot, 'web-build');
  const compiler = webpack(config);
  compiler.run((err, stats) => {
    if (err) {
      console.error(err.stack || err);
      if (err.details) console.error(err.details);
      process.exit(1);
    }
    const info = stats.toJson();
    if (stats.hasErrors()) {
      console.error(info.errors);
      process.exit(1);
    }
    if (stats.hasWarnings()) {
      console.warn(info.warnings);
    }
    console.log('Web build complete. Output written to web-build/');
    process.exit(0);
  });
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
