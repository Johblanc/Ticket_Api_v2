

/**
 * @status      => 500
 * @message     => "Erreur serveur"
 * @data        => undefined
 */
class Responcer {
    constructor(conf = {}) {
        this.status = conf.status       ||  500
        this.message = conf.message     ||  "Erreur serveur"
        this.data = conf.status         ||  undefined
    }

    statusStr(){
        return (200 <= this.status && this.status <300) ? "SUCCESS" : "FAIL"
    }

    send(response){
        return response.status(this.status).json({
            status: this.statusStr(),
            message: this.message,
            data: this.data
        })
    }

    info(){
        return `${this.status} | ${this.statusStr()}\n${this.message}`
    }
}

module.exports = Responcer