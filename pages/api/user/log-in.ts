import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/server/db';
import { getIronSession } from 'iron-session';
import { SessionData, sessionOptions } from '../../../lib/server/session';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.body);
  const { email, password } = req.body;
  const session = await getIronSession<SessionData>(req, res, sessionOptions);

  const user = await db.user.findUnique({
    where: { email: email },
    select: { id: true, password: true }
  });
  if (session.user === user?.id) {
    return res.status(200).json({
      ok: true
    });
  }
  if (!user) {
    return res.status(403).json({ ok: false, message: '가입된 이메일이 아닙니다.' });
  }
  if (user.password !== password) {
    return res.status(403).json({ ok: false, message: '비밀번호가 다릅니다.' });
  }

  session.user = user?.id;
  await session.save();

  return res.status(200).json({
    ok: true
  });
}

export default handler;
