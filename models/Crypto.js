const { model, Schema, Types } = require('mongoose');

const URL_PATTERN = /https?:\/\/./i;

const cryptoSchema = new Schema ({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, validate: {
        validator: (value) => (URL_PATTERN.test(value)),
        message: 'Invalid URL'
    }},
    description: { type: String, required: true },
    paymentMethod: { type: String, enum: ['crypto-wallet', 'credit-card', 'debit-card', 'paypal'], required: true },
    buyers: { type: [Types.ObjectId], ref: 'User', default: [] },
    owner: { type: Types.ObjectId, ref: 'User', required: true }
});

const Crypto = model('Crypto', cryptoSchema);

module.exports = Crypto;
