module.exports = {
  apps: [
    {
      name: "csm-app",
      script: "dist/src/main.js",
      instances: 2,
      exec_mode: "cluster",
      env_file: ".env.prod",
      env: {
        NODE_ENV: "prod",
      },
    },
  ]
}