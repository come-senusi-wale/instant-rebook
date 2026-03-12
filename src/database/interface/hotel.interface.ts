import { Document, Types, ObjectId } from "mongoose";

export interface IHotel extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  branches: Types.ObjectId[];
  phoneNumber: string;
  address?: string;
  emailOtp: {
    otp: string;
    createdTime: Date;
    verified: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}