"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
import useAuthStore from "./store";
import Image from "next/image";

const Navbar = () => {
    const [isLoggedIn, setisLoggedIn] = useState(false);
    const [token, settoken] = useState("")

    useEffect(() => {
        const newToken = sessionStorage.getItem("access_token");
        if (newToken) {
            settoken(newToken);
            setisLoggedIn(true);
        } else {
            setisLoggedIn(false);
        }
    }, [])

    function handleLogout(): void {
        sessionStorage.removeItem("access_token");
        setisLoggedIn(false);
    }
    //#1A1B33
    return (
        <>
            <div className="navbar  h-16 top-0 sticky z-50 w-[100%] bg-[#ffffff] flex justify-between items-center">

                <Link href={"/"}>
                    <div className="logo flex ml-24 items-center">
                        <div className="image">
                            <Image
                                src={"/assets/movie.png"}
                                width={40}
                                height={40} alt={""}
                            />
                        </div>
                        <div className="logo ml-4 text-xl font-bold ">ShowTime</div>
                    </div>
                </Link>

                <div className="nav-items flex justify center items-center">
                    <Link href={"/booking"}>
                        <div className="item1 hover:underline m-4 flex">
                            <Image
                                src={"/assets/movie-svgrepo-com.svg"}
                                width={20}
                                height={20}
                                alt={""} />
                            <span className="pl-2"> Your Tickets</span>
                        </div>
                    </Link>
                    <Link href={"/movie"}>
                        <div className="item1 hover:underline m-4">New Movie</div>
                    </Link>
                    <Link href={"/"}>
                        <div className="item1 hover:underline m-4">Home</div>
                    </Link>
                    <div className="item1 hover:underline m-4">About</div>
                    {
                        !isLoggedIn ? <Link href={"/auth/login"}>
                            <div className="item1 hover:underline m-4">Login</div>
                        </Link> :
                            <div className="item1 hover:underline m-4" onClick={handleLogout}>Logout</div>
                    }
                </div>
            </div>
        </>
    )
}

export default Navbar;