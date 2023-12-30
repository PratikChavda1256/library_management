import express from 'express';
import { requireSignIn, isAdmin } from '../middelwares/authMiddelware.js';
import formidable from 'express-formidable';
import { brainTreePaymentController, braintreeTokenController, createProductController, deleteProduteController, getProductController, getSingleProductController, productCountController, productFilterController, productListController, productPhotoController, realtedProductController, searchProductController, updateProductController } from '../controllers/productController.js';

const router = express.Router()
//create product
router.post('/create-product', requireSignIn, isAdmin, formidable(), createProductController)

//show all product
router.get('/get-product', getProductController)

//single product
router.get('/get-product/:slug', getSingleProductController)

//get photo
router.get('/product-photo/:pid', productPhotoController)

//delete product
router.delete('/delete-produte/:pid', deleteProduteController)

//update product
router.put('/update-product/:pid', requireSignIn, isAdmin, formidable(), updateProductController)

//filter products
router.post('/product-filters', productFilterController)

//product count
router.get('/product-count', productCountController)

//product per page
router.get('/product-list/:page', productListController)

//search product
router.get("/search/:keyword", searchProductController);

//similar product
router.get('/related-product/:pid/:cid', realtedProductController);

//pyments routes
//token
router.get('/braintree/token', braintreeTokenController);

//payments 
router.post('/braintree/payment', requireSignIn, brainTreePaymentController)

export default router;