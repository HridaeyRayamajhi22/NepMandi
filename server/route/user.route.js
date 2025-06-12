import {Router} from 'express';
import { forgotPasswordController, loginUserController, logoutUserController, refreshTokenController, registerUserController, resetPasswordController, updateUserProfileController, uploadUserAvatarController, userDetails, VerifyEmailController, verifyForgotPasswordOtpController } from '../controllers/users.controller.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/multer.js';


const userRouter = Router();

userRouter.post('/register', registerUserController)
userRouter.post('/verify-email', VerifyEmailController)
userRouter.post('/login', loginUserController)
userRouter.get('/logout',auth,logoutUserController)
userRouter.put('/upload-avatar',auth,upload.single('avatar'), uploadUserAvatarController )
userRouter.put('/update-user',auth,updateUserProfileController)
userRouter.put('/forgot-password',forgotPasswordController)
userRouter.put('/verify-forgot-password-otp',verifyForgotPasswordOtpController)
userRouter.put('/reset-password',resetPasswordController)
userRouter.post('/refresh-token',refreshTokenController)
userRouter.get('/user-details',auth,userDetails)

export default userRouter;