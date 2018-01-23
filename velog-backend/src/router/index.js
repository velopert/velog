// @flow
import Router from 'koa-router';
import needsAuth from 'lib/middlewares/needsAuth';
import auth from './auth';
import posts from './posts';
import me from './me';

const router: Router = new Router();

router.use('/auth', auth.routes());
router.use('/posts', posts.routes());
router.use('/me', needsAuth, me.routes());

export default router;
