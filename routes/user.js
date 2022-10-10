const userRouter = require('express').Router();
const { getUsersMe, patchUsersMe } = require('../controllers/user');
const { validPatchUsersMe } = require('../middlewares/validationJoy');

userRouter.get('/users/me', getUsersMe);

userRouter.patch('/users/me', validPatchUsersMe, patchUsersMe);

module.exports = userRouter;
