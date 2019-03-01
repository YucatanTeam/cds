var request = require('request');

module.export = function bot(Photo,Caption){
    request({
        method:"POST",
        url:'https://api.telegram.org/bot740062919:AAFzZCd9oqNpwVr9X9jF1j8XTECYiEwF5Ck/sendPhoto',
        formData:{
            photo:`${Photo}`,
            caption:`${Caption}`
        }
    },function(err,res,body){
        if(err) throw err
    })
}