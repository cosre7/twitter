import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/server/db';
import { getIronSession } from 'iron-session';
import { SessionData, sessionOptions } from '../../../lib/server/session';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getIronSession<SessionData>(req, res, sessionOptions);

  await session.destroy();

  return res.status(200).json({
    ok: true
  });
}

export default handler;
