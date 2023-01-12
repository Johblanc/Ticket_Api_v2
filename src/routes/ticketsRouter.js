const express = require('express') ;
const Responcer = require('../module/Responcer') ;
const { faillingId, faillingString, faillingBool } = require('../module/faillingTest') ; 
const client = require('../module/clientData')

const ticketsRouter = express.Router() ;


ticketsRouter.get('/', async (req, res) => 
{
    let rpcr = new Responcer(req, res) ;
    
    try 
    {
        const data = await client.query('SELECT * FROM tickets');

        rpcr.status = 200 ;
        rpcr.message = `Récupération de ${data.rowCount} tickets` ;
        rpcr.data = data.rows ;
        rpcr.send() ;
    }
    catch (err) 
    {
        console.log(err.stack);
        rpcr.send() ;
    }
})


ticketsRouter.get('/:id', async (req, res) => 
{
    let rpcr = new Responcer(req, res) ;
    const id = req.params.id
    
    // Vérifiction du Type de l'id entrante
    if (faillingId(id))
    {
        rpcr.status = 400 ;
        rpcr.message = `${id} n'est pas un nombre entier` ;
        rpcr.send() ;
    } 

    try 
    {
        const data = await client.query('SELECT * FROM tickets WHERE id=$1', [id]);

        // Vérifiction de l'existence de l'id
        if (data.rows.length === 1) {
            
            rpcr.status = 200 ;
            rpcr.message = `Récupération du ticket ${id}` ;
            rpcr.data = data.rows[0] ;
            rpcr.send() ;

        } 
        else 
        {
            rpcr.status = 404 ;
            rpcr.message = `Le ticket ${id} n'existe pas` ;
            rpcr.send() ;
        }
    }
    catch (err) 
    {
        console.log(err.stack)
        rpcr.send() ;
    }
})

ticketsRouter.post('/', async (req, res) => 
{
    let rpcr = new Responcer(req, res) ;
    const { user_id, message} = req.body;

    // Vérifiction du Type du user_id entrant
    if (faillingId(user_id) || faillingString(message))
    {
        rpcr.status = 400 ;
        rpcr.message = `Structure incorrect : { message : string , user_id : number }` ;
        rpcr.send() ;
    } 
    
    try 
    {
        const usersList = await client.query('SELECT id FROM users WHERE id = $1',[user_id]);

        // Vérifiction de l'existence du user_id
        if (usersList.rowCount === 1)
        {
            const data = await client.query('INSERT INTO tickets (message, user_id) VALUES ($1,$2) RETURNING *', [message, user_id]);

            rpcr.status = 201 ;
            rpcr.message = `Création du ticket ${data.rows[0].id}` ;
            rpcr.data = data.rows[0] ;
            rpcr.send() ;
        } 
        else 
        {
            rpcr.status = 404 ;
            rpcr.message = `L'utilisateur ${user_id} n'existe pas` ;
            rpcr.send() ;
        }
    }
    catch (err) 
    {
        console.log(err.stack)
        rpcr.send() ;
    }
})

ticketsRouter.put('/', async (req, res) => 
{
    let rpcr = new Responcer(req, res) ;
    const { id, message, done} = req.body;

    // Vérifiction de la presence des paramètres nécessaires
    if (faillingId(id) || (faillingString(message) && faillingBool(done))) 
    {
        rpcr.status = 400 ;
        rpcr.message = "Structure incorrect : { id : number , message : string , done : boolean } ou { id : number , message : string } ou  { id : number , done : boolean }" ;
        rpcr.send() ;
    }

    try 
    {
        let data
        
        // Exécution de la bonne requête en fonction des paramètres
        console.log(faillingString(message) , faillingBool(done));
        if ( ! (faillingString(message) || faillingBool(done))) 
        {
            data = await client.query('UPDATE tickets SET message = $1, done = $2 WHERE id = $3 RETURNING *', [message, done, id]);
        } 
        else if (! faillingString(message))
        {
            data = await client.query('UPDATE tickets SET message = $1 WHERE id = $2 RETURNING *', [message, id]);
        } 
        else 
        {
            data = await client.query('UPDATE tickets SET done = $1 WHERE id = $2 RETURNING *', [done, id]);
        }

        // Vérifiction de l'existence de l'id
        if (data.rowCount > 0) 
        {
            rpcr.status = 200 ;
            rpcr.message = `Le ticket ${id} a bien été modifier` ;
            rpcr.data = data.rows[0] ;
            rpcr.send() ;
        } 
        else 
        {
            rpcr.status = 404 ;
            rpcr.message = `Le ticket ${id} n'existe pas` ;
            rpcr.send() ;
        }
    }
    catch (err) 
    {
        console.log(err.stack)
        rpcr.send() ;
    }
})

ticketsRouter.delete('/:id', async (req, res) => 
{
    let rpcr = new Responcer(req, res) ;
    const id = req.params.id;

    // Vérifiction du Type de l'id entrante
    if (faillingId(id))
    {
        rpcr.status = 400 ;
        rpcr.message = `${id} n'est pas un nombre entier` ;
        rpcr.send() ;
    }
    try 
    {
        const data = await client.query('DELETE FROM tickets WHERE id = $1', [id]);
        
        // Vérifiction de l'existence de l'id
        if (data.rowCount === 1) 
        {
            rpcr.status = 200 ;
            rpcr.message = `Le ticket ${id} a bien été supprimé` ;
            rpcr.send() ;
        } 
        else 
        {
            rpcr.status = 404 ;
            rpcr.message = `Aucune ticket ne correspond à l'id ${id}` ;
            rpcr.send() ;
        }
    }
    catch (err) 
    {
        console.log(err.stack);
        rpcr.send() ;
    }
})

module.exports = ticketsRouter;