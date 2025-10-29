module.exports = {
  apps: [
    {
      name: 'app',
      script: 'dist/main.js',
      instances: 1,
      autorestart: true,
      watch: true,
      ignore_watch: ['node_modules'],
      time: true,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
