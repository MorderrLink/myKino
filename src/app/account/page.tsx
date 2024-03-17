"use client"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { SignOutButton, useSession } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { getDate } from "@/utils/dates"
import FilmCard from "@/components/FilmCard"
import Link from "next/link"
import HorizontalScroll from "@/components/HorizontalScroll"
import dynamic from "next/dynamic"






export default function Account() {
    const { session, isLoaded, isSignedIn } = useSession()
    const router = useRouter()



    useEffect(() => {
      if (isLoaded && !isSignedIn) {
        router.push('/')
      }
    }, [isLoaded, isSignedIn])


    const user = useQuery(api.users.getUserById, { userId: session?.user.id ?? "undefined" })
    const registerTime = getDate(user?._creationTime)    
    const expirationTime = getDate(user?.endsOn)
    
    const favouriteFilms = useQuery(api.users.getFavourite, { filmIds: user?.favourite ?? [] })
    const seenFilms = useQuery(api.users.getSeen, { filmIds: user?.seen ?? [] })


    
    const AccountModification = dynamic(() => import("@/components/AccountModification"), { ssr: false })

  return (
    <div className="w-full h-full min-h-screen px-4 py-5 bg-main-bg-color text-text-main font-Russo-one">
      <Header />
      
      <div className="w-full flex flex-row justify-between items-center border-y-[2px] border-opacity-10 border-gray-500 font-Caveat">
            <Button 
            variant={"ghost"} 
            className="hover:bg-transparent" 
            onClick={() => { void router.back() }}
            > {"<"} Назад </Button>

            <h1>Ваш Аккаунт</h1>
      </div>
      <div className="w-full flex flex-row px-3 py-4 lg:px-16 lg:py-10 font-Caveat">
        
        <img src={session?.user.imageUrl ?? ""} className="rounded-full w-24 h-24 lg:w-48 lg:h-48" alt="" />
        
        <div className="w-full lg:h-48 flex flex-col justify-end px-5 py-4 text-sm lg:text-base">
          <div className="flex flex-col justify-start lg:h-1/2">
            <h1 className="text-text-second">{user?.email}</h1>
            <h1>Регистрация: &nbsp; {registerTime}</h1>
          </div>
          <div className="flex flex-col justify-end lg:h-1/2">
            <h1>Любимый жанр: &nbsp; {user?.favouriteCategory}</h1>
            <h1  className="flex flex-row gap-1 items-center">Просмотры: &nbsp; {user?.seen.length} <MdOutlineRemoveRedEye/> </h1>
          </div>
        </div>
        
        <div className="hidden w-1/5 lg:h-48 lg:flex items-center justify-center px-5 py-4">
          <AccountModification  {...user} />
        </div>

      </div>

      <div className="flex w-full  lg:hidden items-center justify-center px-3 py-4 lg:px-16 ">
        <AccountModification  {...user} />
      </div>
      


      <div className="flex flex-row gap-5 items-center font-Caveat px-3 py-4 lg:px-16 ">
        {(isLoaded && user?.endsOn && user.endsOn > Date.now()) ?
        <h1 className="font-mono text-text-second text-lg">Подписка до {expirationTime}</h1>
        : <h1 className="font-mono text-text-second text-lg">Нет активной подписки</h1>
        }
        {(isLoaded && !user?.subscriptionId) && <Button className=" text-md font-medium bg-gradient-to-br from-primary via-primary-via to-primary hover:bg-primary-hover"><Link href={'/subscription'}>Оформить подписку</Link></Button>}
      </div>

      <HorizontalScroll className="min-h-[250px]" ID="222" heading="Последние просмотры">
        {seenFilms?.map(film => {
            return <FilmCard key={film._id} {...film}/>
          })}
        {user?.seen?.length == 0 && <div className="w-full min-h-[250px] flex items-center justify-center"> <h1 className="w-full text-center  font-Caveat text-text-second" >Нет просмотров</h1> </div>}
      </HorizontalScroll>

    {favouriteFilms?.length != 0 && 
    <HorizontalScroll ID="111" heading="Отмеченные">
      {favouriteFilms?.map((film) =>     
                    <FilmCard key={film._id} {...film}/>              
              )}
    </HorizontalScroll>
    }
        
      <div className="font-Caveat px-1 py-4 lg:px-16 flex flex-row gap-3">
        <Button className="bg-accent">
          <SignOutButton children={"Выйти из аккаунта"} />
        </Button>
      </div>



    </div>
  )
}
