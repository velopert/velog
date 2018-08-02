// fakeModule resolves SSR issues when it imports libraries that requires browser environment.
// check NormalModulereplacementPlugin of webpack.server.config.js.
const fakeModule = {};

export default fakeModule;
