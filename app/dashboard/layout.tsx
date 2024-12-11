import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import Logo from "@/public/main-logo.png";
import { DashboardLinks } from "../components/DashboardLinks";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import { ThemeToggle } from "../components/ThemeToggle";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { signOut } from "../utils/auth";
import { requireUser } from "../utils/hooks";
import prisma from "../utils/db";
import { redirect } from "next/navigation";

// setup redirecting user to onboarding
// if they dont have a username setup on their account
async function getData(userId: string ) {
  const data = await prisma.user.findUnique({
    // how do we get the user id
    // we have a const session = requireUser() hook
    // inside the session we have an id which we can again get through the params
    where: {
      id: userId, 
    },
    // now to grab the userId from our supabase database through Prisma
    select: {
      userName: true,
    }
  })

  if(!data?.userName) {
    return redirect("/onboarding")
  }
  return data
}

// our children is the page.tsx
// seems to be the children of the layout.tsx by default
// dashboard is in a route as a page , so must export default
export default async function DashboardLayout({
    children,
}: {
    children: ReactNode;
}) {
    // grabbing the user image from the session using the hook we wrote in our utils/hooks
    const session = await requireUser();

    const data = await getData(session.user?.id as string)

    return (
        <>
            {/* 1 fr is like 100% of the height with the 220px width */}
            <div className="min-h-screen w-full grid md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] ">
                <div className="hidden md:block border-r bg-muted/40 ">
                    <div className="flex h-full max-h-screen flex-col gap-2">
                        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 ">
                            <Link href="/" className="flex items-center gap-3">
                                <Image
                                    src={Logo}
                                    alt="Logo"
                                    className="size-8 "
                                />
                                <p className="text-xl font-bold">
                                    Kalundur 
                                    <span className="text-primary ">Wiz</span>
                                </p>
                            </Link>
                        </div>
                        <div className="flex-1 ">
                            <nav className="grid items-start px-2 lg:px-4 ">
                                <DashboardLinks />
                            </nav>
                        </div>
                    </div>
                </div>

                {/* this will render both top navbar and the main page in the route starting with /dashboard */}
                <div className="flex flex-col">
                    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    className="md:hidden shrink-0 "
                                    size="icon"
                                    variant="outline"
                                >
                                    <MenuIcon className="size-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="left"
                                className="flex flex-col "
                            >
                                <nav className="grid gap-2 mt-10 ">
                                    <DashboardLinks />
                                </nav>
                            </SheetContent>
                        </Sheet>
                        <div className="flex items-center ml-auto gap-x-4 ">
                            <ThemeToggle />

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="rounded-full"
                                    >
                                        <Image
                                            src={session?.user?.image as string}
                                            alt="Profile"
                                            width={20}
                                            height={20}
                                            className="w-full h-full rounded-full "
                                        />
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>
                                        My Account
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard/settings">
                                            Settings
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <form
                                            className="w-full"
                                            action={async () => {
                                                "use server";
                                                await signOut();
                                            }}
                                        >
                                            <button className="w-full text-left">
                                                Log out
                                            </button>
                                        </form>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </header>
                    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 ">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}
