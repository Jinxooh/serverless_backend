// @flow
import type { Context } from 'koa';
import Joi from 'joi';
// import mailgun from 'mailgun-js';

import sendMail from 'lib/sendMail';
import User from 'database/models/User';
import UserProfile from 'database/models/UserProfile';
import EmailAuth from 'database/models/EmailAuth';
import { generate, decode } from 'lib/token';

import type { UserModel } from 'database/models/User';
import type { UserProfileModel } from 'database/models/UserProfile';
import type { EmailAuthModel } from 'database/models/EmailAuth';

export const sendAuthEmail = async (ctx: Context): Promise<*> => {
  console.log('verifyEmail');
  type BodySchema = {
    email: string
  };

  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
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

  try {
    const { email }: BodySchema = (ctx.request.body: any);

    // Todo: check email existancy
    const user = await User.findUser('email', email);
    const emailKeywords = user ? {
      type: 'email-login',
      text: 'Login',
    } : {
      type: 'register',
      text: 'register',
    };

    const verification: EmailAuthModel = await EmailAuth.build({
      email,
    }).save();

    const data = await sendMail({
      to: email,
      subject: `${emailKeywords.text} Love Heo Hye Jung!!`,
      from: 'Love HHJ <support@lovehhj.com>',
      body: `
      <a href="https://lovehhj.com"><img src="https://i.imgur.com/mCY8EIA.png" title="source: imgur.com" style="display: block; width: 250pxyayar; margin: 0 auto;"/></a>
      <div style="max-width: 100%; width: 400px; margin: 0 auto; padding: 1rem; text-align: justify; background: #f8f9fa; border: 1px solid #dee2e6; box-sizing: border-box; border-radius: 4px; color: #868e96; margin-top: 0.5rem; box-sizing: border-box;">
        <b style="black">Welcome to LOVE HHJ 🙈</b><br /> Following is the link for quickly ${emailKeywords.text} to us. See you soon~~
      </div>
      
      <a href="https://lovehhj.com/${emailKeywords.type}?code=${verification.code}" style="text-decoration: none; width: 400px; text-align:center; display:block; margin: 0 auto; margin-top: 1rem; background: #845ef7; padding-top: 1rem; color: white; font-size: 1.25rem; padding-bottom: 1rem; font-weight: 600; border-radius: 4px;">${emailKeywords.text} Love HHJ</a>
      
      <div style="text-align: center; margin-top: 1rem; color: #868e96; font-size: 0.85rem;"><div>Click folloing link or copy/paste this link into your browser: <br/> <a style="color: #b197fc;" href="https://lovehhj.com/${emailKeywords.type}?code=${verification.code}">https://lovehhj.com/${emailKeywords.type}?code=${verification.code}</a></div><br/><div>This link will expire in 24 hours.</div></div>`,
    });
    ctx.body = {
      isUSer: !!user,
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const getCode = async (ctx: Context): Promise<*> => {
  const { code } = ctx.params;

  try {
    const auth: EmailAuthModel = await EmailAuth.findCode(code);
    if (!auth) {
      ctx.status = 404;
      return;
    }
    const { email } = auth;
    const registerToken = await generate({ email }, { expiresIn: '1h', subject: 'auth-register' });
    ctx.body = {
      email,
      registerToken,
    };
    // await auth.use();
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const createLocalAccount = async (ctx: Context): Promise<*> => {
  type BodySchema = {
    registerToken: string,
    form: {
      displayName: string,
      username: string,
      shorBio: string,
    }
  };

  const schema = Joi.object().keys({
    registerToken: Joi.string().required(),
    form: Joi.object().keys({
      displayName: Joi.string().min(1).max(40),
      username: Joi.string().alphanum().min(3).max(16)
        .required(),
      shortBio: Joi.string().max(140),
    }).required(),
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

  const {
    registerToken,
    form: {
      username,
      shortBio,
      displayName,
    },
  }: BodySchema = (ctx.request.body: any);

  let decoded = null;

  try {
    decoded = await decode(registerToken);
  } catch (e) {
    ctx.status = 400;
    ctx.body = {
      name: 'INVALID_TOKEN',
    };
    return;
  }

  const { email } = decoded;

  try {
    const [emailExists, usernameExists] = await Promise.all([
      User.findUser('email', email),
      User.findUser('username', username),
    ]);

    if (emailExists || usernameExists) {
      ctx.status = 409;
      ctx.body = {
        name: 'DUPLICATED_ACCOUNT',
        payload: emailExists ? 'email' : 'username',
      };
      return;
    }
  } catch (e) {
    console.log(e);
  }

  try {
    const user: UserModel = await User.build({
      username,
      email,
    }).save();

    const userProfile = await UserProfile.build({
      fk_user_id: user.id,
      display_name: displayName,
      short_bio: shortBio
    }).save();

    const token: string = await user.generateToken();

    // set-cookie
    // $FlowFixMe: intersection bug
    ctx.cookies.set('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    ctx.body = {
      user: {
        id: user.id,
        username: user.username,
        displayName,
      },
      token,
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const localLogin = async (ctx: Context): Promise<*> => {
  type BodySchema = {
    email?: string,
    password: string,
    username?: string,
  }

  const { email, password, username }: BodySchema = (ctx.request.body: any);

  if (!(email || username)) {
    ctx.status = 401;
    ctx.body = {
      name: 'LOGIN_FAILURE',
    };
    return;
  }

  const schema = Joi.object().keys({
    email: Joi.string().email(),
    password: Joi.string().min(6).required(),
    username: Joi.string().alphanum().min(3).max(20),
  });

  // somehow wrong schema
  const result: any = Joi.validate(ctx.request.body, schema);
  if (result.error) {
    ctx.status = 401;
    ctx.body = {
      name: 'LOGIN_FAILURE',
    };
    return;
  }

  try {
    const value: any = email || username;
    const type: ('email' | 'username') = email ? 'email' : 'username';
    const user: UserModel = await User.findUser(type, value);

    if (!user) {
      ctx.status = 401;
      ctx.body = {
        name: 'LOGIN_FAILURE',
      };
      return;
    }

    const validated: boolean = await user.validatePassword(password);
    if (!validated) {
      ctx.status = 401;
      ctx.body = {
        name: 'LOGIN_FAILURE',
      };
      return;
    }

    const token: string = await user.generateToken();

    // set-cookie
    // $FlowFixMe: intersection bug
    ctx.cookies.set('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    ctx.body = {
      user: {
        id: user.id,
        username: user.username,
      },
      token,
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const check = async (ctx: Context): Promise<*> => {
  if (!ctx.user) {
    ctx.status = 401;
    return;
  }
  ctx.body = ctx.user;
};
