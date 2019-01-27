const crypto = require('crypto')
const safe = {
    api:{
        hash(pswd, cb){
            salt = crypto.randomBytes(16).toString('hex')
            middlehash = crypto.pbkdf2Sync(pswd, salt, 10000, 512, 'sha512').toString('hex')
            hash = middlehash.concat('.', salt) // hash.salt
            if(hash){
                cb(null, hash)
            } else{
                cb('!Err', null)
            }
        },
        compare(pswd, hashpswd, cb){
            salt = hashpswd.split(".")[1]
            middlehash = hashpswd.split(".")[0]
            if(crypto.pbkdf2Sync(pswd, salt, 10000, 512, 'sha512').toString('hex') === middlehash){
                cb(null, true)
            } else{
                cb('!Err', false)
            }

        }
    }
}

module.exports = safe