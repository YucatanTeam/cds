

module.exports = validate = {
    password(target) {
        // TODO
        return true;
    },
    firstname(target) {
        // TODO
        return true;
    },
    lastname(target) {
        return validate.firstname(target);
    },
    email(target) {
        // TODO
        return true;
    },
    avatar(target) {
        // TODO
        // avatar must be jpeg or png
        // check target.type ( maybe dont trust it )
        return true;
    }
}