
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Responcer = require('../module/Responcer') ;
const { faillingString } = require('../module/faillingTest') ;
const client = require('../module/clientData')

const accessTokenSecret = process.env.SECRET_TOKEN ;
const UsersService = require('../service/usersService')

const usersService = new UsersService()


class UsersController {

    async register (req , res)
    {
        let responcer = new Responcer(req, res) ;
        const pass = req.body.pass
        const user_name = req.body.user_name

        
        bcrypt.hash(pass, 10, async (err, hash) =>
        {
            if (faillingString(pass) || faillingString(user_name))
            {
                responcer.status = 400 ;
                responcer.message = "Structure incorrect : { pass : string , user_name : string }" ;
                responcer.send() ;
            }
            
            try
            {
                const usersList = await usersService.getByName(user_name);
                
                if (usersList) 
                {
                    responcer.status = 400 ;
                    responcer.message = `Cet utilisateur existe déjà`
                    responcer.send() ;
                }
                else 
                {
                    const data = await usersService.add(user_name, hash);
                    responcer.status = 200 ;
                    responcer.message = `L'utilisateur ${user_name} à bien été ajouté`
                    responcer.data = data.rows[0]
                    responcer.send() ;
                }
            }
            catch (err)
            {
                console.log(err.stack);
                responcer.send() ;
            }
        });
    }

    async login (req, res)
    {
        let responcer = new Responcer(req, res) ;
        const pass = req.body.pass ;
        const user_name = req.body.user_name ;
        
        if (faillingString(pass) || faillingString(user_name))
        {
            responcer.status = 400 ;
            responcer.message = "Structure incorrect : { pass : string , user_name : string }" ;
            responcer.send() ;
        }
        
        try 
        {
            const data = await usersService.getByName(user_name);
            
            if (!data)
            {
                responcer.status = 404 ;
                responcer.message = `Le nom d'utilisateur ou/et le mot de passe sont incorects`;
                responcer.send() ;
            }
    
            bcrypt.compare(pass, data.password,async (err,result) =>
            {
                if (result) 
                {
                    responcer.status = 200 ;
                    responcer.message = `Connection de ${user_name}` ;
                    responcer.data = { 
                        token : jwt.sign({ id: data.id }, accessTokenSecret),
                        id : data.id
                    } ;
                    responcer.send() ;
                }
                else
                {
                    responcer.status = 404 ;
                    responcer.message = `Le nom d'utilisateur ou/et le mot de passe sont incorects` ;
                    responcer.send() ;
                }
            })
        }
        catch (err) 
        {
            console.log(err.stack) ;
            responcer.send() ;
        }
        
    }
}

module.exports = UsersController