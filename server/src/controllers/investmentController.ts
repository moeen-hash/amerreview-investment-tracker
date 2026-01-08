import { Request, Response } from 'express';
import InvestmentItem from '../models/InvestmentItem.js';

// Get all investment items
export const getAllItems = async (req: Request, res: Response) => {
    try {
        const items = await InvestmentItem.find().sort({ creationDate: -1 });
        
        // Group by status
        const groupedItems = {
            followUp: items.filter(item => item.status === 'followUp'),
            executed: items.filter(item => item.status === 'executed'),
            closed: items.filter(item => item.status === 'closed'),
            archive: items.filter(item => item.status === 'archive')
        };
        
        res.json(groupedItems);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching items', error });
    }
};

// Get single item by ID
export const getItemById = async (req: Request, res: Response) => {
    try {
        const item = await InvestmentItem.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching item', error });
    }
};

// Create new investment item
export const createItem = async (req: Request, res: Response) => {
    try {
        const newItem = new InvestmentItem({
            ...req.body,
            creationDate: new Date().toISOString(),
            status: 'followUp'
        });
        
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ message: 'Error creating item', error });
    }
};

// Update investment item
export const updateItem = async (req: Request, res: Response) => {
    try {
        const updatedItem = await InvestmentItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }
        
        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: 'Error updating item', error });
    }
};

// Delete investment item
export const deleteItem = async (req: Request, res: Response) => {
    try {
        const deletedItem = await InvestmentItem.findByIdAndDelete(req.params.id);
        
        if (!deletedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }
        
        res.json({ message: 'Item deleted successfully', id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting item', error });
    }
};

// Update item status (for drag and drop)
export const updateItemStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        
        const updatedItem = await InvestmentItem.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );
        
        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }
        
        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: 'Error updating item status', error });
    }
};
