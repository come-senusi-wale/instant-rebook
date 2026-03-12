import { Schema, model } from "mongoose";
import { IHotel } from "../interface/hotel.interface";

const HotelSchema = new Schema<IHotel>(
    { 
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        unique: true,
        required: true,
      },
      password: {
        type: String,
        required: true
      },
      branches: [
        {
          type: Schema.Types.ObjectId,
          ref: "Hotels"
        }
      ],
      phoneNumber: {
        type: String,
        required: true,
      },
      address: {
        type: String
      },
      emailOtp: {
        otp: String,
        createdTime: Date,
        verified: Boolean,
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
  
  const HotelModel = model<IHotel>("Hotels", HotelSchema);
  
  export default HotelModel;