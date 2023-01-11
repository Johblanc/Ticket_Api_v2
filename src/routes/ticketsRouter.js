const express = require('express') ;
const Responcer = require('../module/Responcer') ;
const { faillingId, faillingString, faillingBool } = require('../module/faillingTest') ; 
const client = require('../module/clientData')

const ticketsRouter = express.Router() ;


ticketsRouter.get('/', async (req, res) => 
{
    let rpcr = new Responcer()
    
    try 
    {
        const data = await client.query('SELECT * FROM tickets');

        rpcr.status = 200 ;
        rpcr.message = `Récupération de ${data.rowCount} tickets` ;
        rpcr.data = data.rows ;
    }
    catch (err) 
    {
        console.log(err.stack)
    }
    console.log(`get | /api/tickets | ${rpcr.info()}`);
    res = rpcr.send(res)
})


ticketsRouter.get('/:id', async (req, res) => 
{
    let rpcr = new Responcer()
    const id = req.params.id
    
    // Vérifiction du Type de l'id entrante
    if (faillingId(id))
    {
        rpcr.status = 400 ;
        rpcr.message = `${id} n'est pas un nombre entier` ;
    } 
    else 
    {
        try 
        {
            const data = await client.query('SELECT * FROM tickets WHERE id=$1', [id]);
    
            // Vérifiction de l'existence de l'id
            if (data.rows.length === 1) {
                
                rpcr.status = 200 ;
                rpcr.message = `Récupération du ticket ${id}` ;
                rpcr.data = data.rows[0] ;

            } else {
                rpcr.status = 404 ;
                rpcr.message = `Le ticket ${id} n'existe pas` ;
            }
        }
        catch (err) 
        {
            console.log(err.stack)
        }
    }
    console.log(`get | /api/tickets/${id} | ${rpcr.info()}`);
    res = rpcr.send(res)
})

ticketsRouter.post('/', async (req, res) => 
{
    let rpcr = new Responcer()
    const { user_id, message} = req.body;

    // Vérifiction du Type du user_id entrant
    if (faillingId(user_id))
    {
        rpcr.status = 400 ;
        rpcr.message = `${user_id} n'est pas un nombre entier` ;
    } 
    else if (faillingString(message))
    {
        rpcr.status = 400 ;
        rpcr.message = `${message} n'est pas un texte` ;
    } 
    else 
    {
        try 
        {
            // Vérifiction de la presence des paramètres nécessaires
            if (message !== undefined  && user_id !== undefined ) 
            {
                const usersList = await client.query('SELECT id FROM users WHERE id = $1',[user_id]);

                // Vérifiction de l'existence du user_id
                if (usersList.rowCount === 1)
                {
                    const data = await client.query('INSERT INTO tickets (message, user_id) VALUES ($1,$2) RETURNING *', [message, user_id]);

                    rpcr.status = 201 ;
                    rpcr.message = `Création du ticket ${data.rows[0].id}` ;
                    rpcr.data = data.rows[0] ;
                } 
                else 
                {
                    rpcr.status = 404 ;
                    rpcr.message = `L'utilisateur ${user_id} n'existe pas` ;
                }
            } 
            else 
            {
                rpcr.status = 400 ;
                rpcr.message = "Structure incorrect : { message : string , user_id : number }" ;
            }
        }
        catch (err) 
        {
            console.log(err.stack)
        }
    }
    console.log(`post | /api/tickets | ${rpcr.info()}`);
    res = rpcr.send(res)
})

ticketsRouter.put('/', async (req, res) => 
{
    let rpcr = new Responcer()
    const { id, message, done} = req.body;

    // Vérifiction de la presence des paramètres nécessaires
    if (!(id !== undefined && (message !== undefined || done !== undefined))) 
    {
        rpcr.status = 400 ;
        rpcr.message = "Structure incorrect : { id : number , message : string , done : boolean } ou { id : number , message : string } ou  { id : number , done : boolean }" ;
    }
    // Vérifiction du Type de l'id entrante
    else if (faillingId(id))
    {
        rpcr.status = 400 ;
        rpcr.message = `${id} n'est pas un nombre entier` ;
    }
    // Vérifiction du Type du message entrant
    else if (faillingString(message))
    {
        rpcr.status = 400 ;
        rpcr.message = `${message} n'est pas un texte` ;
    }

    // Vérifiction du Type du done entrant
    else if (faillingBool(done))
    {
        rpcr.status = 400 ;
        rpcr.message = `${done} n'est pas un booleen` ;
    }
    else {

        try 
        {
            let data
            
            // Exécution de la bonne requête en fonction des paramètres
            if (message !== undefined && done !== undefined) 
            {
                data = await client.query('UPDATE tickets SET message = $1, done = $2 WHERE id = $3 RETURNING *', [message, done, id]);
            } 
            else if (message !== undefined)
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
            } 
            else 
            {
                rpcr.status = 404 ;
                rpcr.message = `Le ticket ${id} n'existe pas` ;
            }
        }
        catch (err) 
        {
            console.log(err.stack)
        }
    }
    console.log(`put | /api/tickets | ${rpcr.info()}`);
    res = rpcr.send(res)
})

ticketsRouter.delete('/:id', async (req, res) => 
{
    let rpcr = new Responcer()
    const id = req.params.id;

    // Vérifiction du Type de l'id entrante
    if (faillingId(id))
    {
        rpcr.status = 400 ;
        rpcr.message = `${id} n'est pas un nombre entier` ;
    }
    else 
    {
        try 
        {
            const data = await client.query('DELETE FROM tickets WHERE id = $1', [id]);
            
            // Vérifiction de l'existence de l'id
            if (data.rowCount === 1) 
            {
                rpcr.status = 200 ;
                rpcr.message = `Le ticket ${id} a bien été supprimé` ;
            } 
            else 
            {
                rpcr.status = 404 ;
                rpcr.message = `Aucune ticket ne correspond à l'id ${id}` ;
            }
        }
        catch (err) 
        {
            console.log(err.stack);
        }
    }
    console.log(`delete | /api/tickets/${id} | ${rpcr.info()}`);
    res = rpcr.send(res)
})

module.exports = ticketsRouter;