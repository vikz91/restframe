let Framework = {
  Plugins: {
    DB: require("./src/Services/db")
  },

  Core: {
    AppShell: require("./src/Core/AppShell"),
    Server: require("./src/Core/Server"),
    Service: require("./src/Core/Service"),
    Api: require("./src/Core/Api")
  },

  Interfaces: {
    Config: require("./src/Interfaces/IConfig")
  }
};

/*
  Quick Aliases
*/
let NormalizeLoaderPaths = srcDirectory => {
  const pathObj = {};
  if (srcDirectory.service) {
    pathObj.service = srcDirectory.service;
  }
};
Framework.Start = (Config, srcDirectory) => {
  const AppShell = new Framework.Core.AppShell(Config, srcDirectory);
  const Server = new Framework.Core.Server();

  Server.Listen(AppShell.Bootstrap());
};

module.exports = Framework;
