"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [role, setrole] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("access_token");
      if (data) {
        const userDetails = JSON.parse(data);

        const token = userDetails.token;
        if (!token) {
          
          setisLoggedIn(false);
          router.push("/auth/login");
        } else {
          setisLoggedIn(true);
          setrole(userDetails.role);
        }
      }
    }
  }, [router, role]);

  function handleLogout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      router.refresh();
      setisLoggedIn(false);
      setrole("");
      setIsMobileMenuOpen(false)
      router.push("/auth/login");
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <div className="navbar h-16 top-0 sticky z-50 w-full bg-white flex justify-between items-center px-6 md:px-24 shadow-md">
        <Link href={"/"}>
          <div className="logo flex items-center">
            <div className="image">
              <Image src={"/assets/movie.png"} width={40} height={40} alt={""} />
            </div>
            <div className="logo ml-4 text-xl font-bold">ShowTime</div>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex nav-items space-x-4 items-center">
          <Link href={"/booking"}>
            <div className="item1 flex bg-red-600 text-white px-4 py-2 rounded-md">
              <Image
                src={"/assets/movie-svgrepo-com.svg"}
                width={20}
                height={20}
                alt={""}
              />
              <span className="pl-2">Your Tickets</span>
            </div>
          </Link>
          {role === "admin" && (
            <Link href={"/movie"}>
              <div className="px-4 py-2 hover:bg-gray-200">
                New Movie
              </div>
            </Link>
          )}
          <Link href={"/about"}>
            <div className="px-4 py-2 hover:bg-gray-200 ">About</div>
          </Link>
          {!isLoggedIn ? (
            <Link href={"/auth/login"}>
              <div className="px-4 py-2 hover:bg-gray-200 ">Login</div>
            </Link>
          ) : (
            <div
              className="px-4 py-2 hover:bg-gray-200  cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center">
          <button
            className="text-gray-700 focus:outline-none"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="flex flex-col bg-white shadow-md md:hidden px-6 py-4 space-y-4">
          <Link href={"/booking"}>
            <div className="flex bg-red-600 text-white px-4 py-2 rounded-md" onClick={() => setIsMobileMenuOpen(false)}>
              <Image
                src={"/assets/movie-svgrepo-com.svg"}
                width={20}
                height={20}
                alt={""}
              />
              <span className="pl-2">Your Tickets</span>
            </div>
          </Link>
          {role === "admin" && (
            <Link href={"/movie"}>
              <div className="px-4 py-2 hover:bg-gray-200 rounded-md" onClick={() => setIsMobileMenuOpen(false)}>
                New Movie
              </div>
            </Link>
          )}
          <Link href={"/about"}>
            <div className="px-4 py-2 hover:bg-gray-200 rounded-md" onClick={() => setIsMobileMenuOpen(false)}>About</div>
          </Link>
          {!isLoggedIn ? (
            <Link href={"/auth/login"}>
              <div className="px-4 py-2 hover:bg-gray-200 rounded-md" onClick={() => setIsMobileMenuOpen(false)}>Login</div>
            </Link>
          ) : (
            <div
              className="px-4 py-2 hover:bg-gray-200 rounded-md cursor-pointer"
              onClick={handleLogout}
              
            >
              Logout
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
