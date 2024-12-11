"use client";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import GoogleLogo from "@/public/google.svg";
import GithubLogo from "@/public/github.png";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Created for adding a form Submit button
interface buttonProps {
    text: string;
    variant?:
        | "link"
        | "default"
        | "destructive"
        | "outline"
        | "secondary"
        | "ghost"
        | null
        | undefined;
    className?: string; //gives us option to decided maybe the button width should be full
}

// Created for a form Submit button
// with added conditions for pending state
// cn for checking if the user specified the w-fit else w-full ???
export function SubmitButton({ text, variant, className }: buttonProps) {
    // using the pending state form useFormStatus()
    const { pending } = useFormStatus();

    return (
        <>
            {pending ? (
                <Button disabled variant="outline" className={cn("w-fit", className)}>
                    <Loader2 className="mr-2 size-4 animate-spin" /> Hold on...
                </Button>
            ) : (
                <Button
                    type="submit"
                    variant={variant}
                    className={cn("w-fit", className)} // w-fit when user dont provide classname, else it will be overwritten by w-full
                >
                    {text}
                </Button>
            )}
        </>
    );
}

export function GoogleAuthButton() {
    // get the pending state
    // in next js we can use a hook

    // NOTE: this require js or client side bundle to work, its not a server component
    // so we must say "use client" at the top of the file
    const { pending } = useFormStatus();

    return (
        <>
            {pending ? (
                <Button disabled variant="outline" className="w-full">
                    <Loader2 className="mr-2 size-4 animate-spin" /> Please wait
                </Button>
            ) : (
                <Button variant="outline" className="w-full">
                    <Image
                        src={GoogleLogo}
                        alt="Google Logo"
                        className="mr-2 size-4"
                    />
                    Sign in with Google
                </Button>
            )}
        </>
    );
}

export function GithubAuthButton() {
    // NOTE: this require js or client side bundle to work, its not a server component
    // so we must say "use client" at the top of the file
    const { pending } = useFormStatus();

    return (
        <>
            {pending ? (
                <Button disabled variant="outline" className="w-full">
                    <Loader2 className="mr-2 size-4 animate-spin" /> Please wait
                </Button>
            ) : (
                <Button variant="outline" className="w-full">
                    <Image
                        src={GithubLogo}
                        alt="Github Logo"
                        className="mr-2 size-4"
                    />
                    Sign in with Github
                </Button>
            )}
        </>
    );
}
