import { describe, expect, test } from 'vitest'
import {axios} from "./axios"

const BACKEND_URL = "http://localhost:8000"

describe('Authentication Routes works as expected!!', () => {
    test("user should not be able to signup more than once", async () => {
        const username = "@random" + Math.random();
        const password = "123456";

        const res1 = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password
        })

        expect(res1.status).toBe(200)
        // console.log("statussssssssssssssssssssssssssss", res2.status)
        // await expect(async () => {
          
        // }).rejects.toThrowError()

        const res2 = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password
        })

        expect(res2.status).toBe(400);
    })

    test("user should be able to signup", async () => {
        const username = "@random1" + Math.random();
        const password = "123456";

        const res1 = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password
        })

        expect(res1.status).toBe(200)
    })

    test("user should be able to signin with valid credentials", async () => {
        const username = "@random89" + Math.random();
        const password = "123456";

        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password
        })

        const res = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password
        })

        expect(res.status).toBe(200)
        expect(res.data.token).toBeDefined();
    })
})
