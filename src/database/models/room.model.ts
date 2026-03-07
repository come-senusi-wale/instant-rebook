import { Schema, model } from "mongoose";
import { IRoom, RoomStatus } from "../interface/room.interface";

const RoomSchema = new Schema<IRoom>(
    { 
      hotel: {
        type: Schema.Types.ObjectId, ref: 'Hotels',
        required: true,
      },
      type: {
        type: String,
        required: true
      },
      picture: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      parking: {
        type: Boolean
      },
      accessibility: {
        type: Boolean
      },
      petFriendly: {
        type: Boolean
      },
      breakfast: {
        type: Boolean
      },
      wifi: {
        type: Boolean
      },
      pool: {
        type: Boolean
      },
      maxGuest: {
        type: Number
      },
      status: {
        type: String,  
        enum: Object.values(RoomStatus),  
        default: RoomStatus.Available
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
  
  const RoomModel = model<IRoom>("Rooms", RoomSchema);
  
  export default RoomModel;