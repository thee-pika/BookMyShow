"use client"
import axios from "axios";
import Link from "next/link";
import { useState } from "react"
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import PropagateLoader from "react-spinners/PropagateLoader";

const Login = () => {
const router = useRouter();
const [isLoading, setLoading] = useState(false);
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
        setLoading(true);
       try {
         const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/signin`, {
             username: loginData.username,
             password: loginData.password
         }, {
             withCredentials: true
         })
 
         if (res.status === 200) {
             const data = {
                 token : res.data.access_token,
                 role: res.data.user.role
             }
             sessionStorage.setItem("access_token", JSON.stringify(data));
 
             toast.success("Logged In Successfully!!");
             setTimeout(() => {
                router.push("/");
            }, 1000);
         }
       } catch (error: any) {
        toast.error(
            error.response?.data?.message || "Login failed. Please try again."
        );
       } finally {
        setLoading(false);
       }
    }

    if (isLoading) {
        return <div className="flex justify-center items-center h-[70vh]">
          <PropagateLoader />
        </div>
      }    

    return (
        <>
            <section className="flex items-center justify-center  min-h-[77.9vh] bg-gray-50">
                <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                        Sign in to your account
                    </h1>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label
                                htmlFor="username"
                                className="block mb-2 text-sm font-medium text-gray-700"
                            >
                                Your username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="username"
                                value={loginData.username}
                                onChange={handleChange}
                                className="w-full p-2.5 border rounded-lg text-gray-900 bg-gray-50 border-gray-300 focus:ring-red-500 focus:border-red-500"
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="password"
                                className="block mb-2 text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="••••••••"
                                value={loginData.password}
                                onChange={handleChange}
                                className="w-full p-2.5 border rounded-lg text-gray-900 bg-gray-50 border-gray-300 focus:ring-red-500 focus:border-red-500"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
                                isLoading && "cursor-not-allowed opacity-50"
                            }`}
                        >
                            {isLoading ? "Signing in..." : "Sign in"}
                        </button>
                        <p className="text-sm text-gray-500 text-center">
                            Don&apos;t have an account yet?{" "}
                            <Link
                                href="/auth/signup"
                                className="font-medium text-red-600 hover:underline"
                            >
                                Sign up
                            </Link>
                        </p>
                    </form>
                    <Toaster />
                </div>
            </section>
        </>
    )
}

export default Login