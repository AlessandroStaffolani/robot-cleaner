
exports.index = (req, res, next) => {
    res.header('Content-Type', 'application/json');
    res.status(200);
    res.json({
        title: 'Welcome to Philips Hue Lamp'
    });
};