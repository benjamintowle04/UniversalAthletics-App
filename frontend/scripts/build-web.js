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
  
  // Configure PostCSS for Tailwind processing
  const cssRule = config.module.rules.find(rule => 
    rule.test && rule.test.toString().includes('css')
  );
  if (cssRule && Array.isArray(cssRule.use)) {
    const postcssLoader = cssRule.use.find(loader => 
      typeof loader === 'object' && loader.loader && loader.loader.includes('postcss-loader')
    );
    if (postcssLoader && postcssLoader.options) {
      postcssLoader.options.postcssOptions = {
        config: path.resolve(projectRoot, 'postcss.config.js'),
      };
    }
  }
  
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
    
    // Generate and inject Tailwind CSS for web
    const { execSync } = require('child_process');
    const outputPath = path.resolve(projectRoot, 'web-build');
    const tailwindOutputPath = path.resolve(outputPath, 'tailwind.css');
    
    try {
      // Generate Tailwind CSS
      execSync(`npx tailwindcss -i ${path.resolve(projectRoot, 'global.css')} -o ${tailwindOutputPath} --minify`, { 
        cwd: projectRoot,
        stdio: 'inherit'
      });
      
      // Inject Tailwind CSS link into index.html
      const indexHtmlPath = path.resolve(outputPath, 'index.html');
      if (fs.existsSync(indexHtmlPath)) {
        let html = fs.readFileSync(indexHtmlPath, 'utf-8');
        if (!html.includes('tailwind.css')) {
          html = html.replace('</head>', '  <link rel="stylesheet" href="/tailwind.css" /></head>');
          fs.writeFileSync(indexHtmlPath, html, 'utf-8');
          console.log('Tailwind CSS injected into index.html');
        }
      }
    } catch (tailwindErr) {
      console.warn('Warning: Could not generate Tailwind CSS:', tailwindErr.message);
    }
    
    console.log('Web build complete. Output written to web-build/');
    process.exit(0);
  });
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
