import { beforeAll, describe, expect, test } from 'vitest'
import { axios } from "./axios"

const BACKEND_URL = "http://localhost:8000"

describe('Authentication Routes works as expected!!', () => {
    test("user should not be able to signup more than once", async () => {
        const username = "@random" + Math.random();
        const password = "123456";

        const res1 = await axios.post(`${BACKEND_URL}/api/v1/auth/signup`, {
            username,
            password
        })

        expect(res1.status).toBe(200)

        const res2 = await axios.post(`${BACKEND_URL}/api/v1/auth/signup`, {
            username,
            password
        })

        expect(res2.status).toBe(400);
    })

    test("user should be able to signup", async () => {
        const username = "@random1" + Math.random();
        const password = "123456";

        const res1 = await axios.post(`${BACKEND_URL}/api/v1/auth/signup`, {
            username,
            password
        })

        expect(res1.status).toBe(200)
    })

    test("user should be able to signin with valid credentials", async () => {
        const username = "@random8990";
        const password = "123456";

        await axios.post(`${BACKEND_URL}/api/v1/auth/signup`, {
            username,
            password
        })

        const res = await axios.post(`${BACKEND_URL}/api/v1/auth/signin`, {
            username,
            password
        })

        expect(res.status).toBe(200)
        expect(res.data.access_token).toBeDefined();
    })
})

describe("Movie Router is working as expected", async () => {
    let admin_token = "";
    let userToken = "";

    let userId = "";
    let adminId = "";
    beforeAll(async () => {
        const adminUsername = "@random34" + Math.random();
        const password = "123456";

        const res = await axios.post(`${BACKEND_URL}/api/v1/auth/admin/signup`, {
            username: adminUsername,
            password,
            role: "admin"
        })

        adminId = res.data.userId;
    
        const response2 = await axios.post(`${BACKEND_URL}/api/v1/auth/admin/signin`, {
            username: adminUsername,
            password
        })

        admin_token = response2.data.access_token;

        const username = "@random892278gtuvc" + Math.random();
        const response = await axios.post(`${BACKEND_URL}/api/v1/auth/signup`, {
            username,
            password
        })
        userId = response.data.userId;
        const res2 = await axios.post(`${BACKEND_URL}/api/v1/auth/signin`, {
            username,
            password
        })
        userToken = res2.data.access_token;

    });

    test("Admin should be able to create a movie", async () => {
        const res = await axios.post(`${BACKEND_URL}/api/v1/movie`, {
            title: "Random1",
            description: "Rdjufgvtu",
            imageUrl: "dcgjunb",
            adminId
        },
            {
                headers: {
                    authorization: `Bearer ${admin_token}`
                }
            })

        expect(res.status).toBe(200);
        expect(res.data.movieId).toBeDefined();
    })

    test("User should not be able to create a movie", async () => {


        const res = await axios.post(`${BACKEND_URL}/api/v1/movie`, {
            title: "Random1",
            description: "Rdjufgvtu",
            imageUrl: "dcgjunb",
            adminId: userId
        },
            {
                headers: {
                    authorization: `Bearer ${userToken}`
                }
            })

        expect(res.status).toBe(403);

    })

    test("admin shouldn't be able to create a movie without a token", async () => {

        const res = await axios.post(`${BACKEND_URL}/api/v1/movie`, {
            title: "Random1",
            description: "Rdjufgvtu",
            imageUrl: "dcgjunb",
            adminId: adminId
        });

        expect(res.status).toBe(403);
    })

    test("everyone should be able to get all the movies by hitting the endpoint", async () => {
        const res = await axios.get(`${BACKEND_URL}/api/v1/movie`);

        expect(res.status).toBe(200);
        expect(res.data.movies.length).not.toBe(0);
        expect(res.data.movies).toBeDefined();
    })

    test("getting a movie by its id is working as expected", async () => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/movie`);
        const movieId = response.data.movies[0].id;

        const res = await axios.get(`${BACKEND_URL}/api/v1/movie/${movieId}`);

        expect(res.status).toBe(200);
        expect(res.data.movie).not.toBe(0);
        expect(res.data.movie).toBeDefined();
    })

    test("admin should be able to edit the movie by passing the movie id", async () => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/movie`);
        const movieId = response.data.movies[0].id;
       
        const res = await axios.put(`${BACKEND_URL}/api/v1/movie/${movieId}`, {
            title: "updated",
            description: "updated",
            imageUrl: "updated",
            adminId: adminId
        }, {
            headers: {
                authorization: `Bearer ${admin_token}`
            }
        });

        expect(res.status).toBe(200);

    })


    test("admin should be able to delete the movie by passing the movie id", async () => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/movie`);
        const movieId = response.data.movies[0].id;
        
        const length = response.data.movies.length;
        const res = await axios.delete(`${BACKEND_URL}/api/v1/movie/${movieId}`, {
            headers: {
                authorization: `Bearer ${admin_token}`
            }
        });

        expect(res.status).toBe(200);
        const response2 = await axios.get(`${BACKEND_URL}/api/v1/movie`);
    
        expect(response2.data.movies.length).toBe(length - 1);
    })
})
