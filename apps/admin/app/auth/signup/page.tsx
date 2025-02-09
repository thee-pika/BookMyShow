"use client"
import axios from "axios";
import Link from "next/link";
import { useState } from "react"
import { useRouter } from "next/navigation";
import { redirect } from 'next/navigation';
import toast, { Toaster } from "react-hot-toast";

const Signup = () => {
    const router = useRouter();
    const [signUpData, setSignupData] = useState({
        username: "",
        password: ""
    })

    function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const { name, value } = event.target;

        setSignupData({ ...signUpData, [name]: value })
    }

    async function handleSubmit(e: React.FormEvent): Promise<void> {
        e.preventDefault();
  
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/signup`, {
            username: signUpData.username,
            password: signUpData.password
        })

        if (res.statusText === 'OK') {
            toast.success("Account created Successfully!!");
            setTimeout(() => {
                redirect("/auth/login");
            }, 1000)
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
                                    create your account
                                </h1>
                                <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                                    <div>
                                        <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 ">Your username</label>
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            placeholder="username"
                                            value={signUpData.username}
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
                                            value={signUpData.password}
                                            onChange={handleChange}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                                            required />
                                    </div>
                                    <button type="submit" className="w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Sign up</button>
                                    <p className="text-sm font-light text-gray-500 ">
                                        Don&apos;t have an account yet?
                                        <Link href="/auth/login" className="font-medium text-primary-600 hover:underline ">Sign In</Link>
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

export default Signup