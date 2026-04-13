const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

/**
 * @swagger
 * tags:
 *   name: Restaurant
 *   description: Restaurant administration endpoints
 */

/**
 * @swagger
 * /restaurant/{id}:
 *   get:
 *     summary: Get details of a restaurant
 *     tags: [Restaurant]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Restaurant details
 *       404:
 *         description: Restaurant not found
 */
router.get('/:id', restaurantController.getRestaurant);

/**
 * @swagger
 * /restaurant/{id}:
 *   put:
 *     summary: Update restaurant information
 *     tags: [Restaurant]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               address:
 *                 type: string
 *               openingHours:
 *                 type: object
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *               isVisible:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Restaurant updated successfully
 */
router.put('/:id', restaurantController.updateRestaurant);

/**
 * @swagger
 * /restaurant:
 *   post:
 *     summary: Create a restaurant
 *     tags: [Restaurant]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               openingHours:
 *                 type: object
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *               isVisible:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Restaurant created successfully
 */
router.post('/', restaurantController.createRestaurant);

/**
 * @swagger
 * /restaurant/{id}:
 *   delete:
 *     summary: Delete a restaurant
 *     tags: [Restaurant]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Restaurant deleted successfully
 */
router.delete('/:id', restaurantController.deleteRestaurant);

module.exports = router;