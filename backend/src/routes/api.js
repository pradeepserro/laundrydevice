const MachineController = require('../modules/machine/controller/machine.controller');
const UserController = require('../modules/user/controller/user.controller');
const TransactionController = require('../modules/transaction/controller/transaction.controller');

module.exports = async (app) => {
    app.get(`/api/v1/machines/:MachineID`, MachineController.findByID);
    app.post(`/api/v1/machines`, MachineController.create);
    app.patch(`/api/v1/machines/:MachineID`, MachineController.update);
    app.delete(`/api/v1/machines/:MachineID`, MachineController.deleteByID);
    app.get(`/api/v1/machines`, MachineController.getAllMachines);
    app.get(`/api/v1/machinescount`, MachineController.countMachines);

    app.get(`/api/v1/users/:Email`, UserController.findByEmail);
    app.post(`/api/v1/users`, UserController.create);
    app.patch(`/api/v1/users/:UserID`, UserController.update);
    app.delete(`/api/v1/users/:UserID`, UserController.deleteByID);
    app.get(`/api/v1/users`, UserController.getAllUsers);

    app.get(`/api/v1/transactions`, TransactionController.getAllTransactions);
    app.post('/api/v1/transactions', TransactionController.addTransaction)
    app.get(`/api/v1/transactions/:MacAddress`, TransactionController.getAllTransactionsByMacAddress); 
    app.get(`/api/v1/transactionscount`, TransactionController.countTransactions);




};