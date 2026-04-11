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
      type, price, parking, accessibility, petFriendly, breakfast, wifi, pool, maxGuest
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
      picture,
      maxGuest
    })

    const saveNewRoom = await newRoom.save()

    return res.status(200).json({ data: saveNewRoom});
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
  
}

export const userRomoveRoomController = async (
    req: Request,
    res: Response,
) => {
  
  try {
    const { roomId } = req.params;

    const userId = req.hotel?._id

    const room = await RoomModel.findOne({ _id: roomId,  hotel: userId})
    if (!room) {
      return res
      .status(401)
      .json({ message: "room not found" });
    }

    if (room.status != RoomStatus.Available ) {
       return res
      .status(401)
      .json({ message: "room not availble" });
    }

    room.status = RoomStatus.Removed
    await room.save()

    return res.status(200).json({ message: "Room deleted successfully"});
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
  
}

export const userEditRoomController = async (
    req: Request,
    res: Response,
) => {
  try {
    const {
      type, price, parking, accessibility, petFriendly, breakfast, wifi, pool, maxGuest
    } = req.body;

    const { roomId } = req.params;

    const userId = req.hotel?._id

    const room = await RoomModel.findOne({ _id: roomId,  hotel: userId})
    if (!room) {
      return res
      .status(401)
      .json({ message: "room not found" });
    }

    room.type = type
    room.price = price
    room.accessibility = accessibility
    room.parking = parking
    room.petFriendly = petFriendly
    room.breakfast = breakfast
    room.wifi = wifi
    room.pool = pool
    room.maxGuest = maxGuest
    await room.save()

    return res.status(200).json({ message: "Room updated successfully"});
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
  
}

export const changeRoomImageController = async (
    req: Request,
    res: Response,
) => {  
  try {
    const { roomId } = req.params;

    const userId = req.hotel?._id

    const file = req.file
    if (!file) {
      return res
        .status(401)
        .json({ message: "please image is required" });
    }

    const room = await RoomModel.findOne({ _id: roomId,  hotel: userId})
    if (!room) {
      return res
      .status(401)
      .json({ message: "room not found" });
    }

    const uploadResults = await uploadToCloudinary(file)

    const picture = uploadResults.secure_url

    room.picture = picture
    await room.save()

    return res.status(200).json({ message: "Room updated successfully"});
    
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


export const searchForRoomController = async (
    req: Request,
    res: Response,
) => {
  try {

    const loginHotelId = req.hotel?._id

    const hotels = await searchHotels(req.query, loginHotelId);

    res.status(200).json({
      success: true,
      total: hotels.length,
      data: hotels
    });
  
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
  
}


export const getSingleRoomController = async (
    req: Request,
    res: Response,
) => {
  
  try {

    const { roomId } = req.params;

    const room = await RoomModel.findOne({
    _id: roomId
    })
    .populate({
      path: "hotel",
      select: "name email phoneNumber address createdAt updatedAt" // safe fields only
    });


    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: room
    });
  
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
  
}



// const searchHotels = async (query: any, userId: any) => {

//   const roomFilter: any = {
//     status: RoomStatus.Available
//   };

//   // room filters
//   if (query.type) roomFilter.type = query.type;

//   if (query.minPrice || query.maxPrice) {
//     roomFilter.price = {};

//     if (query.minPrice) roomFilter.price.$gte = Number(query.minPrice);
//     if (query.maxPrice) roomFilter.price.$lte = Number(query.maxPrice);
//   }

//   if (query.maxGuest) {
//     roomFilter.maxGuest = { $gte: Number(query.maxGuest) };
//   }

//   const booleanFields = [
//     "parking",
//     "accessibility",
//     "petFriendly",
//     "breakfast",
//     "wifi",
//     "pool"
//   ];

//   booleanFields.forEach((field) => {
//     if (query[field] !== undefined) {
//       roomFilter[field] = query[field] === "true";
//     }
//   });

//   const hotelMatch: any = {};

//   // hotel search by name
//   if (query.name) {
//     hotelMatch.name = {
//       $regex: query.name,
//       $options: "i"
//     };
//   }

//   const hotels = await HotelModel.aggregate([

//     {
//       $match: hotelMatch
//     },

//     {
//       $lookup: {
//         from: "rooms",
//         let: { hotelId: "$_id" },
//         pipeline: [
//           {
//             $match: {
//               $expr: {
//                 $eq: ["$hotel", "$$hotelId"]
//               }
//             }
//           },
//           {
//             $match: roomFilter
//           }
//         ],
//         as: "rooms"
//       }
//     },

//     // remove hotels without rooms
//     {
//       $match: {
//         "rooms.0": { $exists: true }
//       }
//     }

//   ]);

//   return hotels;
// };


const searchHotels = async (query: any, userId: any) => {

  // get the current hotel (user)
  const userHotel = await HotelModel.findById(userId).select("branches");

  const roomFilter: any = {
    status: RoomStatus.Available
  };

  // room filters
  // if (query.type) roomFilter.type = query.type;
  if (query.type) {
    roomFilter.type = {
      $regex: query.type,
      $options: "i" // case-insensitive
    };
  }

  if (query.minPrice || query.maxPrice) {
    roomFilter.price = {};

    if (query.minPrice) roomFilter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) roomFilter.price.$lte = Number(query.maxPrice);
  }

  if (query.maxGuest) {
    roomFilter.maxGuest = { $gte: Number(query.maxGuest) };
  }

  const booleanFields = [
    "parking",
    "accessibility",
    "petFriendly",
    "breakfast",
    "wifi",
    "pool"
  ];

  booleanFields.forEach((field) => {
    if (query[field] !== undefined) {
      roomFilter[field] = query[field] === "true";
    }
  });

  const hotelMatch: any = {};

  // hotel search by name
  if (query.name) {
    hotelMatch.name = {
      $regex: query.name,
      $options: "i"
    };
  }

  // 🔹 branch logic
  // if (userHotel && userHotel.branches && userHotel.branches.length > 0) {
  //   hotelMatch._id = { $in: userHotel.branches };
  // }

  const hotels = await HotelModel.aggregate([
    {
      $match: hotelMatch
    },

    {
      $lookup: {
        from: "rooms",
        let: { hotelId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$hotel", "$$hotelId"]
              }
            }
          },
          {
            $match: roomFilter
          }
        ],
        as: "rooms"
      }
    },

    // remove hotels without rooms
    {
      $match: {
        "rooms.0": { $exists: true }
      }
    },

    {
      $project: {
        password: 0,
        email: 0
      }
    }

  ]);

  return hotels;
};








  