import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import HotelModel from "../../database/models/hotel.model";
import { IHotel } from "../../database/interface/hotel.interface";


interface JwtPayload {
    email: string;
    _id: string;
}

interface CustomRequest extends Request {
    jwtPayload?: JwtPayload;
    hotel: IHotel;
}

declare global {
  namespace Express {
    interface Request {
      hotel?: IHotel;
    }
  }
}
export const checkHotelRole = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {

    let secret = process.env.JWT_HOTEL_SECRET_KEY;
  // Get JWT from Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  try {
    // Verify JWT and extract payload
    const payload = jwt.verify(token, secret!) as unknown as JwtPayload;
   
    // Check if email and mobile are in the MongoDB and belong to an admin role
    const hotel = await HotelModel.findOne({
      email: payload.email
    });

    if (!hotel) {
      return res
        .status(403)
        .json({ message: "Access denied. Hotel role required." });
    }

    // Add the payload to the request object for later use
    req.hotel = hotel;
    
    // Call the next middleware function
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid authorization token" });
  }
}