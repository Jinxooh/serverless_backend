// @flow
import Router from 'koa-router';
import auth from './auth';

const router: Router = new Router();

router.get('/bye', (ctx) => {
  ctx.body = 'good bye~~';
});

router.use('/auth', auth.routes());

export default router;
