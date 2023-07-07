/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  cacheDirectory: "./node_modules/.cache/remix",
  future: {
    v2_errorBoundary: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
  },
  ignoredRouteFiles: ["**/.*", "**/*.css", "**/*.test.{js,jsx,ts,tsx}"],
  serverDependenciesToBundle: [
    /^marked$/,
    // /^swagger/,
    // /highlight/,
    /swagger-ui-react/,
    /swagger-client/,
    /react-syntax-highlighter/,
    // /apidom-reference/,
  ],
};
