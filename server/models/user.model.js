import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  avatar:{
    type: String,
    default: ""
  },
  mobile: {
    type: Number,
    default: null
  },
  refreshToken: {
    type: String,
    default: ""
  },
  verify_email: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: ""
  },
  status: {
    type: String,
    enum: ["active", "inactive", "banned"],
    default: "active",
  },
  address_details: [
    { 
        type: mongoose.Schema.ObjectId,
        ref: "Address",
     }
  ],
  shopping_cart: [
    { 
        type: mongoose.Schema.ObjectId,
        ref: "CartProduct"
     }
  ],
  orderHistory: [
    { 
        type: mongoose.Schema.ObjectId,
        ref: "Order"
     }
  ],
  forgotPasswordToken: {
    type: String,
    default: ""
  },
  forgotPasswordTokenExpiry: {
    type: Date,
    default: ""
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  }
},{ 
    timestamps: true
}) 

const UserModel = mongoose.model("User", userSchema);
export default UserModel;