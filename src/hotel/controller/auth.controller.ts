import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import HotelModel from "../../database/models/hotel.model";
import { sendForgotPasswordEmail } from "../../utils/email/emails.util";

export const hotelSignUpController = async (
    req: Request,
    res: Response,
  ) => {
  
  try {
    const {
      email,
      password,
      name, 
      phoneNumber,
      branches
    } = req.body;
    // Check for validation errors
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const checkEmailExists = await HotelModel.findOne({ email });

     // check if hotel exists
     if (checkEmailExists) {
      return res
        .status(401)
        .json({ message: "Email exists already" });
    }
  
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const hotel = new HotelModel({
      email: email,
      password: hashedPassword,
      name,
      phoneNumber,
      branches
    });
    
    let hotelSaved = await hotel.save();
  
    res.json({
      message: "Signup successful",
      hotel: {
        id: hotelSaved._id,
        email: hotelSaved.email,
        name: hotelSaved.name
      },
  
    });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
  
}
  
  

export const searchHotelPartnerController = async (
    req: Request,
    res: Response,
) => {

  try {
      const { search } = req.query;

      const query: any = {};

    // Search by name if provided
    if (search) {
      query.name = { $regex: search, $options: "i" }; // case-insensitive
    }

    const hotels = await HotelModel.find(query)
      .select("_id name") // return only _id and name
      .sort({ name: 1 }) // order by name (ascending)
      .lean();
    
    // return access token
    res.json({
      success: true,
      data: hotels
    });
  
      
  } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
  }
}




export const hotelSignInController = async (
    req: Request,
    res: Response,
) => {

  try {
      const {
        email,
        password,
      } = req.body;
      // Check for validation errors
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      // try find hotel with the same email
      const hotel = await HotelModel.findOne({ email });
  
      // check if hotel exists
      if (!hotel) {
        return res
          .status(401)
          .json({ message: "incorrect credential" });
      }
  
      // compare password with hashed password in database
      const isPasswordMatch = await bcrypt.compare(password, hotel.password);
      if (!isPasswordMatch) {
        return res.status(401).json({ message: "incorrect credential." });
      }
  
      // generate access token
      const accessToken = jwt.sign(
        { 
          id: hotel?._id,
          email: hotel.email,
        },
        process.env.JWT_HOTEL_SECRET_KEY!,
        //{ expiresIn: "24h" }
      );
  
      // return access token
      res.json({
        message: "Login successfully",
        Token: accessToken,
        hotel: {
          name: hotel.name
        }
      });
  
      
  } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
  }
}

export async function hotelForgotPasswordController(req: Request, res: Response): Promise<Response> {
  const { email } = req.body;
  try {
    const hotel = await HotelModel.findOne({ email });
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    // Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000);

    hotel.resetPasswordExpires = new Date(); // 30 minutes from now
    hotel.resetPasswordExpires.setMinutes(hotel.resetPasswordExpires.getMinutes() + 15);
    hotel.resetPasswordOtp = otp;
    hotel.resetPasswordRequest = true;

    await hotel.save();

    // Send OTP to user's email
    await sendForgotPasswordEmail(email, otp);

    return res.status(200).json({ message: 'OTP sent to email for password reset' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function hotelResetPasswordController(req: Request, res: Response): Promise<Response> {
  try {

    const { email, otp,  password } = req.body;
    const hotel = await HotelModel.findOne({ email });
    if (!hotel) {
      return res.status(404).json({ message: 'Invalid request' });
    }

    // Check if OTP is valid and not expired
    if (hotel.resetPasswordOtp !== parseInt(otp.trim(), 10)) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    if (!hotel.resetPasswordRequest) {
      return res.status(400).json({ message: 'Please request for password change' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    hotel.resetPasswordRequest = false
    hotel.password = hashedPassword
    await hotel.save()
    
    return res.status(200).json({ message: 'password successfully change' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
