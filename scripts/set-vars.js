const fs = require('fs');

const vars = require('./vars');
let file_content;

if (process.env.NODE_ENV == 'production') {
  file_content = `module.exports = {
    PUSHER_KEY: '${process.env.PUSHER_KEY}', 
    PUSHER_CLUSTER: '${process.env.PUSHER_CLUSTER}',
    PUSHER_LOGTOCONSOLE: ${process.env.PUSHER_LOGTOCONSOLE}
  };`;
} 
else {
  file_content = `module.exports = {
    PUSHER_KEY: '${vars.developemnt.PUSHER_KEY}', 
    PUSHER_CLUSTER: '${vars.developemnt.PUSHER_CLUSTER}',
    PUSHER_LOGTOCONSOLE: ${vars.developemnt.PUSHER_LOGTOCONSOLE}
  };`;
}

fs.writeFile('./public/vars.js', file_content, (err) => {
  if (err) throw err;
  console.log('setvars done!');
});