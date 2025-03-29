import mongoose from 'mongoose';
import { Item } from '../models/Item';
import { MONGODB_URI } from '@env';

// Connect to MongoDB
export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Create a new item
export const createItem = async (itemData) => {
  try {
    const item = new Item(itemData);
    await item.save();
    return item;
  } catch (error) {
    console.error('Error creating item:', error);
    throw error;
  }
};

// Get all items
export const getAllItems = async () => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    return items;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

// Get a single item by ID
export const getItemById = async (id) => {
  try {
    const item = await Item.findById(id);
    if (!item) {
      throw new Error('Item not found');
    }
    return item;
  } catch (error) {
    console.error('Error fetching item:', error);
    throw error;
  }
};

// Update an item
export const updateItem = async (id, updateData) => {
  try {
    const item = await Item.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!item) {
      throw new Error('Item not found');
    }
    return item;
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;
  }
};

// Delete an item
export const deleteItem = async (id) => {
  try {
    const item = await Item.findByIdAndDelete(id);
    if (!item) {
      throw new Error('Item not found');
    }
    return item;
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};

// Search items by title or description
export const searchItems = async (query) => {
  try {
    const items = await Item.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });
    return items;
  } catch (error) {
    console.error('Error searching items:', error);
    throw error;
  }
}; 