import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Shop, { IShop } from '../models/shop.model';

// Get all shops
export const getShops = async (_req: Request, res: Response): Promise<void> => {
  try {
    const shops = await Shop.find().populate('owner', 'name');
    res.json(shops);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shops' });
  }
};

// Get shop by ID
export const getShopById = async (req: Request, res: Response): Promise<void> => {
  try {
    const shop = await Shop.findById(req.params.id)
      .populate('owner', 'name')
      .populate('products');
    
    if (!shop) {
      res.status(404).json({ message: 'Shop not found' });
      return;
    }
    res.json(shop);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shop' });
  }
};

// Create new shop
export const createShop = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, imageUrl } = req.body;
    const shop = new Shop({
      name,
      description,
      imageUrl,
      owner: req.user?.userId,
      products: [],
      rating: 0,
      reviews: []
    });

    await shop.save();
    res.status(201).json(shop);
  } catch (error) {
    res.status(500).json({ message: 'Error creating shop' });
  }
};

// Update shop
export const updateShop = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const shop = await Shop.findById(req.params.id) as IShop;
    if (!shop) {
      res.status(404).json({ message: 'Shop not found' });
      return;
    }

    if (shop.owner.toString() !== req.user?.userId) {
      res.status(403).json({ message: 'Not authorized to update this shop' });
      return;
    }

    const updatedShop = await Shop.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedShop);
  } catch (error) {
    res.status(500).json({ message: 'Error updating shop' });
  }
};

// Delete shop
export const deleteShop = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const shop = await Shop.findById(req.params.id) as IShop;
    if (!shop) {
      res.status(404).json({ message: 'Shop not found' });
      return;
    }

    if (shop.owner.toString() !== req.user?.userId) {
      res.status(403).json({ message: 'Not authorized to delete this shop' });
      return;
    }

    await shop.deleteOne();
    res.json({ message: 'Shop deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting shop' });
  }
};

// Get shop products
export const getShopProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const shop = await Shop.findById(req.params.id).populate('products');
    if (!shop) {
      res.status(404).json({ message: 'Shop not found' });
      return;
    }
    res.json(shop.products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shop products' });
  }
};
