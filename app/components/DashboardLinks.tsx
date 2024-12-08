"use client";

import { cn } from "@/lib/utils";
import {
    CalendarCheck,
    HomeIcon,
    LucideProps,
    Settings2,
    Users2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ForwardRefExoticComponent, RefAttributes } from "react";

interface sidebarProps {
    id: number;
    name: string;
    href: string;
    icon: ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
}

export const dashboardLinks: sidebarProps[] = [
    {
        id: 0,
        name: "Event Types",
        href: "/dashboard",
        icon: HomeIcon,
    },
    {
        id: 1,
        name: "Meetings",
        href: "/dashboard/meetings",
        icon: Users2,
    },
    {
        id: 2,
        name: "Availability",
        href: "/dashboard/availability",
        icon: CalendarCheck,
    },
    {
        id: 3,
        name: "Settings",
        href: "/dashboard/settings",
        icon: Settings2,
    },
];

// we are going to render our arrays into the dashboard links
// loop through them

export function DashboardLinks() {
    // we need to grab the url path for the current active tab to show the active tab with bg color
    // the url needs to match , next js provides an easy way to do this from next/navigation
    // again this usePathname() hook relies on js bundle, so we have to "use client" at the top of the file
    const pathname = usePathname();
    return (
        <>
            {dashboardLinks.map((link) => {
                // always pass a key when mapping over smth in React
                return (
                    <Link
                        className={cn(
                            pathname === link.href
                                ? "text-primary bg-primary/10"
                                : "text-muted-foreground hover:text-foreground", 
                            // the class added below fixes if its active or not active case
                            // makes it applicable no matter what condition
                            "flex items-center font-bold gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ", 
                        )}
                        key={link.id}
                        href={link.href}
                    >
                        <link.icon className="size-4 " />
                        {link.name}
                    </Link>
                );
            })}
        </>
    );
}
