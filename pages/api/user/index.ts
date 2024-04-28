import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/server/db';
import { getIronSession } from 'iron-session';
import { SessionData, sessionOptions } from '../../../lib/server/session';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getIronSession<SessionData>(req, res, sessionOptions);
  console.log('session', session.user);

  if (!session.user) {
    return res.status(400).json({
      ok: false
    });
  }
  const user = await db.user.findUnique({
    where: {
      id: session.user
    }
  });
  if (session.user !== user?.id) {
    return res.status(400).json({
      ok: false
    });
  }

  return res.status(200).json({
    ok: true
  });
}

export default handler;
