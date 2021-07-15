class ExpressError extends Error {
    constructor(message, status) {
        super()
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError
