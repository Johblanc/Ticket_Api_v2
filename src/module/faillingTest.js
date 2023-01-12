

function faillingId(id){
    return Number.isNaN(Number(id)) ||  id % 1 !== 0 || typeof id === typeof Boolean()
}


function faillingString(message = undefined){
    return message === undefined  || typeof message != typeof String()
}

function faillingBool(done = undefined){
    return done === undefined || typeof done != typeof Boolean()
}

module.exports = {
    faillingId,
    faillingString,
    faillingBool
}