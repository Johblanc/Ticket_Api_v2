const express = require('express')
const Responcer = require('../module/Responcer') ;
const { faillingString } = require('../module/faillingTest') ;
const client = require('../module/clientData')
const bcrypt = require('bcrypt');


const usersRouter = express.Router();

usersRouter.post('/register',async (req , res) => 
{
    let rpcr = new Responcer()
    const pass = req.body.pass
    const user_name = req.body.user_name
    bcrypt.hash(pass, 10, async (err, hash) =>
    {
        if (!pass || !user_name)
        {
            rpcr.status = 400 ;
            rpcr.message = "Structure incorrect : { pass : string , user_name : string }" ;
        }
        else if (faillingString(pass))
        {
            rpcr.status = 400 ;
            rpcr.message = `Le mot de pass doit être un texte`
        }
        else if (faillingString(user_name))
        {
            rpcr.status = 400 ;
            rpcr.message = `Le nom d'utilisateur doit être un texte`
        }
        else 
        {
            try
            {
                const usersList = await client.query('SELECT id FROM users WHERE username = $1',[user_name]);
                
                if (usersList.rowCount > 0) 
                {
                    rpcr.status = 400 ;
                    rpcr.message = `Cet utilisateur existe déjà`
                }
                else 
                {
                    const data = await client.query('INSERT INTO users (username, password) VALUES ($1,$2) RETURNING id,username', [user_name, hash]);
                    rpcr.status = 200 ;
                    rpcr.message = `L'utilisateur ${user_name} à bien été ajouté`
                    rpcr.data = data.rows[0]
                }
            }
            catch (err)
            {
                console.log(err.stack);
            }
        }
        
        console.log(`post | /api/users/regiter | ${rpcr.info()}`);
        res = rpcr.send(res)
    });
})

usersRouter.get('/login', async (req, res) => 
{
    let rpcr = new Responcer() ;
    const pass = req.body.pass ;
    const user_name = req.body.user_name ;
    
    if (!pass || !user_name)
    {
        rpcr.status = 400 ;
        rpcr.message = "Structure incorrect : { pass : string , user_name : string }" ;
    }
    else if (faillingString(pass))
    {
        rpcr.status = 400 ;
        rpcr.message = `Le mot de pass doit être un texte`
    }
    else if (faillingString(user_name))
    {
        rpcr.status = 400 ;
        rpcr.message = `Le nom d'utilisateur doit être un texte`
    }
    else 
    {
        try 
        {
            const sqlPass = await (await client.query('SELECT password FROM users WHERE username = $1', [user_name])).rows[0].password;
            console.log(sqlPass)
            bcrypt.compare(pass, sqlPass,async (err,result) =>
            {
                console.log(result);
                if (result) 
                {
                    rpcr.status = 200 ;
                    rpcr.message = `Connection de ${user_name}` ;
                }
                else
                {
                    rpcr.status = 400 ;
                    rpcr.message = `Le nom d'utilisateur ou/et le mot de passe sont incorects`
                }
                console.log(`get | /api/users/login | ${rpcr.info()}`);
                res = rpcr.send(res)
                return ;
                
            })
        }
        catch (err) 
        {
            console.log(err.stack)
            console.log(`get | /api/users/login | ${rpcr.info()}`);
            res = rpcr.send(res)
            return ;
        }
    }
    console.log(`get | /api/users/login | ${rpcr.info()}`);
    res = rpcr.send(res)
})

module.exports = usersRouter;