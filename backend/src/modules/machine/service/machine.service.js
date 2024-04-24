const MachineRepository = require(`../repository/machine.repository`);

class MachineService {

    async findByID(MachineID) {
        const data = await MachineRepository.findByID(MachineID);

        if (data) {
            return data;
        }

        return data;
    }

    async countMachines() {
        const data = await MachineRepository.countMachines();

        if (data) {
            return data.Count;
        }

        return data;
    }

    async getAllMachines() {
        const data = await MachineRepository.getAllMachines();

        if (data) {
            console.log('data service');
            console.log(data);
            return data;
        }

        return data;
    }

    async create(data) {
        return await MachineRepository.create({
            MachineName: data.MachineName,
            MacAddress: data.MacAddress,
            Country: data.Country,
            State: data.State,
            StreetAddress: data.StreetAddress,
            Status: data.Status,
            Model: data.Model,
        });
    }

    async update(MachineID, data) {
        return await MachineRepository.update(MachineID, {
            MachineName: data.MachineName,
            MacAddress: data.MacAddress,
            Country: data.Country,
            State: data.State,
            StreetAddress: data.StreetAddress,
            Status: data.Status,
            Model: data.Model,
        });
    }

    async deleteByID(MachineID) {
        return await MachineRepository.deleteByID(MachineID);
    }

    async countMachines() {
        // try {
        // Appelez une fonction de  pour compter les machines
        const count = await MachineRepository.countMachines();
        return count;
        // } catch (error) {
        //   throw error;
        // }
    }

}

module.exports = new MachineService()