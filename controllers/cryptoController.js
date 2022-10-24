const cryptoController = require('express').Router();

const { body, validationResult } = require('express-validator');
const { hasUser } = require('../middlewares/guards');
const { createCrypto, getAll, getById, editCrypto, deleteCrypto, buyCrypto, searchCrypto } = require('../services/cryptoService');
const errorParser = require('../util/errorParser');

cryptoController.get('/', async (req, res) => {
    const cryptos = await getAll();

    res.render('catalog', {
        title: 'Cryptos Catalog',
        cryptos
    });
});

cryptoController.get('/create', hasUser(), (req, res) => {
    res.render('create', {
        title: 'Create Crypto'
    });
});

cryptoController.post('/create', hasUser(),
body('name')
.isLength({ min: 2}).withMessage('Crypto name must be at least 2 characters long'),
body('price').isNumeric({ min: 1}).withMessage('Price must be a positive number'),
body('description').isLength({ min: 10 }).withMessage('Description must be at least 10 characters long'),
async (req, res) => {
    
    const crypto = {
        name: req.body.name,
        imageUrl: req.body.imageUrl,
        description: req.body.description,
        price: Number(req.body.price),
        paymentMethod: req.body.paymentMethod,
        owner: req.user._id
    }
    
    const { errors } = validationResult(req);
    
    try {
        
    if(errors.length > 0) {
        throw errors;
    }

    await createCrypto(crypto);
    res.redirect('/crypto');

    } catch (error) {
        const body = {
            name: req.body.name,
            imageUrl: req.body.imageUrl,
            price: req.body.price,
            description: req.body.description,
            paymentMethod: req.body.paymentMethod,
        };

        res.render('create', {
            title: 'Create Crypto',
            errors: errorParser(error),
            body
        });
    }
});

cryptoController.get('/:id/details', async (req, res) => {
    const id = req.params.id;
    const crypto = await getById(id);
    crypto.isOwner = crypto.owner.toString() == req.user?._id.toString();
    crypto.hasBuyed = crypto.buyers.some(b => b.toString().includes(req.user?._id.toString()));

    res.render('details', {
        title: 'Details page',
        crypto
    });
});

cryptoController.get('/:id/edit', hasUser(), async (req, res) => {

    const id = req.params.id;
    const crypto = await getById(id);
    if (crypto.owner.toString() != req.user._id.toString()) {
        return res.redirect('/auth/login');
    }

    res.render('edit', {
        title: 'Edit crypto',
        crypto
    });
});

cryptoController.post('/:id/edit', hasUser(),
body('name')
.isLength({ min: 2}).withMessage('Crypto name must be at least 2 characters long'),
body('price').isInt({ min: 1 }).withMessage('Price must be a positive number'),
body('description').isLength({ min: 10 }).withMessage('Description must be at least 10 characters long'),
async (req, res) => {

    let crypto = await getById(req.params.id);
    if (crypto.owner.toString() != req.user._id.toString()) {
        return res.redirect('/auth/login');
    }

        crypto.name =  req.body.name;
        crypto.imageUrl =  req.body.imageUrl;
        crypto.description =  req.body.description;
        crypto.price =  Number(req.body.price);
        crypto.paymentMethod =  req.body.paymentMethod;

    const { errors } = validationResult(req);
    try {
        
    if(errors.length > 0) {
        throw errors;
    }

    await editCrypto(req.params.id, crypto);
    res.redirect(`/crypto/${req.params.id}/details`);

    } catch (error) {
    
        res.render('edit', {
            title: 'Edit Crypto',
            errors: errorParser(error),
            crypto
        });
    }
});

cryptoController.get('/:id/delete', hasUser(), async (req, res) => {
    const crypto = await getById(req.params.id);
    if (crypto.owner.toString() != req.user._id.toString()) {
        return res.redirect('/auth/login');
    }
    await deleteCrypto(req.params.id);
    res.redirect('/crypto');
});

cryptoController.get('/:id/buy', hasUser(), async (req, res) => {
    const crypto = await getById(req.params.id);

    try {
        if (crypto.owner.toString() == req.user._id.toString()) {
            crypto.isOwner = true;
            throw new Error('You cannot buy your own crypto currency')
        }

        if(crypto.buyers.some(b => b.toString().includes(req.user._id.toString()))) {
            crypto.hasBuyed = true;
            throw new Error('You cannot buy from the same currency twice')
        }

        await buyCrypto(req.params.id, req.user._id);
        res.redirect(`/crypto/${req.params.id}/details`);

    } catch (error) {
        
        res.render('details', {
            title: 'Details Page',
            errors: errorParser(error),
            crypto
        });
    }
});

cryptoController.get('/search', async (req, res) => {

    const keyword = req.query.search;
    const paymentMethod = req.query.paymentMethod;

    const results = await searchCrypto(keyword, paymentMethod);
    results.keyword = keyword;
    results.paymentMethod = paymentMethod;
    res.render('search', {
        title: 'Search cryptos',
        results,

    });

    console.log(paymentMethod);


});




module.exports = cryptoController;