const express = require('express')
const Responcer = require('../module/Responcer') ;
const { faillingString } = require('../module/faillingTest') ;
const client = require('../module/clientData')
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const accessTokenSecret = 'youraccesstokensecret';

const usersRouter = express.Router();

usersRouter.post('/register',async (req , res) => 
{
    let rpcr = new Responcer(req, res) ;
    const pass = req.body.pass
    const user_name = req.body.user_name
    bcrypt.hash(pass, 10, async (err, hash) =>
    {
        if (faillingString(pass) || faillingString(user_name))
        {
            rpcr.status = 400 ;
            rpcr.message = "Structure incorrect : { pass : string , user_name : string }" ;
            rpcr.send() ;
        }
        
        try
        {
            const usersList = await client.query('SELECT id FROM users WHERE username = $1',[user_name]);
            
            if (usersList.rowCount > 0) 
            {
                rpcr.status = 400 ;
                rpcr.message = `Cet utilisateur existe déjà`
                rpcr.send() ;
            }
            else 
            {
                const data = await client.query('INSERT INTO users (username, password) VALUES ($1,$2) RETURNING id,username', [user_name, hash]);
                rpcr.status = 200 ;
                rpcr.message = `L'utilisateur ${user_name} à bien été ajouté`
                rpcr.data = data.rows[0]
                rpcr.send() ;
            }
        }
        catch (err)
        {
            console.log(err.stack);
            rpcr.send() ;
        }
    });
})

usersRouter.post('/login', async (req, res) => 
{
    let rpcr = new Responcer(req, res) ;
    const pass = req.body.pass ;
    const user_name = req.body.user_name ;
    
    if (faillingString(pass) || faillingString(user_name))
    {
        rpcr.status = 400 ;
        rpcr.message = "Structure incorrect : { pass : string , user_name : string }" ;
        rpcr.send() ;
    }
    
    try 
    {
        const data = await client.query('SELECT password, id FROM users WHERE username = $1', [user_name]);
        
        if (data.rowCount === 0)
        {
            rpcr.status = 404 ;
            rpcr.message = `Le nom d'utilisateur ou/et le mot de passe sont incorects`;
            rpcr.send() ;
        }

        bcrypt.compare(pass, data.rows[0].password,async (err,result) =>
        {
            if (result) 
            {
                rpcr.status = 200 ;
                rpcr.message = `Connection de ${user_name}` ;
                rpcr.data = { 
                    token : jwt.sign({ id: data.rows[0].id }, accessTokenSecret),
                    id : data.rows[0].id
                } ;
                rpcr.send() ;
            }
            else
            {
                rpcr.status = 404 ;
                rpcr.message = `Le nom d'utilisateur ou/et le mot de passe sont incorects` ;
                rpcr.send() ;
            }
        })
    }
    catch (err) 
    {
        console.log(err.stack) ;
        rpcr.send() ;
    }
    
})

module.exports = usersRouter;