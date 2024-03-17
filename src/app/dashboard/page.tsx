"use client"

import FilmAddForm from "@/components/FilmAddForm";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";




export default function dashboard() {
    const router = useRouter()
  return (
    <div className="w-full h-full min-h-screen px-4 py-5 bg-main-bg-color text-text-main font-Russo-one">
        <Header />
        <div className="w-full flex flex-row justify-between items-center border-y-[2px] border-opacity-10 border-gray-500 font-Caveat">
            <Button 
            variant={"ghost"} 
            className="hover:bg-transparent" 
            onClick={() => { void router.back() }}
            > {"<"} Назад </Button>

            <h1>Админ Панель</h1>
        </div>
        <FilmAddForm />
    </div>
  )
}
