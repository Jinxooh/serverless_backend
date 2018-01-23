// @flow
import type { Context } from 'koa';
import Joi from 'joi';
import { User, UserProfile } from 'database/models';

export const createLocalAccount = async (ctx: Context): Promise<*> => {
  type BodySchema = {
    email: string,
    password: string,
    username: string,
  };

  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6),
    username: Joi.string().alphanum().min(3).max(20)
      .required(),
  });

  const result: any = Joi.validate(ctx.request.body, schema);
  if (result.error) {
    ctx.status = 400;
    ctx.body = {
      name: 'WRONG_SCHEMA',
      payload: result.error,
    };
    return;
  }

  const { email, password, username }: BodySchema = (ctx.request.body: any);

  try {
    const user = await User.build({
      username,
      email,
      password_hash: User.crypt(password),
    }).save();

    console.log(user);
  } catch (e) {
    ctx.throw(500, e);
  }
  ctx.body = {
    success: true,
  };
};
