const MachineService = require(`../service/machine.service`);

class MachineController {

    async findByID(req, res) {
        const data = await MachineService.findByID(req.params.MachineID)

        res.json(data)
    }

    async countMachines(req, res) {
        const data = await MachineService.countMachines()

        res.json(data)
    }

    async getAllMachines(req, res) {
        const data = await MachineService.getAllMachines()
        console.log('data controller');
        console.log(data);

        res.json(data)
    }

    async create(req, res) {
        const data = await MachineService.create(req.body)

        res.json(data)
    }

    async update(req, res) {
        const data = await MachineService.update(req.params.MachineID, req.body)

        res.json(data)
    }

    async deleteByID(req, res) {
        await MachineService.deleteByID(req.params.MachineID)

        res.json(`Success`)
    }

    async countMachines(req, res) {
        // try {
        const count = await MachineService.countMachines();
        console.log('Nombre de machines récupéré :', count); // Ajoutez ce journal de débogage

        res.json({ count });
        // } catch (error) {
        //     console.error(error);
        //     res.status(500).json({ error: 'Une erreur s\'est produite lors de la récupération du nombre de machines.' });
        // }
    }



}

module.exports = new MachineController()