const universalAdapter = require('./universal-adapter');

const login = { host: '', username: '', password: '' };
universalAdapter(login, () => {
  require('../src/example');
}).catch(console.log);
