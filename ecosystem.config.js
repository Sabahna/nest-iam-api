const fs = require("fs");
const path = require("path");
const { parseEnv } = require("util");

// Secrets are not in git. sm-workspace scripts/deploy.sh writes them to .env next to this file.
const envFile = path.join(__dirname, ".env");
const secrets = fs.existsSync(envFile) ? parseEnv(fs.readFileSync(envFile, "utf8")) : {};

module.exports = {
  apps: [
    {
      name: "iam.socialmetrica.com",
      cwd: "/var/www/socialmetrica.com/iam.socialmetrica.com",
      script: "/var/www/socialmetrica.com/iam.socialmetrica.com/main.js",
      watch: true,
      watch_options: {
        followSymlinks: false,
      },
      env: {
        ...secrets,
        PORT: 5210,
        NESTIAM_PROVIDER: "mongodb",
        METABASE_DASHBOARD_ID: 3,
        METABASE_TOKEN_TTL_SECONDS: 600,
      },
    },
  ],
};
