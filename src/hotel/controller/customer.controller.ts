import { validationResult } from "express-validator";
import { Request, Response } from "express";
import HotelModel from "../../database/models/hotel.model";
import RoomModel from "../../database/models/room.model";
import CustomerModel from "../../database/models/costomer.model";
import { CustomerStatus } from "../../database/interface/customer.interface";
import { RoomStatus } from "../../database/interface/room.interface";
import { generateCode } from "../../utils/otpGenerator";


export const createCustomerBookingController = async (
    req: Request,
    res: Response,
) => {
  
  try {
    const {
      name, email, phoneNumber, checkIn, checkOut, guest, taxe, roomId,
    } = req.body;

    // const { roomId } = req.params;

    const room = await RoomModel.findOne({_id: roomId });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found"
      });
    }

    if (room.status != RoomStatus.Available ) {
       return res
      .status(401)
      .json({ message: "room not availble for booking" });
    }

    room.status = RoomStatus.Hold
    await room.save()

    let comfirmCode = generateCode()

    const booking = await CustomerModel.create({
    hotel: room.hotel,
    room: room._id,
    bookBy: req.hotel?._id,
    name: name,
    email: email,
    phoneNumber: phoneNumber,
    checkIn: checkIn,
    checkOut: checkOut,
    guest: guest,
    price: room.price,
    taxe: taxe,
    comfirmCode: comfirmCode
  });

    return res.status(200).json({ data: booking});
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
  
}


export const totalGuestRebookedController = async (req: Request, res: Response,) => {
  try {
    const loginHotelId = req.hotel?._id;

    const totalBookings = await CustomerModel.countDocuments({
      hotel: loginHotelId,
      status: CustomerStatus.Booked
    });

    res.json({
      success: true,
      totalBookings
    });

  } catch (err: any) {
     res.status(500).json({ message: err.message });
  }
};


export const totalFailBookingsController = async (req: Request, res: Response,) => {
  try {
    const loginHotelId = req.hotel?._id;

    const totalFailBookings = await CustomerModel.countDocuments({
      hotel: loginHotelId,
      status: CustomerStatus.Canceled
    });

    res.json({
      success: true,
      total: totalFailBookings
    });

  } catch (err: any) {
     res.status(500).json({ message: err.message });
  }
};

export const totalGuestExpectancyController = async (req: Request, res: Response,) => {
  try {
    const loginHotelId = req.hotel?._id;

    const totalExpectancy = await CustomerModel.countDocuments({
      hotel: loginHotelId,
      status: CustomerStatus.Pending
    });

    res.json({
      success: true,
      total: totalExpectancy
    });

  } catch (err: any) {
     res.status(500).json({ message: err.message });
  }
};

export const placementRateController = async (req: Request, res: Response,) => {
  try {
    const loginHotelId = req.hotel?._id;

    const total = await CustomerModel.countDocuments({
      hotel: loginHotelId
    });

    const success = await CustomerModel.countDocuments({
      hotel: loginHotelId,
      status: CustomerStatus.Booked
    });

    const percentage = total === 0 ? 0 : ((success / total) * 100).toFixed(2);

    res.json({
      success: true,
      totalBookings: total,
      successfulBookings: success,
      successRate: `${percentage}%`
    });

  } catch (err: any) {
     res.status(500).json({ message: err.message });
  }
};

export const expectedArrivalController = async (req: Request, res: Response,) => {
  try {
    const loginHotelId = req.hotel?._id;

    const total = await CustomerModel.countDocuments({
      hotel: loginHotelId,
      status: CustomerStatus.Pending
    });

    const expectedArrivals = await CustomerModel.find({
      hotel: loginHotelId,
      status: CustomerStatus.Pending
    });


    res.json({
      success: true,
      total: total,
      expectedArrivals
    });

  } catch (err: any) {
     res.status(500).json({ message: err.message });
  }
};


export const customersController = async (req: Request, res: Response,) => {
  try {
    const loginHotelId = req.hotel?._id;
    const search = req.query.search 
    const status = req.query.status 
    const page = parseInt(req.query.page as string, 10) || 1
    const limit = parseInt(req.query.limit as string, 10) || 50
    const skip = (page - 1) * limit;

    const query: any = {hotel: loginHotelId};

    // 🔍 Search by name OR email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    // 🎯 Filter by status
    if (status) {
      query.status = status;
    }

    const [customers, total] = await Promise.all([
      CustomerModel.find(query)
        .sort({ createdAt: -1 }) // latest first
        .skip(skip)
        .limit(limit)
        .populate({
          path: "hotel",
          select: "name address",
        })
        .populate({
          path: "bookBy",
          select: "name address",
        })
        .populate({
          path: "room",
        }),


      CustomerModel.countDocuments(query)
    ]);
    

    // const total = await CustomerModel.countDocuments({
    //   hotel: loginHotelId,
    //   status: CustomerStatus.Pending
    // });

    // const expectedArrivals = await CustomerModel.find({
    //   hotel: loginHotelId,
    //   status: CustomerStatus.Pending
    // });


    res.json({
      success: true,
      total: total,
      totalPages: Math.ceil(total / limit),
      customers
    });

  } catch (err: any) {
     res.status(500).json({ message: err.message });
  }
};


export const comfirmArrivalController = async (req: Request, res: Response,) => {
  try {
     const { customerId } = req.body;
    const loginHotelId = req.hotel?._id;

    const expectedArrival = await CustomerModel.findOne({
      _id: customerId,
      hotel: loginHotelId,
      status: CustomerStatus.Pending
    });

    if (!expectedArrival) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    await RoomModel.findOneAndUpdate(
      {_id: expectedArrival.room},
      {status: RoomStatus.Booked}
    )

    expectedArrival.status = CustomerStatus.Booked
    await expectedArrival.save()


    res.json({
      success: true,
      message: "arrival comfirm successfully"
    });

  } catch (err: any) {
     res.status(500).json({ message: err.message });
  }
};


export const noShowController = async (req: Request, res: Response,) => {
  try {
     const { customerId } = req.body;
    const loginHotelId = req.hotel?._id;

    const expectedArrival = await CustomerModel.findOne({
      _id: customerId,
      hotel: loginHotelId,
      status: CustomerStatus.Pending
    });

    if (!expectedArrival) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    await RoomModel.findOneAndUpdate(
      {_id: expectedArrival.room},
      {status: RoomStatus.Available}
    )

    expectedArrival.status = CustomerStatus.Canceled
    await expectedArrival.save()


    res.json({
      success: true,
      message: "Booking canceled successfully"
    });

  } catch (err: any) {
     res.status(500).json({ message: err.message });
  }
};