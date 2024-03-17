"use client"
import Header from "@/components/Header";
import SearchInput from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SignInButton, useSession } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import Link from "next/link";
import { api } from "../../convex/_generated/api";
import FilmCard from "@/components/FilmCard";
import { useRouter } from "next/navigation";
import { CiCircleChevLeft, CiCircleChevRight } from "react-icons/ci";
import { motion } from "framer-motion"
import dynamic from "next/dynamic";





export default function Home() {

  const { isSignedIn, isLoaded } = useSession()
  const router = useRouter()
  const films = useQuery(api.films.getFilms)


  

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


  const InfoBlock = dynamic(() => import("@/components/InfoBlock"), {ssr: false})

  return (
    <div className="w-full h-full min-h-screen px-4 py-5 bg-main-bg-color font-Russo-one">
      <Header />
      <div className="w-full flex lg:flex-row flex-col min-h-max">


        <div className="w-full lg:w-5/12  lg:px-4 py-8 flex flex-col gap-5">
          <SearchInput className="w-full lg:w-10/12"/>
          <div className="bg-second-bg-color rounded-md px-3 py-2 flex flex-wrap w-full lg:w-10/12">
          <h1 className="text-text-main">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore quis doloremque perferendis molestias perspiciatis, similique rem culpa. Dolorem quia facere hic molestiae nesciunt rem est, nisi ratione quos, amet accusamus.
            <blockquote className="my-2 lg:my-6 border-l-2 pl-6 italic">
              "After all," he said, "everyone enjoys a good joke, so it's only fair that
              they should pay for the privilege."
            </blockquote>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad quo dolorum mollitia, facilis laborum at dicta quam delectus placeat perspiciatis, repudiandae quae odio necessitatibus deserunt voluptates corrupti commodi sit quibusdam?
          </h1>
          </div>
          <div className="w-full lg:w-10/12 flex flex-row gap-4 ">
            
            <Button className="w-7/12 text-md font-medium bg-gradient-to-br from-primary via-primary-via to-primary hover:bg-primary-hover hover:scale-[101%] transition-all ">
              <Link href={'/subscription'} onClick={() => { void router.push('/subscription') }}>Купить подписку</Link>
            </Button>
            
            <Button className={`bg-gradient-to-r from-accent to-accent-via hover:scale-[99%] transition-all w-5/12 text-md font-medium overflow-hidden ${!isLoaded && "p-0"}`} >
              { isLoaded ? (isSignedIn ? <Link href={`/account`} onClick={() => { void router.push('/account') }}>Аккаунт</Link> : <SignInButton mode="modal" children={"Войти"} />) : <Skeleton className="w-[1000px] h-[500px] bg-accent-via"/> }
            </Button>
          </div>
        </div>

            <motion.div className="relative w-full lg:w-7/12 h-[500px] bg-cover bg-center rounded-3xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}>
              <InfoBlock />
            </motion.div>


          </div>


      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 2 }} viewport={{ once: true }} className="w-full px-2 py-5 flex flex-col items-start">
        
        <Button variant={"link"} >Новинки {">"}</Button>
        <div  id="scrollarea" className="w-full relative flex flex-row gap-4 py-2 overflow-x-auto scroll-smooth scroll-m-20 scrollarea">


              {films?.map((film) =>     
                    <FilmCard {...film}/>              
              )}
        </div>
        <button onClick={handleScrollLeft} className="z-50 bg-transparent absolute bottom-0 hidden lg:block lg:bottom-[160px] left-1 hover:bg-black hover:bg-opacity-30 rounded-full py-1 px-1"><CiCircleChevLeft className="h-12 w-12" fill="#d12c2c"/></button>
        <button onClick={handleScrollRight} className="z-50 bg-transparent absolute bottom-0 hidden lg:block lg:bottom-[160px] right-1 hover:bg-black hover:bg-opacity-30 rounded-full py-1 px-1"><CiCircleChevRight className="h-12 w-12" fill="#d12c2c"/></button>
      </motion.div>

    </div>

  );
}
