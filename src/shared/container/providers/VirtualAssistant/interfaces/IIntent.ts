import { RequestHandler, ErrorHandler } from 'ask-sdk';

interface IIntent {
  getIntent(): RequestHandler | ErrorHandler;
}

export default IIntent;
