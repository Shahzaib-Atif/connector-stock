module.exports = {
  apps: [
    {
      name: "csm-app",
      script: "dist/server/src/main.js",
      instances: 1,
      exec_mode: "fork",
      env_file: ".env.prod",
      env: {
        NODE_ENV: "prod",
      },
      wait_ready: true,
      listen_timeout: 10000,
      kill_timeout: 5000,
      max_memory_restart: '300M',  // safety net
    },
  ],
};