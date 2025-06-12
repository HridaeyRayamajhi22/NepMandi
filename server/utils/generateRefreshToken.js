import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateRefreshToken = async (userId) => {
  const token = await jwt.sign({ id: userId }, process.env.SECRET_KEY_REFRESH_TOKEN, {
    expiresIn: "7d",
  });

  const updateRefreshToken = await UserModel.updateOne(
    {
      _id: userId,
    },
    {
        refreshToken: token,
    }
  );
  return token;
};

export default generateRefreshToken;