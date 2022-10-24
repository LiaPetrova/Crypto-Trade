const { findByIdAndRemove } = require("../models/Crypto");
const Crypto = require("../models/Crypto");

async function getAll() {
    return Crypto.find({}).lean();
}

async function getById (id) {
    return Crypto.findById(id).lean();
}

async function createCrypto (crypto) {
    return Crypto.create(crypto);
}

async function editCrypto(id, crypto) {
    const existing = await Crypto.findById(id);

    existing.name = crypto.name;
    existing.imageUrl = crypto.imageUrl;
    existing.price = crypto.price;
    existing.description = crypto.description;
    existing.paymentMethod = crypto.paymentMethod;

    await existing.save();
}

async function deleteCrypto (id) {
    return Crypto.findByIdAndRemove(id);
}

async function buyCrypto (cryptoId, userId) {
    const crypto = await Crypto.findById(cryptoId);

    crypto.buyers.push(userId);

    await crypto.save();
}

async function searchCrypto (keyword, method) {
    
    const query = {};
    if (keyword) {
        query.name = new RegExp(keyword, 'i');
        query.paymentMethod = method;
    }
    return Crypto.find(query).lean();
}

module.exports = {
    createCrypto,
    getAll,
    getById,
    editCrypto,
    deleteCrypto,
    buyCrypto,
    searchCrypto
}