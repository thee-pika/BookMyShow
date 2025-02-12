"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Navbar = () => {
    const [isLoggedIn, setisLoggedIn] = useState(false);
    const [role, setrole] = useState("");
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const data = localStorage.getItem("access_token");
            if (data) {
                const userDetails = JSON.parse(data);

                const token = userDetails.token;
                if (!token) {
                    console.log("im in token ")
                    setisLoggedIn(false);

                } else {
                    setisLoggedIn(true);
                    setrole(userDetails.role);
                    console.log("role,", role)
                    router.push("/auth/login");
                }
            }
        }
    }, [router, role])

    function handleLogout(): void {
        if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        router.refresh();
        setisLoggedIn(false);
        setrole("");
        }
    }

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
                    {
                        role === "admin" && <Link href={"/movie"}>
                            <div className="item1 hover:underline m-4">New Movie</div>
                        </Link>
                    }

                    <Link href={"/about"}>
                        <div className="item1 hover:underline m-4">About</div></Link>
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