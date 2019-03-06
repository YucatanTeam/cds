
module.exports = ({app, db}) => ({
    report(error, cb) {
        if(error) {
            var err = "unknown error";
            if(typeof(error) === 'object') {
                if(!error["message"]) {
                    err = JSON.stringify(error);
                } else {
                    err = error.message;
                }
            } else if(typeof(error) === 'string') {
                err = error;
            } else {
                err = "unknown error";
            }
            db.api.server.error.add(err, cb);
        } else cb && cb(null, null);
    }
})