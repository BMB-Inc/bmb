module.exports = {
  apps: [{
    name: 'imageright-app',
    script: 'yarn',
    args: 'start',
    cwd: '/home/adevries/bmb/packages/imageright',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3333
    },
    error_file: '/home/adevries/bmb/packages/imageright/logs/error.log',
    out_file: '/home/adevries/bmb/packages/imageright/logs/out.log',
    log_file: '/home/adevries/bmb/packages/imageright/logs/combined.log',
    time: true
  }]
};

