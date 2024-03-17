import React from 'react'
import { CiCircleChevLeft, CiCircleChevRight } from "react-icons/ci";
import { motion } from "framer-motion"
import { Button } from './ui/button';

type ScrollProps = {
    children: React.ReactNode;
    ID: string;
    heading: string;
    className?: string;
}

export default function HorizontalScroll({children, ID, heading, className}: ScrollProps) {

    const handleScrollRight = () => {
        const element = document.getElementById(ID);
        if (element) {
          element.scrollLeft += 400; 
        }
      };
      const handleScrollLeft = () => {
        const element = document.getElementById(ID);
        if (element) {
          element.scrollLeft -= 400; 
        }
      };




  return (
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 2 }} viewport={{ once: true }} className={`w-full px-2 py-5 flex flex-col items-start relative ${className}`}>
            <Button variant={"link"} className='z-50'>{heading} {">"}</Button>
            <div id={ID} className="z-50 w-full relative flex flex-row gap-4 py-2 overflow-x-auto scroll-smooth scroll-m-20 scrollarea">
                {children}
            </div>
            <div className="absolute inset-[10px] pt-6 flex items-center justify-between">
                <button onClick={handleScrollLeft} className="z-50 bg-transparent hover:bg-black hover:bg-opacity-30 hidden lg:block rounded-full py-1 px-1"><CiCircleChevLeft className="h-12 w-12" fill="#d12c2c"/></button>
                <button onClick={handleScrollRight} className="z-50 bg-transparent hover:bg-black hover:bg-opacity-30 hidden lg:block rounded-full py-1 px-1"><CiCircleChevRight className="h-12 w-12" fill="#d12c2c"/></button>
            </div>
        </motion.div>
  )
}
