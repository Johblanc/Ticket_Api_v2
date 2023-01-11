

function faillingId(id){
    return Number.isNaN(Number(id)) ||  id % 1 !== 0 || typeof id === typeof Boolean()
}


function faillingString(message){
    return message !== undefined  && typeof message != typeof String()
}

function faillingBool(done){
    return done !== undefined && typeof done != typeof Boolean()
}

module.exports = {
    faillingId,
    faillingString,
    faillingBool
}