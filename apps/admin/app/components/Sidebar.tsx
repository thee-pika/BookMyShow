"use client";
import { Dispatch, SetStateAction } from "react"

interface selectItem {
    language: string,
    genre: string
}
interface SidebarProps {
    selectedItems: selectItem;
    setSelectedItems: Dispatch<SetStateAction<selectItem>>
}

const Sidebar = ({ selectedItems, setSelectedItems }: SidebarProps) => {
    const languages = ["All","Telugu", "Hindi", "English", "Tamil", "Malayalam"];
    const genres = ["Action", "Thriller", "Horror"]

    return (
        <div className="sidebar w-64 mr-6 ml-12 bg-white shadow-lg p-4 rounded-xl mt-8 mb-8 ">
            <div className="mt-4">
                <h1 className=" mb-4 font-mono text-xl font-bold">languages</h1>
                {
                    languages.map((lang) => (
                        <div key={lang} className="m-4">
                            <input
                                type="radio"
                                value={lang}
                                id={lang}
                                name="language"
                                checked={selectedItems.language === lang}
                                onChange={(e) => setSelectedItems({...selectedItems, language: e.target.value})}
                                className={`mr-2 w-5 mb-1 h-5 `}
                            />
                            <label className={`${selectedItems.language === lang ? "font-bold" : ""}`} htmlFor={lang}>{lang}</label>
                        </div>
                    ))
                }
            </div>

            <div className="mt-4">
                <h1 className=" mb-4 font-mono text-xl font-bold">Genre</h1>
                {
                    genres.map((genre) => (
                        <div key={genre} className="m-4">
                            <input
                                type="radio"
                                value={genre}
                                id={genre}
                                name="genre"
                                checked={selectedItems.genre === genre}
                                onChange={(e) => setSelectedItems({...selectedItems, genre: e.target.value})}
                                className={`mr-2 w-5 mb-1 h-5 `}
                            />
                            <label className={`${selectedItems.language === genre ? "font-bold" : ""}`} htmlFor={genre}>{genre}</label>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Sidebar