"use client"
import { Progress } from "@/components/ui/progress"
import { FormEvent, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useEdgeStore } from '@/lib/edgestore'
import { SingleImageDropzone } from './SingleImage'
import { SingleFileDropzone } from './Singlefile'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"


const GENRES = ["Приключения", "Боевик", "Драма", "Комедия", "Триллер", "Хоррор"]



export default function FilmAddForm() {
    const { edgestore } = useEdgeStore()
    const filmMutation = useMutation(api.films.createFilm)

    const [thumbnailFile, setThumbnailFile] = useState<File>()
    const [filmFile, setFilmFile] = useState<File>()

    const [thumbnailFileProgress, setThumbnailFileProgress] = useState(0)
    const [filmFileProgress, setFilmFileProgress] = useState(0)

    const [error, setError] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [thumbnailURL, setThumbnailURL] = useState("")
    const [fileURL, setFileURL] = useState("")

    const [toggleItems, setToggleItems] = useState<string[]>([])
    
    function addToggleItem(category:string) {
        if (toggleItems.includes(category)) {
            setToggleItems((toggleItems) => toggleItems.filter(toggleItem => toggleItem != category))
        } else {
            setToggleItems([...toggleItems, category])
        }
    }





    const createFilm = async (e: FormEvent) => {
        e.preventDefault()
        const form = e.target as HTMLFormElement
        const formData = new FormData(form)
        const name = formData.get("name") as string
        const country = formData.get("country") as string
        const year = formData.get("year") as string
        const description = formData.get("description") as string
        const actors = formData.get("actors") as string
        const janres = formData.get("janres") as string


        if (thumbnailFile) {
            const resThumb = await edgestore.publicFiles.upload({
              file: thumbnailFile,
              onProgressChange: (progress) => {
                setThumbnailFileProgress(progress)
                
              },
            });
            setThumbnailURL(resThumb.url)
        } else {
            setError(true)
            return
        }
        if (filmFile) {
            const resFile = await edgestore.publicFiles.upload({
              file: filmFile,
              onProgressChange: (progress) => { 
                setFilmFileProgress(progress)
              },
            });
            setFileURL(resFile.url)
        } else {
            setError(true)
            return
        }
        await filmMutation({
            characters: actors ?? "",
            country: country,
            description: description,
            name: name,
            year: year,
            thumbnailUrl: thumbnailURL,
            fileUrl: fileURL,
            janres: toggleItems
        })

        setDisabled(false)
        form.reset()
        setError(false)
        setFileURL("")
        setFilmFile(undefined)
        setFilmFileProgress(0)
        setThumbnailFile(undefined)
        setThumbnailFileProgress(0)
        setThumbnailURL("")
        setToggleItems([])
        
    }


  return (
    <div className="w-full flex flex-col text-text-main">
        <form onSubmit={createFilm}>
        <div className="flex flex-col  text-text-main">
            <label htmlFor="name">Название</label>
            <Input disabled={disabled} type="text" name="name"  className='bg-second-bg-color font-Alegreya font-medium'/>
        </div>
        <div  className="flex flex-col  text-text-main">
            <label htmlFor="country">Страна</label>
            <Input disabled={disabled} type="text" name="country"  className='bg-second-bg-color'/>
        </div>

        <div  className="flex flex-col  text-text-main">
            <label htmlFor="year">Год</label>
            <Input disabled={disabled} type="text" name="year" className='bg-second-bg-color' />
        </div>

        <div  className="flex flex-col  text-text-main">
            <label htmlFor="description">Описание</label>
            <textarea disabled={disabled} name="description" className='bg-second-bg-color' />
        </div>
        <div className="flex flex-col  text-text-main">
            <label htmlFor="actors">Актеры</label>
            <Input disabled={disabled} type="text" name="actors" className='bg-second-bg-color'/>
        </div>
        <div className="flex flex-col text-text-main">
            <label htmlFor="janres">Жанры</label>
            <ToggleGroup type="multiple" className="flex flex-wrap justify-start">
                    {GENRES.map((category, index) => {
                        return (
                            <ToggleGroupItem className="bg-second-bg-color  hover:bg-accent p-[5px] lg:p-2" key={index}  value={category} onClick={() => { addToggleItem(category) }}>
                            <h1 className="text-sm lg:text-base">{category}</h1>
                        </ToggleGroupItem>)
                    })}
                    
                    
            </ToggleGroup>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">

            <div  className="flex flex-col text-text-main">
                <label htmlFor="thumbnail">Thumbnail</label>
                <SingleImageDropzone 
                disabled={disabled}
                className='bg-second-bg-color'
                width={350}
                height={200}
                value={thumbnailFile}
                onChange={(file) => {
                setThumbnailFile(file);
                }}/>
                <Progress className="bg-transparent h-[5px]" value={thumbnailFileProgress}/>
            </div>

            <div  className="flex flex-col  text-text-main">
                <label htmlFor="fileFile">Film file</label>
                <SingleFileDropzone 
                disabled={disabled}
                className='bg-second-bg-color'
                width={350}
                height={200}
                value={filmFile}
                onChange={(file) => {
                setFilmFile(file);
                }}
                />
                <Progress className="bg-transparent h-[5px]" value={filmFileProgress}/>
            </div>

        </div>


        <Button disabled={disabled}>Create</Button>
        </form>
    </div>
  )
}
