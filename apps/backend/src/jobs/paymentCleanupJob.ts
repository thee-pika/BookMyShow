import cron from 'node-cron';
import { redisClient } from '../redis/worker.js';
import  client  from '@repo/db/client';

cron.schedule('*/10 * * * *', async () => {
    
    try {
        const keys = await redisClient.keys('session:*');
  
        for (const key of keys) {
            const session = await redisClient.get(key);
            const orderId = key.split(":")[1];

            if (session) {
             
                const sessionData = await JSON.parse(session);

                const Seats = await client.seat.findMany({
                    where: {
                        orderId,
                    },
                })
                if (!sessionData.expiresAt) {
                    await redisClient.del(key);
                    continue; 
                }
                const sessionExpiryTime = new Date(sessionData.expiresAt).getTime();
                if (sessionExpiryTime < Date.now()) {
                   
                    const updatedSeats = await client.seat.updateMany({
                        where: {
                            orderId,
                            status: "pending"
                        },
                        data: {
                            status: "available"
                        }
                    })
                 
                    await redisClient.del(key)
                }
            }
        }
    } catch (error) {
     
    }
})