module.exports = {
  apps : [
    {
      name: "Frontend",
      script: "npm",
      args: "start",
      cwd: "./frontend",
      instances: 1,


      // Env Specific Config
      env_production: {
        NODE_ENV: "production",
        PORT: 80,
        exec_mode: "cluster_mode",
      },
      env_development: {
        NODE_ENV: "development",
        PORT: 80,
        watch: true,
        watch_delay: 3000,
        ignore_watch: [
          "./node_modules"
        ],
      },
    },
    {
      name: "Backend",
      script: "npm",
      args: "start",
      instances: 1,
      cwd: "./backend",
      max_memory_restart: "300M",



      // Env Specific Config
      env_production: {
        NODE_ENV: "production",
        PORT: 4000,
        exec_mode: "cluster_mode",
      },
      env_development: {
        NODE_ENV: "development",
        PORT: 4000,
        watch: true,
        watch_delay: 3000,
        ignore_watch: [
          "./node_modules",

        ],
      },
    },
      ]
};
