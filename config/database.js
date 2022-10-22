const mongoose = require('mongoose');

//TODO
const CONNECTION_STRING = 'mongodb://127.0.0.1:27017/cryptoTrade';

module.exports = async (app) => {
    try {
        await mongoose.connect(CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Database connected');
    
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}