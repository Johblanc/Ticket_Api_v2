


const client = require('../module/clientData');

class TicketssService{
    async getAll()
    {
        const data = await client.query('SELECT * FROM tickets');

        if(data.rowCount)
        {
            return data.rows;
        }
        
        return undefined
    }

    async getById(id)
    {
        const data = await client.query('SELECT * FROM tickets WHERE id=$1', [id]);

        if(data.rowCount)
        {
            return data.rows[0];
        }
        
        return undefined
    }

    async add(message, id)
    {
        const data = await client.query('INSERT INTO tickets (message, user_id) VALUES ($1,$2) RETURNING *', [message, id]);

        if(data.rowCount)
        {
            return data.rows[0];
        }
        
        return undefined
    }

    async getByIdAndUserId(id, user_id)
    {
        const data = await client.query('SELECT * FROM tickets WHERE id = $1 AND user_id = $2', [id, user_id]);

        if(data.rowCount)
        {
            return data.rows[0];
        }
        
        return undefined
    }

    async change(id, message, done)
    {
        const data = await client.query('UPDATE tickets SET message = $1, done = $2 WHERE id = $3 RETURNING *', [message, done, id]);

        if(data.rowCount)
        {
            return data.rows[0];
        }
        
        return undefined
    }
    
    async changeMessage(id, message)
    {
        const data = await client.query('UPDATE tickets SET message = $1 WHERE id = $2 RETURNING *', [message, id]);

        if(data.rowCount)
        {
            return data.rows[0];
        }
        
        return undefined
    }
    
    async changeDone(id, done)
    {
        const data = await client.query('UPDATE tickets SET done = $1 WHERE id = $2 RETURNING *', [done, id]);

        if(data.rowCount)
        {
            return data.rows[0];
        }
        
        return undefined
    }

    async delete(id)
    {
        const data = await client.query('DELETE FROM tickets WHERE id = $1', [id]);

        if(data.rowCount)
        {
            return data.rowCount;
        }
        
        return undefined
    }

}

module.exports = TicketssService