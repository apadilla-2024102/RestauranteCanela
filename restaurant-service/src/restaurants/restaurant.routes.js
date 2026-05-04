import { Router } from 'express';
import {
  addRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
} from './restaurant.controller.js';

const router = Router();

router.post('/', addRestaurant);
router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);
router.put('/:id', updateRestaurant);
router.delete('/:id', deleteRestaurant);

export default router;