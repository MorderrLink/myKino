"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { useRef } from "react"



const GENRES = ["Приключения", "Боевик", "Драма", "Комедия", "Триллер", "Хоррор"]





export default function AccountModification(user: any) {
    const nameChangeRef = useRef<HTMLInputElement | null>(null)
    const favouriteMutation = useMutation(api.users.setFavouriteCategory)
    const nameMutation = useMutation(api.users.nameChange)

    async function handleFavouriteGenre(category: string) {
        await favouriteMutation({
          category: category
        })
      }
      async function handleNameChange() {
        const newName = nameChangeRef.current?.value
        if (newName === user?.email ?? !newName) {
          return
        }
  
        await nameMutation({
          newName: newName
        })
  
  
      }



  return (
    <Drawer >
            <DrawerTrigger>
              <Button  className="w-full text-md font-medium bg-gradient-to-br from-primary via-primary-via to-primary hover:bg-primary-hover" >Редактировать</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="">
                <DrawerTitle>Редактирование данных</DrawerTitle>
                
              </DrawerHeader>

              <div className="px-4 py-2">
                  <div className="flex flex-col p-2">
                    <h1>Выбрать любимый жанр</h1>
                    <Select onValueChange={(value) => handleFavouriteGenre(value)}>
                      <SelectTrigger className="bg-second-bg-color border-none outline-none">
                        <SelectValue placeholder={user?.favouriteCategory} />
                      </SelectTrigger>
                      <SelectContent className="bg-second-bg-color text-text-main border-none shadow-lg">
                      { GENRES.map(genre => {
                        return <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                      }) }
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col p-2">
                      <h1>Сменить имя</h1>
                      <Input ref={nameChangeRef} className="bg-second-bg-color text-text-main border-none shadow-lg" defaultValue={user?.email}/>
                  </div>

              </div>

              <DrawerFooter className="w-full pb-5">
              
                <DrawerClose>
                  <Button onClick={handleNameChange} className="w-full text-md font-medium bg-gradient-to-br from-primary via-primary-via to-primary hover:bg-primary-hover">Сохранить</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
  )
}
