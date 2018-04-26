// @flow
import Router from 'koa-router';
import type { Context } from 'koa';
import auth from './auth';

const router: Router = new Router();

router.get('/bye', (ctx) => {
  ctx.body = process.env.SOMETHING;
});

router.use('/auth', auth.routes());
router.get('/check', (ctx: Context) => {
  ctx.body = {
    version: '1.0.0.-alpha.0',
  };
});


export default router;
