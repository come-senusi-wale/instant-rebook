import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import HotelModel from "../../database/models/hotel.model";

export const hotelSignUpController = async (
    req: Request,
    res: Response,
  ) => {
  
  try {
    const {
      email,
      password,
      name, 
      phoneNumber
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
      phoneNumber
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
  
  
  //admin signin by email/////////////
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
        });
    
        
    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
    }
  }
  