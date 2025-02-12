"use client"
import axios from "axios";
import Link from "next/link";
import { useState } from "react"
import { redirect } from 'next/navigation';
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
    const router = useRouter();
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

        const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/signin`, {
            username: loginData.username,
            password: loginData.password
        }, {
            withCredentials: true
        })

        if (res.status === 200) {
            const data = {
                token: res.data.access_token,
                role: res.data.user.role
            }
            if (typeof window !== "undefined") {
                localStorage.setItem("access_token", JSON.stringify(data));

                toast.success("Logged In Successfully!!");
                router.refresh();
                setTimeout(() => {
                    redirect("/");
                }, 1000)
            }
        }

    }

    return (
        <>
            <section>

                <div className="bg-gray-50 w-3xl mx-auto">
                    <div className="flex flex-col items-center justify-center px-6 py-8  md:h-screen lg:py-0">

                        <div className="w-full bg-white rounded-lg shadow ">
                            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                                    Sign in to your account
                                </h1>
                                <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                                    <div>
                                        <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 ">Your username</label>
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            placeholder="username"
                                            value={loginData.username}
                                            onChange={handleChange}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"

                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 ">Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            id="password"
                                            placeholder="••••••••"
                                            value={loginData.password}
                                            onChange={handleChange}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                                            required />
                                    </div>

                                    <button type="submit" className="w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Sign in</button>
                                    <p className="text-sm font-light text-gray-500 ">
                                        Don&apos;t have an account yet?
                                        <Link href="/auth/signup" className="font-medium text-primary-600 hover:underline ">Sign up</Link>
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                    <Toaster />
                </div>
            </section>
        </>
    )
}

export default Login