
const Responcer = require('../module/Responcer') ;
const jwt = require('jsonwebtoken');
const accessTokenSecret = process.env.SECRET_TOKEN ;


const authenticateJWT = (req, res, next) => {
    let rpcr = new Responcer(req, res) ;

    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, accessTokenSecret, (err, token) => {
            if (err) {
                rpcr.status = 403 ;
                rpcr.message = `Vous n'êtes pas identifier`
                return rpcr.send();
            }
            
            req.body.tokenId = token.id ;
            next();
        });
    } else {
        rpcr.status = 401 ;
        rpcr.message = `Vous n'êtes pas identifier`
        return rpcr.send();
    }
};

module.exports = authenticateJWT