import express from "express";
import { registerController, loginController, testController, forgotPasswordController, updateProfileController, getOrdersController, getAllOrdersController, orderStatusController } from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middelwares/authMiddelware.js";

//router object
const router = express.Router();

//perform a routing 
//REGISTER || this method is post 
router.post('/register', registerController)

//LOGIN || POST 
router.post('/login', loginController)

//forgote password || POST
router.post('/forgot-password', forgotPasswordController)

//test routes
router.get('/test', requireSignIn, isAdmin, testController)

//protected user route auth
router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
})

//protected route in admin
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
})
//manager 
router.get('/manager-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
})
//update profile 
router.put('/profile', requireSignIn, updateProfileController)

//order
router.get('/orders', requireSignIn, getOrdersController)

//allorder
router.get('/all-orders', requireSignIn, isAdmin, getAllOrdersController)

//order status update
router.put('/order-status/:orderId', requireSignIn, isAdmin, orderStatusController)




export default router;