"use client"
import axios from "axios";
import Link from "next/link";
import { useState } from "react"
import useAuthStore from "../../components/store";

const Login = () => {
    const [loginData, setLoginData] = useState({
        username: "",
        password: ""
    })

    function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const { name, value } = event.target;

        setLoginData({ ...loginData, [name]: value })
    }

    async function handleSubmit(e: React.FormEvent): Promise<void> {
        e.preventDefault();

        const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/admin/signin`, {
            username: loginData.username,
            password: loginData.password
        })

        if (res.status === 200) {
            const access_token = res.data.access_token;
            useAuthStore.getState().setAccessToken(access_token);
            console.log("token", useAuthStore.getState().accessToken);
        }
    }

    return (
        <>
            <section>
                <div>
                    <div className="login shadow-sm rounded-md w-[40vw] mx-auto h-100 flex flex-col justify-center items-center mt-8">
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col">
                                <h1 className="mb-16 text-xl font-bold">Login Into Your Account</h1>
                                <input
                                    type="text"
                                    className="bg-gray-50 border border-gray-100 text-gray-900 outline-none focus:ring-[#cc0a31] focus:border-[#cc0a31] block w-full ring-2 p-4 rounded-md"
                                    name="username mb-4"
                                    placeholder="username"
                                    value={loginData.username}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    type="password"
                                    className="bg-gray-50 border border-gray-100 text-gray-900 outline-none focus:ring-[#cc0a31] focus:border-[#cc0a31] block w-full ring-2 p-4 mt-4 rounded-md"
                                    name="password"
                                    placeholder="password"
                                    value={loginData.password}
                                    onChange={handleChange}
                                    required
                                />
                                <button type="submit" className="bg-[#cc0a31] rounded-md p-4 hover:bg-[#eb849a] pl-4 pr-4 mt-8 text-white font-bold">Login</button>

                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Login