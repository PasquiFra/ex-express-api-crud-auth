module.exports = (err, req, res, next) => {
    res.format({
        //html: () => res.status(err.status || 500).send(`<h1>${err.message}</h1>`),
        json: () => res.status(err.status || 500).json({ status: err.status || 500, error: err.message })
    });
}