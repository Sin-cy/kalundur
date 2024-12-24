// Its important to Name the file page.tsx or else it wont be converted to a route
// Our goal is to make the dashboard page route SO YEAH!

import { notFound } from "next/navigation";
import prisma from "../utils/db";
import { requireUser } from "../utils/hooks";
import { EmptyState } from "../components/EmptyState";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExternalLink, Link2, Pen, Settings2, Trash, User2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CopyLinkMenuItem from "../components/CopyLinkMenu";
import { MenuActiveSwitch } from "../components/EventTypeSwitcher";

async function getData(userId: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      userName: true,
      eventType: {
        select: {
          id: true,
          active: true,
          title: true,
          url: true,
          duration: true,
        },
      },
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

// Bacuz this is a Route, we have to do export default
// marking this func as async is safe, everything is on the server cuz we are using react server components (rsc)
// read more at docs next.js server components
// nth is sent to the client side
export default async function DashboardPage() {
  // checks if the user has a session, if not then return *** redirect from next navigation ***
  const session = await requireUser();
  // grabs the data into the client/front end
  const data = await getData(session.user?.id as string);

  return (
    <>
      {data.eventType.length === 0 ? (
        <EmptyState
          title="You have no Event Types"
          description="You can create your first event type by clicking the button below "
          buttonText="Add Event Type"
          href="/dashboard/new"
        />
      ) : (
        <>
          <div className="flex items-center justify-between px-2">
            <div className="hidden gap-y-1 sm:grid">
              <h1 className="text-3xl font-semibold md:text-4xl">
                Event Types
              </h1>
              <p className="text-muted-foreground">
                Create an manage your events on this page.
              </p>
            </div>
            {/* whenever you render a component in a button, always add as child property */}
            <Button asChild>
              <Link href="/dashboard/new">Create New Event</Link>
            </Button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.eventType.map((item) => (
              // when ever mapping over data in react always provide a unique identifier in this case is the key
              <div
                key={item.id}
                className="show relative overflow-hidden rounded-lg border"
              >
                {/* NOTE: Drop down menu section */}
                <div className="absolute right-2 top-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                      >
                        <Settings2 className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel> Event </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>

                        <DropdownMenuItem asChild>
                          {/* HACK: the booking route will look similar to this localhost:3000/username/even-url */}
                          {/* this is why we redirect the user to this path */}
                          <Link href={`/${data.userName}/${item.url}`}>
                            <ExternalLink className="mr-2 size-4 " />
                            Preview
                          </Link>
                        </DropdownMenuItem>
                        {/* Copy Component for EventTypes Page */}
                        <CopyLinkMenuItem meetingUrl={`${process.env.NEXT_PUBLIC_URL}/${data.userName}/${item.url}`} />

                        <DropdownMenuItem asChild>
                          {/* this redirect us back to [eventTypeId]/page.tsx route */}
                          <Link href={`/dashboard/event/${item.id}`}>
                            <Pen className="mr-2 size-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>

                      </DropdownMenuGroup>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem>
                        <Trash className="mr-2 size-4 " />
                        Delete
                      </DropdownMenuItem>

                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <Link
                  href="/"
                  className="flex items-center p-5"
                >
                  <div className="flex-shrink-0">
                    <User2 className="size-6" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="root:text-[#5D8AF4] text-sm font-medium dark:text-[#5D8AF4]">
                        {item.duration} Minutes Meeting
                      </dt>
                      <dd className="text-lg font-medium">
                        {item.title}
                      </dd>
                    </dl>
                  </div>
                </Link>
                <div className="flex items-center justify-between bg-muted px-5 py-3">
                  {/* render switch component */}
                  <MenuActiveSwitch initialChecked={item.active} eventTypeId={item.id} />

                  <Button asChild >
                    {/* we can grab the href we created above and use it here */}
                    {/* this also is an edit button so it will work the same */}
                    <Link href={`/dashboard/event/${item.id}`}>Edit Event</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
