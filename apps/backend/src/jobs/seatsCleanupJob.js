import client from '@repo/db/client';
import cron from 'node-cron';

cron.schedule('*/30 * * * * *', async () => {
    console.log('Running cron job to check for expired movies...')
    try {
        const currentTime = new Date().toISOString();
        console.log("im started attttttttttttttttttttttttt", currentTime);
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
            console.log("No movies to process at this time.");
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
        console.log("updatedSeats,", results);
    } catch (error) {
        console.log("some error occured!!");
    }
})
