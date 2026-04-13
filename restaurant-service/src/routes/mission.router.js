const express = require('express');
const router = express.Router();
const missionController = require('../controllers/missionController');

/**
 * @swagger
 * tags:
 *   name: Missions
 *   description: Mission management and retrieval
 */

/**
 * @swagger
 * /missions:
 *   get:
 *     summary: Get all missions
 *     tags: [Missions]
 *     responses:
 *       200:
 *         description: List of missions
 */
router.get('/', missionController.getMissions);

/**
 * @swagger
 * /missions/{id}:
 *   get:
 *     summary: Get a single mission by ID
 *     tags: [Missions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mission data
 *       404:
 *         description: Mission not found
 */
router.get('/:id', missionController.getMission);

/**
 * @swagger
 * /missions:
 *   post:
 *     summary: Create a mission
 *     tags: [Missions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *             required:
 *               - title
 *     responses:
 *       201:
 *         description: Mission created successfully
 */
router.post('/', missionController.createMission);

/**
 * @swagger
 * /missions/{id}:
 *   put:
 *     summary: Update a mission
 *     tags: [Missions]
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mission updated successfully
 */
router.put('/:id', missionController.updateMission);

/**
 * @swagger
 * /missions/{id}:
 *   delete:
 *     summary: Delete a mission
 *     tags: [Missions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mission deleted successfully
 */
router.delete('/:id', missionController.deleteMission);

module.exports = router;