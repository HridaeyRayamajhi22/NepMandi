import UserModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import dotenv from "dotenv";
dotenv.config();
import sendEmail from "../config/sendEmail.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";
import generateOtp from "../utils/generateOtp.js";
import forgotPasswordTemplate from "../utils/forgorPasswordtemplate.js";
import jwt from "jsonwebtoken";
import { response } from "express";

// Register user controller
export async function registerUserController(req, res) {
  try {
    const { name, email, password } = req.body;

    // Validate user input
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        error: true,
        success: false,
      });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
        error: true,
        success: false,
      });
    }
    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const payload = {
      name,
      email,
      password: hashedPassword,
    };

    // Create new user
    const newUser = new UserModel(payload);
    const save = await newUser.save();

    const VerifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`;

    const verifyEmail = await sendEmail({
      sendTo: email,
      subject: "Verify your email",
      html: verifyEmailTemplate({
        name,
        url: VerifyEmailUrl,
      }),
    });

    return res.status(201).json({
      message: "User registered successfully",
      error: false,
      success: true,
      data: save,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error registering user",
      error: true,
      success: false,
    });
  }
}

//Verify email controller
export async function VerifyEmailController(req, res) {
  try {
    const { code } = req.body;
    const user = await UserModel.findOne({ _id: code });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }
    const updateUser = await UserModel.updateOne(
      { _id: code },
      {
        verify_email: true,
      }
    );

    return res.status(200).json({
      message: "Email verified successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error verifying email",
      error: true,
      success: false,
    });
  }
}


// controllers/users.controller.js
export async function loginUserController(req, res) {
  try {
    const { email, password } = req.body;

    /* ───────── validate ───────── */
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required', error: true, success: false });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password', error: true, success: false });
    }
    if (user.status !== 'active') {
      return res.status(401).json({ message: 'User is not active', error: true, success: false });
    }

    const ok = await bcryptjs.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials', error: true, success: false });
    }

    /* ───────── update lastLogin ───────── */
    user.lastLogin = new Date();
    await user.save();

    /* ───────── tokens & cookies ───────── */
    const AccessToken  = await generateAccessToken(user._id);
    const RefreshToken = await generateRefreshToken(user._id);

    const cookieOpts = { httpOnly: true, secure: true, sameSite: 'none' };
    res.cookie('AccessToken',  AccessToken,  cookieOpts);
    res.cookie('RefreshToken', RefreshToken, cookieOpts);

    /* ───────── user payload (send avatar!) ───────── */
    const profile = {
      _id:       user._id,
      name:      user.name,
      email:     user.email,
      avatar:    user.avatar,   //  ✅  NEW avatar url is here
      mobile:    user.mobile,
      role:      user.role,
      status:    user.status,
      lastLogin: user.lastLogin,
      verify_email: user.verify_email,
    };

    return res.status(200).json({
      message: 'User logged in successfully',
      success: true,
      error:   false,
      data: {
        AccessToken,
        RefreshToken,
        user: profile          //  ✅  send to client
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Error logging in user', error: true, success: false });
  }
}


// logout controller
export async function logoutUserController(req, res) {
  try {
    const userId = req.userId //Middleware


    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };
    res.clearCookie("AccessToken",cookiesOption)
    res.clearCookie("RefreshToken",cookiesOption)

    const removeRefreshToken = await UserModel.findByIdAndUpdate(userId,{
         refreshToken : ""
    })

    return res.status(200).json({
      message: "User logged out successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error logging out user",
      error: true,
      success: false,
    });
  }
}

//Upload user avatar
export async function uploadUserAvatarController(req, res) {
  try {
    console.log("Uploaded File:", req.file);
    const userId = req.userId;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload to Cloudinary
    const upload = await uploadImageCloudinary(req.file);
    console.log("Cloudinary Upload Response:", upload);

    // If upload is a direct URL, use it instead of `upload.url`
    if (!upload || !upload.secure_url) {
      return res.status(500).json({
        message: "Failed to upload image to Cloudinary",
        success: false,
      });
    }

    // Extract the secure URL for Cloudinary's image URL
    const avatarUrl = upload.secure_url;

    // Update user avatar
    const updateUser = await UserModel.findByIdAndUpdate(
      userId,
      { avatar: avatarUrl },  // 👈 Directly use `upload` instead of `upload.url`
      { new: true } // Return updated user
    );

    console.log("Updated User:", updateUser);

    return res.json({
      message: "User avatar uploaded successfully",
      success: true,
      error:false,
      data: {
        _id: userId,
        avatar: avatarUrl,  // ✅ Fix: Return the correct avatar URL
      },
    });
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return res.status(500).json({
      message: "Error uploading avatar",
      error: error.message,
      success: false,
    });
  }
}

// Update user profile controller
export async function updateUserProfileController(req, res) {
  try {
    const userId = req.userId; // From auth middleware
    const { name, email, mobile, password } = req.body;

    // Hash the password if provided
    let hashPassword;
    if (password) {
      const salt = await bcryptjs.genSalt(10);
      hashPassword = await bcryptjs.hash(password, salt);
    }

    // Build update object
    const updateData = {
      ...(name && { name }),
      ...(email && { email }),
      ...(mobile && { mobile }),
      ...(password && { password: hashPassword }),
    };

    // Find user and update, returning the updated document
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: "User profile updated successfully",
      error: false,
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      message: "Error updating user",
      error: error.message,
      success: false,
    });
  }
}

//Forgot password controller not logged in user
export async function forgotPasswordController(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        error: true,
        success: false,
      });
    }

    // Check if user exists
    const existingUser = await UserModel.findOne({ email });
     if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    const otp = generateOtp()
    const expireTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now


    const update = await UserModel.findByIdAndUpdate(existingUser._id, {
      forgotPasswordToken: otp,
      forgotPasswordTokenExpiry: expireTime.toISOString(),
    });

    await sendEmail({
      sendTo: email,
      subject: "Reset Password OTP",
      html: forgotPasswordTemplate({
        name: existingUser.name,
        otp: otp,
      }),
    });

    return res.status(200).json({
      message: "OTP sent to your email",
      error: false,
      success: true,
    });

  } catch (error) {
    console.error("Error in forgot password:", error); // Log the error
    return res.status(500).json({
      message: "Error in forgot password",
      error: true,
      success: false,
    });
  }
}

//Verify OTP for forgot password
export async function verifyForgotPasswordOtpController(req, res) { 
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
        error: true,
        success: false,
      });
    }

    // Check if user exists
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    const currentTime = new Date().toISOString();

    // Check if OTP is correct
    if (existingUser.forgotPasswordToken !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
        error: true,
        success: false,
      });
    }

    // Check if OTP has expired
    if (existingUser.forgotPasswordTokenExpiry < currentTime) {
      return res.status(400).json({
        message: "OTP has expired",
        error: true,
        success: false,
      });
    }

    const updateUser = await UserModel.findByIdAndUpdate(existingUser?._id,{
      forgotPasswordToken:  "",
      forgotPasswordTokenExpiry: ""
    })



    return res.status(200).json({
      message: "OTP verified successfully",
      error: false,
      success: true,
      data: existingUser._id, // Send user ID for password reset
    });

  } catch (error) {
    console.error("Error in verify OTP:", error); // Log the error
    return res.status(500).json({
      message: "Error in verify OTP",
      error: true,
      success: false,
    });
  }
}

//Reset password controller
export async function resetPasswordController(req, res) { 
  try {
    const { email, newPassword, confirmPassword } = req.body;
    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "All fields are required: email, newPassword, confirmPassword",
        error: true,
        success: false,
      });
    }

    // Check if user exists
    const updatedUser = await UserModel.findOne({ email });
    if (!updatedUser) {
      return res.status(404).json({
        message: "Email not found",
        error: true,
        success: false,
      });
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
        error: true,
        success: false,
      });
    }

    // Hash the new password
    const salt = await bcryptjs.genSalt(10);
    let hashPassword = await bcryptjs.hash(newPassword, salt);

    // Update user password
    await UserModel.findOneAndUpdate(
      { _id: updatedUser._id },
      { password: hashPassword, forgotPasswordToken: "", forgotPasswordExpire: "" }
    );

    return res.status(200).json({
      message: "Password reset successfully",
      error: false,
      success: true,
    });

  } catch (error) {
    console.error("Error in reset password:", error);
    return res.status(500).json({
      message: "Error in reset password",
      error: true,
      success: false,
    });
  }
}

//Refresh token controller
export async function refreshTokenController(req, res) {
  try {
    // Extract the refresh token from cookies or authorization header
    const RefreshToken = req.cookies.RefreshToken || req.headers?.authorization?.split(" ")[1];

    if (!RefreshToken) {
      return res.status(401).json({
        message: "Refresh token not found",
        error: true,
        success: false,
      });
    }

    // Try to verify the refresh token
    let verifyToken;
    try {
      verifyToken = jwt.verify(RefreshToken, process.env.SECRET_KEY_REFRESH_TOKEN );
    } catch (error) {
      return res.status(401).json({
        message: "Invalid or expired refresh token",
        error: true,
        success: false,
      });
    }

    console.log("Verified Token Payload:", verifyToken); // Debugging line

    const userId = verifyToken.id; // Accessing `id` instead of `_id` from payload

    if (!userId) {
      return res.status(401).json({
        message: "Invalid token payload",
        error: true,
        success: false,
      });
    }

    // Generate a new access token
    const newAccessToken = await generateAccessToken(userId);

    const cookiesOption = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };


    res.cookie("AccessToken", newAccessToken, cookiesOption);
    return res.status(200).json({
      message: "Access token refreshed successfully",
      error: false,
      success: true,
      data: {
        AccessToken: newAccessToken,
      },
    });
  } catch (error) {
    console.error("Error refreshing token:", error); // Log the error
    return res.status(500).json({
      message: "Error refreshing token",
      error: true,
      success: false,
    });
  }
}

//Get login user details
export async function userDetails(req,res){
    try{
           const userId = req.userId  //Middleware
           console.log(userId)

           const user = await UserModel.findById(userId).select('-password -refreshToken')

           return res.json({
              message : "User Details",
              data : user,
              error : false,
              success: true
           })
    }catch(error)
    {
       return res.status(500).json({
          message: 'Something is wrong',
          error : true,
          success : false
       })
    }

}
