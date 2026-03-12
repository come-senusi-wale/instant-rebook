import { Document, Types, ObjectId } from "mongoose";
import { IHotel } from "./hotel.interface";
import { IRoom } from "./room.interface";

export enum CustomerStatus {
    Booked = 'Booked',
    Pending = 'Pending',
    Canceled = 'Canceled',
}

export interface ICustomer extends Document {
  _id: ObjectId;
  hotel: IHotel['_id'];
  room: IRoom['_id'];
  bookBy: IHotel['_id'];
  name: string;
  email: string;
  phoneNumber: string;
  checkIn: Date;
  checkOut: Date;
  guest: number;
  price: number;
  taxe: number;
  status: CustomerStatus;
  createdAt: Date;
  updatedAt: Date;
}