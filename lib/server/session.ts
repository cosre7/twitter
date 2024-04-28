import { SessionOptions } from 'iron-session';

export const sessionOptions: SessionOptions = {
  password: process.env.COOKIE_PASSWORD!,
  cookieName: 'tweet'
};

export interface SessionData {
  user: number;
}
