

/**
 * @status      => 500
 * @message     => "Erreur serveur"
 * @data        => undefined
 */
class Responcer {
    constructor(req ,res, conf = {}) {
        this.req = req ;
        this.res = res ;
        this.status = conf.status       ||  500 ;
        this.message = conf.message     ||  "Erreur serveur" ;
        this.data = conf.status         ||  undefined ;
        this.isSend = false
    }

    statusStr(){
        return (200 <= this.status && this.status <300) ? "SUCCESS" : "FAIL"
    }

    info(){
        return `${this.req.method} | ${this.req.originalUrl} | ${this.status} | ${this.statusStr()}\n${this.message}`
    }

    send()
    {
        if (! this.isSend)
        {
            this.isSend = true ;

            console.log(this.info()) ;

            this.res
                .status(this.status)
                .json({
                    status: this.statusStr(),
                    message: this.message,
                    data: this.data
                }) ;
        }
    }

}

module.exports = Responcer