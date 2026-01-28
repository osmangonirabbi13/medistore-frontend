import { SignupForm } from "@/components/layouts/authentication/signup-form"
import Image from "next/image"
import Link from "next/link"
import { House } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
         <Link href="/" className="flex items-center gap-2 font-medium">
            <div className=" flex size-6 items-center justify-center">
            </div>
            <button>
                <div className="flex justify-center gap-2  cursor-pointer outline-1 p-4  hover:bg-black hover:text-amber-50 dark:hover:bg-white dark:hover:text-black">
                    <div><House/></div>
                <div>Back To Home</div>
                </div>
                
            </button>
            
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignupForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/regi.jpg"
          alt="Image"
          fill
          priority
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}