const { Mission } = require('../models');

class MissionService {
    async getAllMissions() {
        return await Mission.findAll();
    }

    async getMissionById(id) {
        const mission = await Mission.findByPk(id);
        if (!mission) {
            throw new Error('Mission not found');
        }
        return mission;
    }

    async createMission(data) {
        return await Mission.create(data);
    }

    async updateMission(id, data) {
        const mission = await this.getMissionById(id);
        await mission.update(data);
        return mission;
    }

    async deleteMission(id) {
        const mission = await this.getMissionById(id);
        await mission.destroy();
        return { message: 'Mission deleted successfully' };
    }
}

module.exports = new MissionService();