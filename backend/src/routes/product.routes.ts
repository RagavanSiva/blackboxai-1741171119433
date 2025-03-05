import express, { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller';
import { authenticateToken, authorizeRole } from '../middleware/auth.middleware';

const router: Router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected routes (business owner only)
router.use(authenticateToken);
router.use(authorizeRole(['business_owner']));

router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
