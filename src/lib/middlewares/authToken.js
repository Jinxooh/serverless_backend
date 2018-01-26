// @flow
import { decode } from 'lib/token';
import type { Context } from 'koa';

export default async (ctx: Context, next: () => Promise<*>) => {
  const token = ctx.cookies.get('token');
  if (!token) {
    ctx.user = null;
    return next();
  }

  try {
    const decoded: any = await decode(token);
    console.log(decoded);
    const { user, exp } = decoded;

    ctx.user = user;
    ctx.tokenExpire = exp;
  } catch (e) {
    ctx.user = null;
  }

  return next();
};
