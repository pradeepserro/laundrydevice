const TransactionService = require(`../service/transaction.service`);

class TransactionController {

    async findByID(req, res) {
        const data = await TransactionService.findByID(req.params.TransactionID)
        res.json(data)
    }

    async addTransaction(req, res) {
        const data = await TransactionService.addTransaction(req.body)
        console.log("controller data is: ", data);
        res.json(data)
    }

    async countTransactions(req, res) {
        const data = await TransactionService.countTransactions()
        res.json(data)
    }

    async getAllTransactions(req, res) {
        const data = await TransactionService.getAllTransactions()
        res.json(data)
    }

    async getAllTransactionsByMacAddress(req, res) {
        const data = await TransactionService.getAllTransactionsByMacAddress(req.params.MacAddress)
        res.json(data)
    }



}

module.exports = new TransactionController()
