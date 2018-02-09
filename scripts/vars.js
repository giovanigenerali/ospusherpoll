module.exports = {
  developemnt: {
    MONGODB: 'mongodb://<dbuser>:<dbpassword>@ds229458.mlab.com:29458/<database>',
    PUSHER_APP_ID: 'app_id',
    PUSHER_KEY: 'app_key',
    PUSHER_SECRET: 'app_secret',
    PUSHER_CLUSTER: 'app_cluster',
    PUSHER_LOGTOCONSOLE: true,
  },
  production: {
    MONGODB: process.env.MONGODB,
    PUSHER_APP_ID: process.env.PUSHER_APP_ID,
    PUSHER_KEY: process.env.PUSHER_KEY,
    PUSHER_SECRET: process.env.PUSHER_SECRET,
    PUSHER_CLUSTER: process.env.PUSHER_CLUSTER,
    PUSHER_LOGTOCONSOLE: false,
  }
}