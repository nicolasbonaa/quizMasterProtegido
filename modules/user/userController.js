const userService = require('./userService');
const { generateToken } = require('../../config/jwt');
const { success } = require('../../middlewares/apiResponse');

exports.listUsers = async (req, res) => {
    const users = await userService.getAllUsers();
    return success(res, users, 'Lista de usuários cadastrados.');
};

exports.getUserById = async (req, res) => {
    const user = await userService.getUserById(req.params.id);
    return success(res, user, 'Usuário encontrado.');
};

exports.createUser = async (req, res) => {
    const { username, email, password, fullName, bio } = req.body;

    const newUser = await userService.createUser({ username, email, password, fullName, bio });

    return success(res, newUser, 'Usuário criado com sucesso.', 201);
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const user = await userService.updateUserById(id, req.body);

    return success(res, user, 'Usuário atualizado com sucesso.');
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    const deleted = await userService.deleteUserById(id);

    return success(res, deleted, 'Usuário removido com sucesso.');
};

exports.register = async (req, res) => {
    const { username, email, password, fullName } = req.body;

    const newUser = await userService.registerUser(username, email, password, fullName);

    return success(res, newUser, 'Conta criada com sucesso! Faça login para continuar.', 201);
}

exports.login = async (req, res) => {
    const { login, password } = req.body;

    const user = await userService.loginUser(login, password);
    const userData = await userService.getUserProfile(user.id);

    const token = generateToken({
        id: userData.id,
        username: userData.username,
        isAdmin: userData.isAdmin
    });

    return success(res, { token, user: userData }, `Bem-vindo de volta, ${userData.username}!`);
};

exports.logout = (req, res) => {
    return success(res, null, 'Logout realizado com sucesso.');
};

exports.getMyProfile = async (req, res) => {
    const userData = await userService.getUserProfile(req.user.id);
    return success(res, userData);
};

exports.getPublicProfile = async (req, res) => {
    const user = await userService.getPublicProfile(req.params.username);

    return success(res, user);
}

exports.updateProfile = async (req, res) => {
    const { fullName, bio } = req.body;
    const userId = req.user.id;
    const newProfilePictureFilename = req.file ? req.file.filename : null;

    const updatedUser = await userService.updateUserProfile(userId, fullName, bio, newProfilePictureFilename);

    return success(res, updatedUser, 'Perfil atualizado com sucesso!');
};