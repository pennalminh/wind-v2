module.exports = {
  apps: [
    {
      name: 'vue-vite-app',
      script: 'node',
      args: 'start-server.js',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}
