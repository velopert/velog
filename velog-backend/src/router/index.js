// @flow
import Router from 'koa-router';
import auth from './auth';

const router: Router = new Router();

router.use('/auth', auth.routes());

export default router;
