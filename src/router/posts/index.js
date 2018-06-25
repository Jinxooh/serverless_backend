// @flow
import Router from 'koa-router';
import needsAuth from 'lib/middlewares/needsAuth';

import * as postCtrl from './post.ctrl';

const post: Router = new Router();

post.post('/', needsAuth, postCtrl.writePost);
post.get('/@:username/:urlSlug', postCtrl.readPost); // @ + username/urlSlug
post.get('/@:username/:category?', postCtrl.listPosts);

export default post;
