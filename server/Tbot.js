var request = require('request');
const TBOTURL = process.env.TBOTURL || 'https://api.telegram.org/bot740062919:AAFzZCd9oqNpwVr9X9jF1j8XTECYiEwF5Ck/sendPhoto';
module.exports = function bot(Photo,Caption, cb){
    request({
        method:"POST",
        url: TBOTURL,
        formData:{
            photo:`${Photo}`,
            caption:`${Caption}`
        }
    },cb) // cb(err, res, body)
}