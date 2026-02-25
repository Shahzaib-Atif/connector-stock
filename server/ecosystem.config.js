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
      wait_ready: true,
      listen_timeout: 10000,
      kill_timeout: 5000,
    },
  ],
};