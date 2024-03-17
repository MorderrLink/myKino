"use client"
import Link from "next/link";
import { Button } from "./ui/button";

import { IoBookmarkOutline } from "react-icons/io5";
import { IoBookmark } from "react-icons/io5";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useSession } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type FilmCardProps = {
    name?: string;
    country?: string;
    year?: string;
    janres?: string[];
    thumbnailUrl?: string;
    characters?: string;
    _id?: any;

}

export default function FilmCard(props: FilmCardProps) {
    
    const { session } = useSession()

    const user = useQuery(api.users.getUserById, { userId: session?.user.id as string })

    const [isFavourite, setFavourite] = useState<boolean>()
    useEffect(() => {
        if (user?.favourite.includes(props._id)) {
            setFavourite(true)
        } else {
            setFavourite(false)
        }
            
    })

    const addFavouriteMutation = useMutation(api.users.addToFavourite)
    const removeFavouriteMutation = useMutation(api.users.removeFromFavourite)
    function handleFavourite () {
        if (!user) {
            toast.error("Вы не авторизованы")
            return
        }
        if (user?.favourite.includes(props._id!)) {
            console.log("REMOVING")
            removeFavouriteMutation({
                filmId: props._id
            })
        } else {
            addFavouriteMutation({
                filmId: props._id
            })
        }
    }



  return (
    <div className="relative min-w-[330px] max-w-[330px] lg:min-w-[400px] lg:max-w-[450px] h-48  lg:h-64 overflow-hidden rounded-lg shadow-lg">
            <img src={props.thumbnailUrl ?? ""} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-75 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col p-5 justify-between items-start text-white text-center">
                <div className="flex flex-col items-start justify-center"> {/* Контент  */}
                    <h1 className="text-2xl font-bold mb-2">{props.name}</h1>
                    <div className="flex flex-row items-center gap-[5px]">
                    <h2>{props.country}</h2>
                    &middot;
                    <h3>{props.year}</h3>
                    &middot;
                    <h4>{props.janres?.join(", ")}</h4>
                    </div>
                    <h1>В ролях: {props.characters}</h1>

                </div>

                <div className="flex flex-row gap-3 items-center"> {/* Кнопки  */}
                    <Button><Link href={`/film/${props._id}`}>Смотреть</Link></Button>
                    <Button className="bg-second-bg-color" onClick={handleFavourite}> {isFavourite ?  <IoBookmark fill="#d12c2c"/> :  <IoBookmarkOutline />} </Button>
                </div>

            </div>
        </div>
  )
}

