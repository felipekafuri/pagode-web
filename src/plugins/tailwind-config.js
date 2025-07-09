module.exports = function tailwindPlugin(context, options) {
    return {
      name: "tailwind-plugin",
      configurePostCss(postcssOptions) {
        // Make sure we preserve existing plugins
        const plugins = postcssOptions.plugins || [];
        
        // Clear existing plugins array
        postcssOptions.plugins = [];
        
        // Add Tailwind CSS and other necessary PostCSS plugins in the correct order
        postcssOptions.plugins.push(
          require('@tailwindcss/postcss'),
          require('autoprefixer'),
          ...plugins, // Add other plugins back
        );
        
        return postcssOptions;
      },
    };
  };