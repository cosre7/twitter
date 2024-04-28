import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/server/db';
import { getIronSession } from 'iron-session';
import { SessionData, sessionOptions } from '../../../lib/server/session';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getIronSession<SessionData>(req, res, sessionOptions);
  console.log('session', session.user);

  if (!session.user) {
    console.log('session 없음');
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
    console.log('아이디 다름');
    return res.status(400).json({
      ok: false
    });
  }

  console.log('로그인 성공');
  return res.status(200).json({
    ok: true
  });
}

export default handler;
