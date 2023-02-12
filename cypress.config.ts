import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
    },
  },

  e2e: {
    // baseUrl: 'http://localhost:3000',
    // baseUrl: "https://alaric.co.in",
    baseUrl: "https://s74von-3000.preview.csb.app",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
