import { validationResult } from "express-validator";
import { Request, Response } from "express";
import HotelModel from "../../database/models/hotel.model";
import RoomModel from "../../database/models/room.model";
import CustomerModel from "../../database/models/costomer.model";


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

    const booking = await CustomerModel.create({
    hotel: room.hotel,
    room: room._id,
    name: name,
    email: email,
    phoneNumber: phoneNumber,
    checkIn: checkIn,
    checkOut: checkOut,
    guest: guest,
    price: room.price,
    taxe: taxe
  });

    return res.status(200).json({ data: booking});
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
  
}