module.exports = (req, res) => {
    res.status(404);
    res.render('404', {
        title: 'Page not found'
    })
};