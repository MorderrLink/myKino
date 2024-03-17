"use client"

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";
import FilmCard from "@/components/FilmCard";
import { CiCircleChevLeft, CiCircleChevRight } from "react-icons/ci";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";




const GENRES = [
    { name: "Приключения", src: "/adventure.png" },
    { name: "Боевик", src: "/action.png" },
    { name: "Драма", src: "/Drama.png" },
    { name: "Комедия", src: "/comedy.png" },
    { name: "Триллер", src: "/thriller.png" },
    { name: "Хоррор", src: "/horror.png" }
]



export default function Search() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [isInputFocused, setIsInputFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const [filter, setFilter] = useState<string | undefined>(undefined)

    const films = useQuery(api.films.getFilms);
    const searchResults = useQuery(api.films.searchMovies, {searchTerm: searchTerm});

    const filterFilms = useQuery(api.films.filteredMovies, { genre: filter })

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          inputRef.current?.blur();
          setIsInputFocused(false);
        }
     };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
          document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);


    const handleScrollRight = () => {
        const element = document.getElementById('scrollarea');
        if (element) {
          element.scrollLeft += 400; 
        }
      };
      const handleScrollLeft = () => {
        const element = document.getElementById('scrollarea');
        if (element) {
          element.scrollLeft -= 400; 
        }
      };


  return (
    <div className="w-full h-full min-h-screen px-4 py-5 bg-main-bg-color text-text-main font-Russo-one flex flex-col ">
        <Header onClick={() => setIsInputFocused(false) } />
        
        <div className="w-full flex justify-center">
            <div className={`relative w-full lg:w-1/2 flex flex-row items-center gap-2`}>
                <Input 
                ref={inputRef}
                onFocus={() => setIsInputFocused(true) }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Найти фильм" 
                className={`w-full bg-second-bg-color rounded-xl border-none text-text-main text-md px-5 py-2 `}/> 

            </div>

            <div  className={`absolute border-[1px] border-accent z-50 bg-second-bg-color rounded-lg px-5 py-3 w-full lg:w-1/2 top-[134px] lg:top-[150px] flex flex-col gap-3 ${isInputFocused ? "block" : "hidden"} ${searchResults?.length == 0 && "hidden"}`}>
                {searchResults?.map(res => {
                    return (
                        <div key={res._id} 
                            onClick={() => {
                                void router.push(`/film/${res._id}`)
                            }} 
                            className="flex flex-row justify-start items-center gap-2 hover:bg-white hover:bg-opacity-5 rounded-lg cursor-default"
                            >
                            <img src={res.thumbnailUrl} className="rounded-lg w-14 h-14" alt="" />
                            <div className="flex flex-col  justify-start">
                                <h1>{res.name}</h1>
                                <p className="text-text-second"> {res.janres.join(", ")} &middot; {res.country} &middot; {res.year} </p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>

        <div onClick={(e) => {
            e.preventDefault()
            setIsInputFocused(false)} } 
            className="w-full min-h-[500px] flex items-center justify-center gap-5"
        >
            { filter ? <div className="w-full flex flex-col flex-wrap gap-2 justify-start font-Caveat">
                <div className="flex flex-row gap-2 items-center">
                    <h1 className="text-lg text-text-second">Категория: {filter}</h1>
                    <Button variant={"link"} onClick={() => setFilter(undefined)} >Очистить фильр</Button>
                </div>
                <div className="min-h-[250px] w-full flex flex-row flex-wrap gap-2 justify-start">
                {filterFilms?.map(film => {
                    return <FilmCard {...film} />
                })}
                {filterFilms?.length == 0 && <h1 className="w-full flex justify-center items-center text-center">Ничего не найдено...</h1>}
                </div>
            </div>
            : <div className="w-full flex items-center flex-wrap lg:flex-nowrap justify-center gap-5 py-2">
                {GENRES.map(genre => {
                return <div onClick={() => setFilter(genre.name)} className="relative rounded-lg hover:scale-105 duration-200 cursor-pointer bg-second-bg-color p-3 w-[150px] h-[200px] lg:w-[250px] lg:h-[350px]">
                    <h1 className="w-full text-center flex justify-center text-lg lg:text-3xl p-3 text-primary font-Caveat">{genre.name}</h1>
                    <img src={genre.src} className="filter brightness-0 saturate-200 invert " alt={genre.name} />
                    <div className="absolute inset-0"></div>
                </div>
            })}
            </div>  }
            

            
        </div>


        <motion.div onClick={() => setIsInputFocused(false) } initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 2 }} viewport={{ once: true }} className="w-full px-2 py-5 flex flex-col items-start">
        
            <Button variant={"link"} >Новинки {">"}</Button>
            <div  id="scrollarea" className="w-full relative flex flex-row gap-4 py-2 overflow-x-auto scroll-smooth scroll-m-20 scrollarea">


                {films?.map((film) =>     
                        <FilmCard {...film}/>              
                )}
            </div>
            <button onClick={handleScrollLeft} className="z-50 bg-transparent absolute bottom-0 hidden lg:block lg:bottom-[100px] left-1 hover:bg-black hover:bg-opacity-30 rounded-full py-1 px-1"><CiCircleChevLeft className="h-12 w-12" fill="#d12c2c"/></button>
            <button onClick={handleScrollRight} className="z-50 bg-transparent absolute bottom-0 hidden lg:block lg:bottom-[100px] right-1 hover:bg-black hover:bg-opacity-30 rounded-full py-1 px-1"><CiCircleChevRight className="h-12 w-12" fill="#d12c2c"/></button>
        </motion.div>


    </div>
  )
}
