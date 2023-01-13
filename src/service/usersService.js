

const client = require('../module/clientData');

class UsersService{
    async getByName(name)
    {
        const data = await client.query('SELECT * FROM users WHERE username = $1', [name]);

        if(data.rowCount)
        {
            return data.rows[0];
        }
        
        return undefined
    }

    async add(name, hash)
    {
        const data = await client.query('INSERT INTO users (username, password) VALUES ($1,$2) RETURNING *', [name, hash]);

        if(data.rowCount)
        {
            return data.rows[0];
        }
        
        return undefined
    }
}

module.exports = UsersService