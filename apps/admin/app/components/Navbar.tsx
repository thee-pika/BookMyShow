"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
import useAuthStore from "./store";

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

    return (
        <>
            <div className="navbar text-white h-16 bg-[#cc0a31] top-0 sticky z-50 w-[100vw] flex justify-between items-center">
                <Link href={"/"}>
                    <div className="logo ml-12 text-xl font-bold text-[#f4f4f4]">ShowTime</div>
                </Link>
                <div className="nav-items flex justify center items-center">
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