import express, { Router } from 'express';
import {
  getShops,
  getShopById,
  createShop,
  updateShop,
  deleteShop,
  getShopProducts
} from '../controllers/shop.controller';
import { authenticateToken, authorizeRole } from '../middleware/auth.middleware';

const router: Router = express.Router();

// Public routes
router.get('/', getShops);
router.get('/:id', getShopById);
router.get('/:id/products', getShopProducts);

// Protected routes (business owner only)
router.post(
  '/',
  authenticateToken,
  authorizeRole(['business_owner']),
  (req, res) => createShop(req, res)
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRole(['business_owner']),
  (req, res) => updateShop(req, res)
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRole(['business_owner']),
  (req, res) => deleteShop(req, res)
);

export default router;
