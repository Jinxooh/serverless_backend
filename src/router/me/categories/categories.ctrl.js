// @flow
import type { Context } from 'koa';
import Joi from 'joi';
import { validateSchema, isUUID } from 'lib/common';
import { Category } from 'database/models';

export const listCategories = async (ctx: Context): Promise<*> => {
  const { id: userId } = ctx.user;

  try {
    const categories = await Category.listAllCategories(userId);
    ctx.body = categories;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const createCategory = async (ctx: Context): Promise<*> => {
  type BodySchema = {
    name: string
  };

  const schema = Joi.object().keys({
    name: Joi.string().required().min(1).max(40),
  });

  if (!validateSchema(ctx, schema)) return;

  const { name }: BodySchema = (ctx.request.body: any);
  const { id: userId } = ctx.user;
  try {
    const count = await Category.countRootCategories(userId);
    const category = await Category.build({
      name,
      order: count,
      fk_user_id: userId,
    }).save();
    ctx.body = category.toJSON();
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const renameCategory = async (ctx: Context): Promise<*> => {
  const { id } = ctx.params;
  if (!isUUID(id)) {
    ctx.status = 400;
    ctx.body = {
      name: 'NOT_UUID',
    };
    return;
  }

  type BodySchema = {
    name: string
  };

  const schema = Joi.object().keys({
    name: Joi.string().required().min(1).max(40),
  });

  if (!validateSchema(ctx, schema)) return;

  const { id: userId } = ctx.user;
  const { name }: BodySchema = (ctx.request.body: any);

  console.log('id', id);
  const category = await Category.findOne({
    attributes: ['name', 'id', 'parent', 'order', 'private'],
    where: {
      id,
      fk_user_id: userId,
    },
  });

  if (!category) {
    ctx.status = 404;
    return;
  }

  category.name = name;
  await category.save();

  ctx.body = category.toJSON();
};

export const deleteCategory = async (ctx: Context): Promise<*> => {
  const { id } = ctx.params;
  const { id: userId } = ctx.user;

  const category = await Category.findOne({
    attributes: ['id', 'order', 'parent', 'private', 'name'],
    where: {
      id,
      fk_user_id: userId,
    },
  });

  if (!category) {
    ctx.status = 404;
    return;
  }

  // try {
  //   await category.destory();
  //   await Category.update({
  //     order: literal('"order" - 1'),
  //   })
  // }
};
