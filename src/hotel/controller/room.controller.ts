import { validationResult } from "express-validator";
import { Request, Response } from "express";
import HotelModel from "../../database/models/hotel.model";
import RoomModel from "../../database/models/room.model";
import { uploadToCloudinary } from "../../utils/cloudinary/cloudinary.stream";
import { RoomStatus } from "../../database/interface/room.interface";




export const userAddRoomController = async (
    req: Request,
    res: Response,
) => {
  
  try {
    const {
      type, price, parking, accessibility, petFriendly, breakfast, wifi, pool
    } = req.body;

    const file = req.file
    if (!file) {
      return res
        .status(401)
        .json({ message: "please file is required" });
    }

    const uploadResults = await uploadToCloudinary(file)

    const picture = uploadResults.secure_url

    const newRoom = new RoomModel({
      hotel: req.hotel?._id,
      type,
      price,
      parking,
      accessibility,
      petFriendly,
      breakfast,
      wifi,
      pool,
      picture
    })

    const saveNewRoom = await newRoom.save()

    return res.status(200).json({ data: saveNewRoom});
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
  
}


export const getAllRoomController = async (
    req: Request,
    res: Response,
) => {
  
  try {
    const page: any = req.query.page || 1; 
    const limit: any = req.query.limit || 100;

    const skip = (page - 1) * limit; 

    const rooms = await RoomModel.find({hotel: req.hotel?._id})
    .sort({createdAt: -1})
    .skip(skip)
    .limit(limit)

    const total = await RoomModel.countDocuments({hotel: req.hotel?._id})

    return res.status(200).json({ 
      currentPage: page,
      total: total,
      totalPages: Math.ceil(total / limit),
      rooms
    });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
  
}


export const getTotalRoomByStatusController = async (
    req: Request,
    res: Response,
) => {
  
  try {
    const status: any = req.query.status
   
    const total = await RoomModel.countDocuments({hotel: req.hotel?._id, status})

    return res.status(200).json({ 
      total
    });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
  
}





  