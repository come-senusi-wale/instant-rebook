import { validationResult } from "express-validator";
import { Request, Response } from "express";
import HotelModel from "../../database/models/hotel.model";
import RoomModel from "../../database/models/room.model";
import CustomerModel from "../../database/models/costomer.model";
import { CustomerStatus } from "../../database/interface/customer.interface";
import { RoomStatus } from "../../database/interface/room.interface";


export const createCustomerBookingController = async (
    req: Request,
    res: Response,
) => {
  
  try {
    const {
      name, email, phoneNumber, checkIn, checkOut, guest, taxe,
    } = req.body;

    const { roomId } = req.params;

    const room = await RoomModel.findOne({_id: roomId });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found"
      });
    }

    room.status = RoomStatus.Hold
    await room.save()

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