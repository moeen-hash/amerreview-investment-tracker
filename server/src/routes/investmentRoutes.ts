import express from 'express';
import {
    getAllItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
    updateItemStatus
} from '../controllers/investmentController.js';

const router = express.Router();

// GET all items (grouped by status)
router.get('/', getAllItems);

// GET single item
router.get('/:id', getItemById);

// POST new item
router.post('/', createItem);

// PUT update item
router.put('/:id', updateItem);

// PATCH update item status
router.patch('/:id/status', updateItemStatus);

// DELETE item
router.delete('/:id', deleteItem);

export default router;
