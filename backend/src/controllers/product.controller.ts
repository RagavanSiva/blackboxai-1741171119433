import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Product, { IProduct } from '../models/product.model';
import Shop, { IShop } from '../models/shop.model';
import  { Types } from 'mongoose';

// Get all products
export const getProducts = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const products = await Product.find().populate('shop', 'name');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};

// Get product by ID
export const getProductById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id).populate('shop', 'name');
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product' });
  }
};

// Create new product
export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, price, shopId, imageUrl, category, stock } = req.body;

    // Check if shop exists and user owns it
    const shop = await Shop.findById(shopId) as IShop;
    if (!shop) {
      res.status(404).json({ message: 'Shop not found' });
      return;
    }

    if (shop.owner.toString() !== req.user?.userId) {
      res.status(403).json({ message: 'Not authorized to add products to this shop' });
      return;
    }

    const product = new Product({
      name,
      description,
      price,
      shop: shopId,
      imageUrl,
      category,
      stock
    });

    await product.save();

    // Add product to shop's products array
    shop.products.push(product._id);
    await shop.save();

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product' });
  }
};

// Update product
export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id) as IProduct;
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    // Check if user owns the shop that has this product
    const shop = await Shop.findById(product.shop) as IShop;
    if (!shop) {
      res.status(404).json({ message: 'Shop not found' });
      return;
    }

    if (shop.owner.toString() !== req.user?.userId) {
      res.status(403).json({ message: 'Not authorized to update this product' });
      return;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product' });
  }
};

// Delete product
export const deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id) as IProduct & { _id: Types.ObjectId };
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    // Check if user owns the shop that has this product
    const shop = await Shop.findById(product.shop) as IShop;
    if (!shop) {
      res.status(404).json({ message: 'Shop not found' });
      return;
    }

    if (shop.owner.toString() !== req.user?.userId) {
      res.status(403).json({ message: 'Not authorized to delete this product' });
      return;
    }

    // Convert `shop.products` to a plain array before filtering
    shop.products = shop.products.toObject().filter((productId: Types.ObjectId) => 
      productId.toString() !== product._id.toString()
    );

    await shop.save();
    await product.deleteOne();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
};



