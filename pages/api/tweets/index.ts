import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/server/db';
import { getIronSession } from 'iron-session';
import { SessionData, sessionOptions } from '../../../lib/server/session';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getIronSession<SessionData>(req, res, sessionOptions);
  if (req.method === 'GET') {
    const tweets = await db.tweet.findMany({
      include: {
        _count: {
          select: {
            favs: true
          }
        },
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    res.json({
      ok: true,
      tweets
    });
  }
  if (req.method === 'POST') {
    const {
      body: { content }
    } = req;

    const tweet = await db.tweet.create({
      data: {
        content,
        user: {
          connect: {
            id: session.user
          }
        }
      }
    });
    res.json({
      ok: true,
      tweet
    });
  }
}

export default handler;
