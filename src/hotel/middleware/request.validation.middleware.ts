import { body, query, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { RoomStatus } from "../../database/interface/room.interface";

export const validateFormData = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};

export const validateCreateAccountParams = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone("any")
    .withMessage("Invalid phone number"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];

export const validateLoginParams = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
];

   
export const validateAddRoomParams = [
  body("type")
    .notEmpty()
    .withMessage("Please provide a valid type"),

  body("price")
    .notEmpty()
    .withMessage("price is required")
    .isNumeric()
    .withMessage("price must be Number"),

  body("maxGuest")
    .notEmpty()
    .withMessage("maxGuest is required")
    .isNumeric()
    .withMessage("maxGuest must be Number"),
    

  body("parking")
    .notEmpty()
    .withMessage("parking is required")
    .isBoolean()
    .withMessage("price must be Boolen"),

  body("accessibility")
    .notEmpty()
    .withMessage("accessibility is required")
    .isBoolean()
    .withMessage("accessibility must be Boolen"),

  body("petFriendly")
    .notEmpty()
    .withMessage("petFriendly is required")
    .isBoolean()
    .withMessage("petFriendly must be Boolen"),

  body("breakfast")
    .notEmpty()
    .withMessage("breakfast is required")
    .isBoolean()
    .withMessage("breakfast must be Boolen"),

  body("wifi")
    .notEmpty()
    .withMessage("wifi is required")
    .isBoolean()
    .withMessage("wifi must be Boolen"),
    
  body("pool")
    .notEmpty()
    .withMessage("pool is required")
    .isBoolean()
    .withMessage("pool must be Boolen")
];


export const validateGetRoomByStatusParams = [
  body("status")
    .notEmpty()
    .withMessage("status is required")
    .isIn(Object.values(RoomStatus))
    .withMessage("Invalid room status"),
];



export const requestValidation = {
  validateFormData,
  validateCreateAccountParams,
  validateLoginParams,
  validateAddRoomParams,
  validateGetRoomByStatusParams

}