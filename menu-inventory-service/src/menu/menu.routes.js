import { Router } from 'express';
import upload from './fileUpload.js';
import { getMenuItems, createMenuItem, getMenuItemById, updateMenuItem, deleteMenuItem, uploadMenuImage } from './menu.controller.js';

const router = Router();

router.get('/', getMenuItems);
router.post('/upload', upload.single('image'), uploadMenuImage);
router.post('/', createMenuItem);
router.get('/:id', getMenuItemById);
router.put('/:id', updateMenuItem);
router.delete('/:id', deleteMenuItem);

export default router;
