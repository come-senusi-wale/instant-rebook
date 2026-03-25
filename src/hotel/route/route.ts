const express = require("express");
const router = express.Router();

import { requestValidation } from "./../middleware/request.validation.middleware";
import { singleFileUpload } from '../../admin/middleware/fileupload.middleware';
import { hotelForgotPasswordController, hotelResetPasswordController, hotelSignInController, hotelSignUpController, searchHotelPartnerController } from "../controller/auth.controller";
import { getAllRoomController, getSingleRoomController, getTotalRoomByStatusController, searchForRoomController, userAddRoomController } from "../controller/room.controller";
import { checkHotelRole } from "../middleware/role.checker.middleware";
import { createCustomerBookingController, placementRateController, totalFailBookingsController, totalGuestExpectancyController, totalGuestRebookedController } from "../controller/customer.controller";

router.post("/create-account", requestValidation.validateCreateAccountParams, requestValidation.validateFormData, hotelSignUpController ); 
router.post("/login", requestValidation.validateLoginParams, requestValidation.validateFormData, hotelSignInController );
router.post("/forgot-password", requestValidation.validateForgotPasswordParams, requestValidation.validateFormData, hotelForgotPasswordController ); 
router.post("/reset-password", requestValidation.validateResetPasswordParams, requestValidation.validateFormData, hotelResetPasswordController );

router.get("/hotel-partner-search",  searchHotelPartnerController );

router.post("/add-room", checkHotelRole, singleFileUpload('picture', ['image']), requestValidation.validateAddRoomParams, requestValidation.validateFormData, userAddRoomController );
router.get("/rooms", checkHotelRole, getAllRoomController );
router.get("/rooms-by-status", checkHotelRole, requestValidation.validateGetRoomByStatusParams, requestValidation.validateFormData, getTotalRoomByStatusController );

router.get("/search-room", checkHotelRole, searchForRoomController );
router.get("/rooms/:roomId", checkHotelRole, getSingleRoomController);

router.post("/booking", checkHotelRole, requestValidation.validateBookRoomParams, requestValidation.validateFormData, createCustomerBookingController );

router.get("/guest-rebooked", checkHotelRole, totalGuestRebookedController );
router.get("/fail-booking", checkHotelRole, totalFailBookingsController );
router.get("/guest-expectancy", checkHotelRole, totalGuestExpectancyController );
router.get("/placement-rate", checkHotelRole, placementRateController );


export default router;