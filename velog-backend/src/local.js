// @flow
import SocialAccount from 'database/models/SocialAccount';
import Server from './server';

const server: Server = new Server();
server.listen(4000);
