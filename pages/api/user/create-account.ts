import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/server/db';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userInfo = req.body;

  const isUserExist = await db.user.findUnique({
    where: { email: userInfo.email },
    select: { id: true }
  });
  if (isUserExist) {
    return res.status(403).json({ ok: false, message: '이미 있는 회원입니다.' });
  }

  await db.user.create({
    data: {
      ...userInfo
    }
  });
  return res.status(200).json({
    ok: true
  });
}

export default handler;
