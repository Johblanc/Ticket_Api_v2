
const Responcer = require('../module/Responcer') ;
const { faillingId, faillingString, faillingBool } = require('../module/faillingTest') ; 
const client = require('../module/clientData') ;

const TicketsService = require('../service/ticketsService')

const ticketsService = new TicketsService()

class TicketsController {
    async getAll (req , res){
        let responcer = new Responcer(req, res) ;
        
        try 
        {
            const data = await ticketsService.getAll();
    
            responcer.status = 200 ;
            responcer.message = `Récupération de ${data.rowCount} tickets` ;
            responcer.data = data ;
            responcer.send() ;
        }
        catch (err) 
        {
            console.log(err.stack);
            responcer.send() ;
        }
    }

    async getById (req, res){
        let responcer = new Responcer(req, res) ;
        const id = req.params.id
        
        // Vérifiction du Type de l'id entrante
        if (faillingId(id))
        {
            responcer.status = 400 ;
            responcer.message = `${id} n'est pas un nombre entier` ;
            responcer.send() ;
        } 
    
        try 
        {
            const data = await ticketsService.getById(id);
    
            // Vérifiction de l'existence de l'id
            if (data) {
                
                responcer.status = 200 ;
                responcer.message = `Récupération du ticket ${id}` ;
                responcer.data = data ;
                responcer.send() ;
    
            } 
            else 
            {
                responcer.status = 404 ;
                responcer.message = `Le ticket ${id} n'existe pas` ;
                responcer.send() ;
            }
        }
        catch (err) 
        {
            console.log(err.stack)
            responcer.send() ;
        }
    }

    async newTicket (req, res){
        let responcer = new Responcer(req, res) ;
        const { tokenId, message} = req.body;
    
        // Vérifiction du Type du user_id entrant
        if (faillingId(tokenId) || faillingString(message))
        {
            responcer.status = 400 ;
            responcer.message = `Structure incorrect : { message : string , user_id : number }` ;
            responcer.send() ;
        } 
        
        try 
        {
            const data = await ticketsService.add(message, tokenId);
    
            responcer.status = 201 ;
            responcer.message = `Création du ticket ${data.id}` ;
            responcer.data = data ;
            responcer.send() ;
        }
        catch (err) 
        {
            console.log(err.stack)
            responcer.send() ;
        }
    }

    async changeTicket (req, res){
        let responcer = new Responcer(req, res) ;
        const { id, message, done, tokenId} = req.body;


    
        // Vérifiction de la presence des paramètres nécessaires
        if (faillingId(id) || (faillingString(message) && faillingBool(done))) 
        {
            responcer.status = 400 ;
            responcer.message = "Structure incorrect : { id : number , message : string , done : boolean } ou { id : number , message : string } ou  { id : number , done : boolean }" ;
            responcer.send() ;
        }
    
        try 
        {
            const verificator = await ticketsService.getByIdAndUserId(id, tokenId) ;
            if(!verificator)
            {
                responcer.status = 404 ;
                responcer.message = `Ce ticket ne vous appartient pas` ;
                responcer.send() ;
            };
            // Exécution de la bonne requête en fonction des paramètres
            let data ;
            if ( ! (faillingString(message) || faillingBool(done))) 
            {
                data = await ticketsService.change(id, message, done);
            } 
            else if (! faillingString(message))
            {
                data = await ticketsService.changeMessage(id, message);
            } 
            else 
            {
                data = await ticketsService.changeDone(id, done);
            }
    
            // Vérifiction de l'existence de l'id
            if (data) 
            {
                responcer.status = 200 ;
                responcer.message = `Le ticket ${id} a bien été modifier` ;
                responcer.data = data ;
                responcer.send() ;
            } 
            else 
            {
                responcer.status = 404 ;
                responcer.message = `Le ticket ${id} n'existe pas` ;
                responcer.send() ;
            }
        }
        catch (err) 
        {
            console.log(err.stack)
            responcer.send() ;
        }
    }

    async deleteTicket (req, res){
        let responcer = new Responcer(req, res) ;
        const id = req.params.id;
        const tokenId = req.body.tokenId;
    
        // Vérifiction du Type de l'id entrante
        if (faillingId(id))
        {
            responcer.status = 400 ;
            responcer.message = `${id} n'est pas un nombre entier` ;
            responcer.send() ;
        }
        try 
        {
            const verificator = await ticketsService.getByIdAndUserId(id, tokenId)
            if(!verificator)
            {
                responcer.status = 404 ;
                responcer.message = `Ce ticket ne vous appartient pas ou n'existe pas` ;
                responcer.send() ;
            };
    
            const data = await ticketsService.delete(id);
            
            responcer.status = 200 ;
            responcer.message = `Le ticket ${id} a bien été supprimé` ;
            responcer.send() ;
            
        }
        catch (err) 
        {
            console.log(err.stack);
            responcer.send() ;
        }
    }
}

module.exports = TicketsController