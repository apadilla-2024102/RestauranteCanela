const missionService = require('../services/missionService');

class MissionController {
    async getMissions(req, res) {
        try {
            const missions = await missionService.getAllMissions();
            res.json({ success: true, message: 'Missions retrieved successfully', data: missions });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getMission(req, res) {
        try {
            const { id } = req.params;
            const mission = await missionService.getMissionById(id);
            res.json({ success: true, message: 'Mission retrieved successfully', data: mission });
        } catch (error) {
            res.status(404).json({ success: false, message: error.message });
        }
    }

    async createMission(req, res) {
        try {
            const mission = await missionService.createMission(req.body);
            res.status(201).json({ success: true, message: 'Mission created successfully', data: mission });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async updateMission(req, res) {
        try {
            const { id } = req.params;
            const mission = await missionService.updateMission(id, req.body);
            res.json({ success: true, message: 'Mission updated successfully', data: mission });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async deleteMission(req, res) {
        try {
            const { id } = req.params;
            const result = await missionService.deleteMission(id);
            res.json({ success: true, message: result.message });
        } catch (error) {
            res.status(404).json({ success: false, message: error.message });
        }
    }
}

module.exports = new MissionController();