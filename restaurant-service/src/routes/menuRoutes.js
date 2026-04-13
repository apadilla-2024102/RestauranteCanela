const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

router.get('/restaurant/:restaurantId', menuController.getMenuItems);
router.get('/:id', menuController.getMenuItem);
router.post('/', menuController.createMenuItem);
router.put('/:id', menuController.updateMenuItem);
router.delete('/:id', menuController.deleteMenuItem);

module.exports = router;