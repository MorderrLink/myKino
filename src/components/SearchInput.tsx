
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation";
import { IoIosSearch } from "react-icons/io";

type SearchInputProps = {
    className?: string;
}

export default function SearchInput({className}: SearchInputProps) {

  const router = useRouter()

  return (
    <div className={`flex flex-row items-center gap-2 ${className}`}>
        <Input onFocus={() => void router.push('/search')} placeholder="Перейти к поиску" className={`w-full bg-second-bg-color rounded-xl border-none cursor-pointer text-text-main text-md px-5 py-2 `}/> 
        <Button onClick={() => void router.push('/search')} className="bg-second-bg-color rounded-full p-2 flex justify-center items-center">
          <IoIosSearch className="text-text-main w-6 h-6 rounded-full "/>
        </Button>
    </div>
  )
}
