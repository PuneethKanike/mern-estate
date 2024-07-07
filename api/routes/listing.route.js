import express from 'express';
import { createListing, deleteListing, updateListing, getListing, getListings, deleteListingById, getAllListings } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.post('/update/:id', verifyToken, updateListing);
router.get('/get/:id', getListing);
router.get('/get', getListings);


//admin

router.get('/admin/all', getAllListings);
router.delete('/admin/delete/:id', deleteListingById);

export default router;