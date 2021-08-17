const universalAdapter = require('./universal-adapter');

const login = { host: '', username: '', password: '' };
universalAdapter(login, '../src/example').catch(console.log);
