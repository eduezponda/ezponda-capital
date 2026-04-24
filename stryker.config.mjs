// @ts-check
/** @type {import('@stryker-mutator/core').PartialStrykerOptions} */
const config = {
  testRunner: "vitest",
  mutate: [
    "lib/utils.ts",
    "lib/api/prices.ts",
    "lib/api/theses.ts",
    "lib/stripe.ts",
    "features/subscription/lib/entitlements.ts",
  ],
  reporters: ["html", "clear-text", "progress"],
  coverageAnalysis: "perTest",
  vitest: {
    configFile: "vitest.config.ts",
  },
  disableTypeChecks: true,
};

export default config;
