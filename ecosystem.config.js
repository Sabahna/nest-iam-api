module.exports = {
  apps: [
    {
      name: "admin.socialmetrica.com",
      cwd: "/var/www/socialmetrica.com/admin.api.socialmetrica.com",
      script: "/var/www/socialmetrica.com/admin.api.socialmetrica.com/main.js",
      watch: true,
      watch_options: {
        followSymlinks: false,
      },
      env: {
        PORT: 5010,
        NESTIAM_PROVIDER: "mongodb",
        NESTIAM_URL:
          "mongodb+srv://socialmetricamm:g1WxT80V08i3A0l0@smcluster.mgm3v.mongodb.net/iam?retryWrites=true&w=majority&appName=SMCluster",

        METABASE_EMBEDDING_SECRET_KEY:"c62bd72ded09340f0043f4a1dd6063a34dad4464647ac65c70cab83721906ba2",
        METABASE_DASHBOARD_ID:3,
        METABASE_TOKEN_TTL_SECONDS:600
      },
    },
  ],
};
