// @flow
import Server from './server';

const server: Server = new Server();

export const handler = server.serverless();
