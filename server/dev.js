
module.exports = ({app, db}) => ({
    report(error, cb) {
        db.api.server.error.add(error.message, cb);
    }
})