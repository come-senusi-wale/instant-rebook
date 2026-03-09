const express = require("express");
const router = express.Router();

import { requestValidation } from "./../middleware/request.validation.middleware";
import { singleFileUpload } from '../../admin/middleware/fileupload.middleware';
import { hotelSignInController, hotelSignUpController } from "../controller/auth.controller";
import { getAllRoomController, getSingleRoomController, getTotalRoomByStatusController, searchForRoomController, userAddRoomController } from "../controller/room.controller";
import { checkHotelRole } from "../middleware/role.checker.middleware";
import { createCustomerBookingController } from "../controller/customer.controller";

router.post("/create-account", requestValidation.validateCreateAccountParams, requestValidation.validateFormData, hotelSignUpController ); 
router.post("/login", requestValidation.validateLoginParams, requestValidation.validateFormData, hotelSignInController );

router.post("/add-room", checkHotelRole, singleFileUpload('picture', ['image']), requestValidation.validateAddRoomParams, requestValidation.validateFormData, userAddRoomController );
router.get("/rooms", checkHotelRole, getAllRoomController );
router.get("/rooms-by-status", checkHotelRole, requestValidation.validateGetRoomByStatusParams, requestValidation.validateFormData, getTotalRoomByStatusController );

router.get("/search-room", searchForRoomController );
router.get("/rooms/:roomId", getSingleRoomController);

router.post("/booking", checkHotelRole, requestValidation.validateGetRoomByStatusParams, requestValidation.validateFormData, createCustomerBookingController );

// router.post("/request-test-question", requestValidation.validateCreateAccountParams, requestValidation.validateFormData, userRequestForTestQuestionController ); 
// router.get("/test-link", requestValidation.validateCheckWalletParams, requestValidation.validateFormData, userGetTestLinkController );
// router.get("/check-test-link", requestValidation.validateCheckWalletParams, requestValidation.validateFormData, checkIfUserHasTestLinkController );

// router.post("/init-payment", requestValidation.validateInitPaymentParams, requestValidation.validateFormData, userInitNairaPaymentController );
// router.post("/verify-payment", requestValidation.validateVerifyPaymentParams, requestValidation.validateFormData, userVerifyNairaPaymentController );
// router.post("/change-payment-status", requestValidation.validateCreateAccountParams, requestValidation.validateFormData, userChangePaymentStatusController );

// router.post("/upload-image",  singleFileUpload('media', ['image', 'video'], true), uploadImageToIPFS );

export default router;