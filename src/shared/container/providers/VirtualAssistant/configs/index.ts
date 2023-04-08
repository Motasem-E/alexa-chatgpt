import { env } from '@config/env';

export default {
  cardTitle: 'Chatbot!',
  speaker: (language: string) => (language === 'en-US' ? 'Joey' : 'Ricardo'),
  persistHistory: env.HISTORY_LIMIT || 100,
};
