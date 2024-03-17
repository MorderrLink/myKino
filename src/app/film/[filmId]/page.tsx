"use client"
import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { useMutation, useQuery } from 'convex/react'
import { usePathname, useRouter } from 'next/navigation'
import { api } from '../../../../convex/_generated/api'
import { useEffect, useRef, useState } from 'react'
import { useSession } from '@clerk/nextjs'


export default function filmPage() {
    const pathname = usePathname()
    const filmId = pathname.slice(6)
    const router = useRouter()
    const [subscribed, setSubscribed] = useState<boolean | undefined>(undefined)
    const [seen, setSeen] = useState<boolean>(false)

    const { session, isLoaded } = useSession()
    const userData = useQuery(api.users.getUserById, { userId: session?.user.id! })

    const addSeenMutation = useMutation(api.users.addToSeen)

    const user = userData
    useEffect(() => {
      if (isLoaded && user?.endsOn && user.endsOn > Date.now()) {
        setSubscribed(true)
      } else if (isLoaded && user?.endsOn && user.endsOn < Date.now()) {
        setSubscribed(false)
      }

      if (isLoaded && user?.seen.includes(filmId)) {
        setSeen(true)
      } else {
        setSeen(false)
      }
    }, [userData])

    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'f') {
          const videoElement = document.querySelector('video');
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else if (videoElement?.requestFullscreen) {
            videoElement.requestFullscreen();
          }
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
   }, []);


    const filmData = useQuery(api.films.getFilmById, { filmId: filmId })
    const film = filmData?.[0]


     const handleTimeUpdate = async (event:any) => {
      const currentTime = event.target.currentTime;
      if (currentTime > 300 && !seen) {
        setSeen(true)
        await addSeenMutation({
          filmId: filmId
        })
        
      }
   };

  return (
    <div className="w-full h-full min-h-screen px-4 py-5 bg-main-bg-color text-text-main font-Russo-one">
      <Header />
      <div className="w-full flex flex-row justify-between items-center border-y-[2px] px-5 border-opacity-10 border-gray-500 font-Caveat">
            <Button 
            variant={"ghost"} 
            className="hover:bg-transparent" 
            onClick={() => { void router.back() }}
            > {"<"} Назад </Button>

            <h1 className='lg:mr-8 text-xl'>{film?.name}</h1>
      </div>

      {/* UNAUTHED or HAS NO SUB */}
      { (!userData ?? !userData?.endsOn ?? userData.endsOn < Date.now()) &&
      <div className='font-Caveat text-xl flex justify-center py-3'>
        <h1>У вас нет <span className='font-mono text-lg text-text-second px-2'>активной подписки</span> или вы <span className='font-mono text-lg text-text-second px-2'>не авторизованы</span></h1>
      </div> 
      }

      <div className={`flex justify-center relative py-4 lg:px-2 pt-10 lg:pt-4`}>
        <video onTimeUpdate={handleTimeUpdate} className={`w-full lg:w-[70%] h-auto aspect-video active:border-none outline-none `} autoPlay={false} controls={subscribed ?? false} src={film?.fileUrl} poster={film?.thumbnailUrl} ></video>
      </div>
      <div className='w-full px-4 py-5 flex flex-col  items-center justify-center'>
        <h1 className='w-full font-Caveat text-lg  lg:text-2xl text-primary'>Описание фильма</h1>
        <div className='flex flex-col lg:flex-row gap-5 py-3 px-2'>
            <div className='lg:w-1/2 border-[1px] border-none text-2xl'>
                <h1 className='font-mono'>Название: <span className='font-Russo-one'>{film?.name}</span> </h1>
                <h1 className='font-mono'>Жанр: <span className='font-Russo-one'>{film?.janres}</span> </h1>
                <h1 className='font-mono'>Год: <span className='font-Russo-one'>{film?.year}</span> </h1>
                <h1 className='font-mono'>Страна: <span className='font-Russo-one'>{film?.country}</span> </h1>
                <h1 className='font-mono'>В ролях: <span className='font-Russo-one'>{film?.characters}</span></h1>
                <h1 className='font-mono'>Рейтинг: <span className={`${(film?.rating && film?.rating > 5) ? "text-green-500" : "text-red-700"} font-Russo-one font-extrabold`}>{film?.rating?.toFixed(2)}</span> </h1>
            </div>

            <div className="lg:border-l-[2px] border-b-[2px] border-b-primary lg:border-l-primary  lg:h-auto"></div>

            <div  className='lg:w-1/2 border-[1px] border-none text-xl lg:text-5xl flex text-wrap flex-wrap overflow-hidden font-Alegreya '>
                <p>{film?.description}</p>
            </div>
        </div>
      </div>

    </div>
  )
}
