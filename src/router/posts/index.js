// @flow
import Router from 'koa-router';
import needsAuth from 'lib/middlewares/needsAuth';

import * as postsCtrl from './posts.ctrl';

const post: Router = new Router();

post.post('/', needsAuth, postsCtrl.writePost);
post.get('/@:username/:urlSlug', postsCtrl.readPost); // @ + username/urlSlug
post.get('/@:username', postsCtrl.listPosts);

export default post;
