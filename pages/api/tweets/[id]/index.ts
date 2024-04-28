import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../../lib/server/db';
import { getIronSession } from 'iron-session';
import { SessionData, sessionOptions } from '../../../../lib/server/session';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getIronSession<SessionData>(req, res, sessionOptions);
  const tweet = await db.tweet.findUnique({
    where: {
      id: +req.query.id
    },
    include: {
      user: {
        select: {
          id: true,
          name: true
        }
      },
      _count: {
        select: {
          favs: true
        }
      }
    }
  });
  const isLiked = await db.fav.findFirst({
    where: {
      tweetId: tweet?.id,
      userId: session.user
    },
    select: {
      id: true
    }
  });
  res.json({
    ok: true,
    tweet,
    isLiked
  });
}

export default handler;
