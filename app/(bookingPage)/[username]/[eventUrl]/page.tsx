import { Calendar } from "@/app/components/bookingForm/Calendar";
import prisma from "@/app/utils/db";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarX2, Clock2, VideoIcon } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

async function getData(eventUrl: string, userName: string) {
  // using findFirst cuz we dont have a unique identifier
  const data = await prisma.eventType.findFirst({
    where: {
      url: eventUrl,
      User: {
        userName: userName,
      },
      active: true,
    },
    select: {
      id: true,
      description: true,
      title: true,
      duration: true,
      videoCallSoftware: true,
      User: {
        select: {
          image: true,
          name: true,
          availability: {
            select: {
              day: true,
              isActive: true,
            },
          },
        },
      },
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

// we are destructuring the routes we created inside BookingFormRoute() as params
export default async function BookingFormRoute({
  params,
}: {
  params: { username: string; eventUrl: string };
  // we can get them through the params - our dynamic routes username and eventUrl (make sure its spelled exactly the same)
}) {

  // for Next JS 15
  // Await params if it's asynchronous
  const { username, eventUrl } = await params;

  // getData now requires two properties
  // now we can pass these params as an arg
  // change params.evenUrl & params.username for Next Js 15
  const data = await getData( eventUrl, username);

  return (
    <div className="flex min-h-screen w-screen items-center justify-center">
      <Card className="mx-auto w-full max-w-[1000px]">
        {/* this creating the Card Content as a grid is a little tricky */}
        <CardContent className="md:grid-cols-[1fr,auto,1fr,auto,1fr] p-5 md:grid">
          {/* First Grid Section */}
          <div>
            <Image
              src={data.User?.image as string}
              alt="Profile Image of User"
              priority
              width={60}
              height={60}
              className="rounded-full"
            />
            <p className="text-sm font-medium text-muted-foreground mt-2 ">{data.User?.name}</p>
            <h1 className="text-xl font-semibold mt-2 ">{data.title}</h1>
            <p className="text-sm font-medium text-muted-foreground ">{data.description}</p>

            <div className="m-5 flex flex-col gap-y-3 Image">

              <p className="flex items-center ">
                <CalendarX2  className="size-4 mr-2 text-primary"/>
                <span className="text-sm font-medium text-muted-foreground">
                  {/* will hard code this in later once the calendar is setup */}
                  18. December 2024
                </span>
              </p>

              <p className="flex items-center ">
                <Clock2  className="size-4 mr-2 text-primary"/>
                <span className="text-sm font-medium text-muted-foreground">
                  {data.duration} Minutes
                </span>
              </p>

              <p className="flex items-center ">
                <VideoIcon  className="size-4 mr-2 text-primary"/>
                <span className="text-sm font-medium text-muted-foreground">
                  {data.videoCallSoftware} 
                </span>
              </p>

            </div>

          </div>

          {/* Second Grid Section (separator) */}
          <Separator orientation="vertical" className="h-[285px] w-[1px]"/>


          {/* Third Grid Section (the custom calendar via React Aria) */}
          <Calendar />


        </CardContent>
      </Card>
    </div>
  );
}
