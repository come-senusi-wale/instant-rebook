import { Schema, model } from "mongoose";
import { CustomerStatus, ICustomer } from "../interface/customer.interface";

const TestQuestionSchema = new Schema<ICustomer>(
    { 
      hotel: {
        type: Schema.Types.ObjectId, ref: 'Hotels',
        required: true,
      },
      room: {
        type: Schema.Types.ObjectId, ref: 'Rooms',
        required: true,
      },
      bookBy: {
        type: Schema.Types.ObjectId, ref: 'Hotels',
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: String,
        required: true
      },
      checkIn: {
        type: Date,
        required: true,
      },
      checkOut: {
        type: Date,
        required: true,
      },
      guest: {
        type: Number,
        required: true
      },
      price: {
        type: Number,
        required: true,
      },
      taxe: {
        type: Number,
        required: true,
      },
       status: {
        type: String,  
        enum: Object.values(CustomerStatus),  
        default: CustomerStatus.Pending
      },
      comfirmCode: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      }, 
    },
    {
      timestamps: true,
    }
  );
  
  const TestQuestionModel = model<ICustomer>("TestQuestion", TestQuestionSchema);
  
  export default TestQuestionModel;