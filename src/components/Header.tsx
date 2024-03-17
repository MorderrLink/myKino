"use client"
import Link from "next/link";
import { RxHamburgerMenu } from "react-icons/rx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { IoHomeOutline, IoSearchOutline, IoCardOutline, IoPersonOutline, IoLogInOutline } from "react-icons/io5";
import { SignOutButton, useSession } from "@clerk/nextjs";


type HeaderProps = {
  onClick?: () => void;

}

export default function Header({onClick}: HeaderProps) {

  const { session } = useSession()

  return (
    
    <div onClick={onClick} className="flex  justify-between items-center px-8 lg:px-40 lg:py-5 py-4">
      
      <div className="flex flex-row">
        <Link href="/" className="font-Caveat text-primary font-extrabold text-2xl lg:text-5xl">моёКино</Link>
        <img src="/logo.png" alt="" className="w-8 h-8" />
      </div>

      <Popover >

        <PopoverTrigger className="hover:bg-accent p-2 rounded-md duration-200">
          <RxHamburgerMenu className="text-text-main h-6 w-6 "/>  
        </PopoverTrigger>

        <PopoverContent className="flex flex-col gap-2 justify-start bg-second-bg-color text-text-main font-Caveat border-none shadow-2xl mr-1 lg:mr-0">

          <div className="flex flex-row gap-1 items-center ">
            <IoHomeOutline className="text-[#d12c2c]"  fill="#d12c2c"/>
            <Link className="w-full hover:text-accent-hover duration-150" href={'/'}>Главная</Link>
          </div>
          <div className="flex flex-row gap-1 items-center ">
            <IoSearchOutline className="text-[#d12c2c]"  fill="#d12c2c"/>
            <Link className="w-full hover:text-accent-hover duration-150" href={'/search'}>Поиск</Link>
          </div>
          <div className="flex flex-row gap-1 items-center ">
            <IoCardOutline className="text-[#d12c2c]"  fill="#d12c2c"/>
            <Link className="w-full hover:text-accent-hover duration-150" href={'/subscription'}>Подписка</Link>
          </div>
          <div className="flex flex-row gap-1 items-center justify-between pr-2 ">
            <div className="flex flex-row items-center gap-1">
              {session?.user ? <img className="w-5 h-5 rounded-full" src={session.user.imageUrl}/> : <IoPersonOutline className="text-[#d12c2c]" fill="#d12c2c" />}
              <Link className="w-full hover:text-accent-hover duration-150" href={'/account'}>Аккаунт</Link>
            </div>
            <SignOutButton children={ <IoLogInOutline className="text-accent-hover w-5 h-5 cursor-pointer hover:text-primary duration-150"/> }/>
          </div>

        </PopoverContent>

      </Popover>



    </div>
  )
}
