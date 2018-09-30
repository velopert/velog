import { APIGatewayEvent, Context, Callback } from 'aws-lambda';
import * as serverlessHttp from 'serverless-http';
import Server from './server';

const server = new Server();

export const handler = (
  event: APIGatewayEvent,
  context: Context,
  cb: Callback
) => {
  // something to do before serverlessHttp
  return serverlessHttp(server.app)(event, context, cb);
};
