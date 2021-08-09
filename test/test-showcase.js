const universalAdapter = require('../src/universal-adapter');

const login = { host: '10.0.0.25', username: 'tore', password: 'ynglinge' };
universalAdapter(login, './showcase').catch(() => console.log('Login failed'));