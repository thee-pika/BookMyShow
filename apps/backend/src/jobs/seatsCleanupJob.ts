import client from '@repo/db/client';
import cron from 'node-cron';

cron.schedule('*/30 * * * * *', async () => {
    
    try {
        const currentTime = new Date().toISOString();
      
        const movies = await client.movie.findMany({
            where: {
                startTime: {
                    lt: currentTime
                }
            }
        })

        const seats = await client.seat.findMany({

        })

        if (!movies.length) {
        
            return;
        }
       const result = movies.map(async (movie) => {
            const updatedMovie = await client.seat.updateMany({
                where: {
                    movieId: movie.id
                },
                data: {
                    status: "available"
                }
            })
          
            return updatedMovie;
        });
   
        const results = await Promise.all(result); // Await the resolution of all promises
      
    } catch (error) {
       
    }
})
