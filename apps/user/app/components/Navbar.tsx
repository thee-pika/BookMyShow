import Link from "next/link";

const Navbar = () => {
    return (
        <>
            <div className="navbar text-white h-16 bg-[#cc0a31] top-0 sticky z-50 w-[100vw] flex justify-between items-center">
                <Link href={"/"}>
                    <div className="logo ml-12 text-xl font-bold text-[#f4f4f4]">ShowTime</div>
                </Link>
                <div className="nav-items flex justify center items-center">
                    <Link href={"/"}>
                        <div className="item1 hover:underline m-4">Home</div>
                    </Link>
                    <div className="item1 hover:underline m-4">About</div>
                    <Link href={"/auth/login"}>
                        <div className="item1 hover:underline m-4">Login</div>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default Navbar;