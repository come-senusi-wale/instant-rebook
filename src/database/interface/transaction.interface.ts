import { Document, Types, ObjectId } from "mongoose";
import { IHotel } from "./hotel.interface";

export enum TransactionStatus {
    Pending = 'Pending',
    Completed = 'Completed',
    Failed = 'Failed'
}


export interface ITransaction extends Document {
  _id: ObjectId;
  user:  IHotel['_id'];
  amount:  number;
  status: TransactionStatus;
  reference: string;
  createdAt: Date;
  updatedAt: Date;
}