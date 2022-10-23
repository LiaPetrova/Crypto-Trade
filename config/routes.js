const authController = require("../controllers/authController");
const cryptoController = require("../controllers/cryptoController");
const defaultController = require("../controllers/defaultController");
const homeController = require("../controllers/homeController")

module.exports = (app) => {
    app.use('/', homeController);
    app.use('/auth', authController);
    app.use('/crypto', cryptoController);
    app.all('*', defaultController);
};