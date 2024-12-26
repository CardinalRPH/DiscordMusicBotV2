module.exports = {
  apps: [{
    name: "Discord Bot",
    script: "./dist/index.js",
    exec_mode: "fork",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "500M",
    log_file: "/dev/null",
  }]
}