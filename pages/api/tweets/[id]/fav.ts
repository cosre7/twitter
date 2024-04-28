import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../../lib/server/db';
import { getIronSession } from 'iron-session';
import { SessionData, sessionOptions } from '../../../../lib/server/session';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getIronSession<SessionData>(req, res, sessionOptions);
  const { id } = req.query;
  if (!id) return res.status(400).json({ ok: false });

  const alreadyExists = await db.fav.findFirst({
    where: {
      tweetId: +id,
      userId: session.user
    }
  });
  if (alreadyExists) {
    await db.fav.delete({
      where: {
        id: alreadyExists.id
      }
    });
  } else {
    await db.fav.create({
      data: {
        user: {
          connect: {
            id: session.user
          }
        },
        tweet: {
          connect: {
            id: +id
          }
        }
      }
    });
  }
  res.json({ ok: true });
}

export default handler;
