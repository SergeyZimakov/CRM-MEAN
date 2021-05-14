module.exports = (res, err) => {
    res.status(500).json({
        success: false,
        message: error.message ? error.message : error
    })
}