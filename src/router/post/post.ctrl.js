// @flow

import type { Context } from 'koa';
import Joi from 'joi';
import { validateSchema } from 'lib/common';
import { Category, Post, PostsCategories, PostsTags, Tag, User, UserProfile } from 'database/models';

import { type PostModel } from 'datbase/models/Post';

export const writePost = async (ctx: Context): Promise<*> => {
  type BodySchema = {
    title: string,
    body: string,
  }
};


