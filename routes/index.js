function constructRoutes(app){
    app.use('*', (req, res) => {
        res.render('main', {layout:false});
    });
}


module.exports = constructRoutes;