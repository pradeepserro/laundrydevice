const transactionRepository = require("../repository/transaction.repository");
const TransactionRepository = require(`../repository/transaction.repository`);

class TransactionService {

    async findByID(TransactionID) {
        const data = await TransactionRepository.findByID(TransactionID);

        if (data) {
            return data;
        }

        return data;
    }

    async addTransaction(data) {
        console.log("service data is: ", data);
        return await TransactionRepository.addTransaction({
            time: data.time,
            Date: data.Date,
            MacAddress: data.MacAddress,
            Origin: data.Origin,
            CoinAcceptor: data.CoinAcceptor,
            HighVoltage: data.HighVoltage,
            LowVoltage: data.LowVoltage,
        });
    }

    async countTransactions() {
        const data = await transactionRepository.countTransactions();

        if (data) {
            return data.Count;
        }

        return data;
    }

    async getAllTransactions(MacAddress) {
        const data = await TransactionRepository.getAllTransactions();

        if (data) {
            return data;
        }

        return data;
    }

    async getAllTransactionsByMacAddress(MacAddress) {
        const data = await TransactionRepository.getAllTransactionsByMacAddress(MacAddress);

        if (data) {
            return data;
        }

        return data;
    }





}

module.exports = new TransactionService()
