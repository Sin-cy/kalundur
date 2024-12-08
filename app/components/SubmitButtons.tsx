"use client";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import GoogleLogo from "@/public/google.svg"
import GithubLogo from "@/public/github.svg"
import Image from "next/image";
import { Loader2 } from "lucide-react";

export function GoogleAuthButton() {
    // get the pending state
    // in next js we can use a hook
    
    // NOTE: this require js or client side bundle to work, its not a server component
    // so we must say "use client" at the top of the file
    const {pending} = useFormStatus() 

    return (
        <>
            { pending ? (
                <Button disabled variant="outline" className="w-full " >
                    <Loader2 className="size-4 mr-2 animate-spin" /> Please wait
                </Button>
            ): (
                <Button variant="outline" className="w-full ">
                        <Image src={GoogleLogo} alt="Google Logo" className="size-4 mr-2" /> 
                        Sign in with Google
                </Button>
            )}
        </>
    )

} 

export function GithubAuthButton() {
    // NOTE: this require js or client side bundle to work, its not a server component
    // so we must say "use client" at the top of the file
    const {pending} = useFormStatus() 

    return (
        <>
            { pending ? (
                <Button disabled variant="outline" className="w-full " >
                    <Loader2 className="size-4 mr-2 animate-spin" /> Please wait
                </Button>
            ): (
                <Button variant="outline" className="w-full ">
                        <Image src={GithubLogo} alt="Github Logo" className="size-4 mr-2" /> 
                        Sign in with Github
                </Button>
            )}
        </>
    )
} 
