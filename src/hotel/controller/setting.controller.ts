import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import HotelModel from "../../database/models/hotel.model";
import { sendForgotPasswordEmail } from "../../utils/email/emails.util";


export const hotelProfileController = async (
    req: Request,
    res: Response,
  ) => {
  
  try {
    const hotelId =  req.hotel?._id

    const hotel = await HotelModel.findOne({ _id: hotelId }).select("-password -emailOtp -resetPasswordOtp -resetPasswordExpires -resetPasswordRequest");

     // check if hotel exists
     if (!hotel) {
      return res
        .status(401)
        .json({ message: "Hotel not found" });
    }
  
    res.json({
      hotel
    });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
  
}


export const hotelUpdateProfileController = async (
    req: Request,
    res: Response,
  ) => {
  
  try {
    const {
      address,
      password,
      name, 
      phoneNumber,

    } = req.body;

    const hotelId =  req.hotel?._id

    const hashedPassword = await bcrypt.hash(password, 10);
  
    const updateProfile = await HotelModel.findOneAndUpdate({_id: hotelId}, {address, name, phoneNumber, password: hashedPassword}, {new: true})

    // check if hotel exists
    if (!updateProfile) {
        return res
        .status(401)
        .json({ message: "Unable to update profile" });
    }

  
    res.json({
      message: "Profile updated successful",
      hotel: {
        id: updateProfile._id,
        email: updateProfile.email,
        name: updateProfile.name
      },
  
    });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
  
}