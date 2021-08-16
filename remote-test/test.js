const universalAdapter = require('./universal-adapter');

const login = { host: '10.0.0.25', username: 'tore', password: 'ynglinge' };
universalAdapter(login, '../src/example').catch(console.log);