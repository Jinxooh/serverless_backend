// @flow
// import SocialAccount from 'database/models/SocialAccount';
require('dotenv').config();
const Server = require('./server').default;

const server: Server = new Server();

server.listen(4000);
