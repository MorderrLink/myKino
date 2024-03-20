"use client"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import {  SignInButton, useSession } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";


export default function subscription() {

    const { isSignedIn, session } = useSession()
    const router = useRouter()
    const pay = useAction(api.stripe.pay)
    async function handleSubscription(period:string) {
        if(!isSignedIn) {
            toast.warning("Вы не вошли в аккаунт!", {
                action: {
                    label: <SignInButton   children={<h1 className="font-Caveat">Войти</h1>}/>,
                    onClick: () => {},

                }
            })
               
            return
        }
        const url = await pay({payId: period})
        void router.push(url)
    }



  return (
    <div className="w-full h-full min-h-screen px-10 py-5 bg-main-bg-color text-text-main font-Russo-one">
        <Header />
        <div className="w-full flex flex-row justify-between items-center border-y-[2px] border-opacity-10 border-gray-500 font-Caveat">
            <Button 
            variant={"ghost"} 
            className="hover:bg-transparent" 
            onClick={() => { void router.back() }}
            > {"<"} Назад </Button>

            <h1>Подписка</h1>
        </div>
        <h1 className="text-text-main text-4xl p-4 font-Caveat flex lg:justify-center text-center"> Оформите подписку чтобы иметь доступ ко всем фильмам и сериалам</h1>

        <div className="container flex flex-col lg:flex-row w-full gap-3">

            <div className="w-full lg:w-1/3 bg-accent text-text-main p-6 rounded-lg shadow-lg flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-2">Месячная подписка</h2>
                <p className="text-xl mb-4">На 30 дней</p>
                <p className="text-4xl font-bold mb-6">349,99 ₽</p>
                <Button  onClick={() => handleSubscription("30")} className="bg-gradient-to-br from-primary via-primary-via to-amber-600 text-text-second font-bold py-2 px-4 rounded">
                    Подписаться
                </Button>
            </div>

            <div className="w-full lg:w-1/3 bg-accent-hover text-text-main p-6 rounded-lg shadow-lg flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-2">Годовая подписка</h2>
                <p className="text-xl mb-4">На 365 дней</p>
                <p className="text-4xl font-bold mb-6">3499,99 ₽</p>
                <Button onClick={() => handleSubscription("365")}   className="bg-gradient-to-br from-primary via-primary-via to-amber-600 text-text-second font-bold py-2 px-4 rounded">
                    Подписаться
                </Button>
            </div>


            <div className="w-full lg:w-1/3 bg-accent-via text-text-main p-6 rounded-lg shadow-lg flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-2">3-месячная подписка</h2>
                <p className="text-xl mb-4">На 90 дней</p>

                <p className="text-4xl font-bold mb-6">999,99 ₽</p>
                <Button  onClick={() => handleSubscription("90")}   className="bg-gradient-to-br from-primary via-primary-via to-amber-600 text-text-second font-bold py-2 px-4 rounded">
                    Подписаться
                </Button>
            </div>

        </div>

        
    </div>
  )
}
