// @flow
import Server from './server';
import Account from 'database/models/Account';

const server: Server = new Server();

export const handler: any = server.serverless();
