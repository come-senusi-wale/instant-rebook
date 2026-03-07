import { Document, Types, ObjectId } from "mongoose";
import { IHotel } from "./hotel.interface";

export enum RoomStatus {
    Booked = 'Booked',
    Available = 'Available',
    Hold = "Hold",
    Removed = "Removed"
}


export interface IRoom extends Document {
  _id: ObjectId;
  hotel:  IHotel['_id'];
  type:  string;
  picture: string;
  price: number;
  parking: boolean;
  accessibility: boolean;
  petFriendly: boolean;
  breakfast: boolean;
  wifi: boolean;
  pool: boolean;
  maxGuest: number;
  status: RoomStatus;
  createdAt: Date;
  updatedAt: Date;
}