// @flow
import Router from 'koa-router';
import auth from './auth';
import post from './post';

const router: Router = new Router();

router.use('/auth', auth.routes());
router.use('/post', post.routes());

export default router;
