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
      message: "arrival comfirm successfully"
    });

  } catch (err: any) {
     res.status(500).json({ message: err.message });
  }
};