const UserRepository = require(`../repository/user.repository`);

class UserService {

    async findByID(UserID) {
        const data = await UserRepository.findByID(UserID);

        if (data) {
            return data;
        }

        return data;
    }

    async findByEmail(Email) {
        const data = await UserRepository.findByEmail(Email);

        if (data) {
            console.log('data service');
            console.log(data);
            return data;
        }

        return data;
    }

    async getAllUsers() {
        const data = await UserRepository.getAllUsers();

        if (data) {
            console.log('data service');
            console.log(data);
            return data;
        }

        return data;
    }

    async create(data) {
        return await UserRepository.create({
            Username: data.Username ,
            BirthDate: data.BirthDate,
            PhoneNumber: data.PhoneNumber,
            Email: data.Email,
        });
    }

    async update(UserID, data) {
        return await UserRepository.update(UserID, {
            Username: data.Username,
            BirthDate: data.BirthDate,
            PhoneNumber: data.PhoneNumber,
            Email: data.Email,
        });
    }

    async deleteByID(UserID) {
        return await UserRepository.deleteByID(UserID);
    }

}

module.exports = new UserService()