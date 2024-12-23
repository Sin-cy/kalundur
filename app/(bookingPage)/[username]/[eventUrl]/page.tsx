import prisma from "@/app/utils/db";
import { RenderCalendar } from "@/app/components/bookingForm/RenderCalendar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarX2, Clock2, VideoIcon } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { TimeTable } from "@/app/components/bookingForm/TimeTable";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/app/components/SubmitButtons";
import { CreateMeetingAction } from "@/app/actions";

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
  searchParams,
}: {
  params: { username: string; eventUrl: string };
  searchParams: { date?: string; time?: string };
  // we can get them through the params - our dynamic routes username and eventUrl (make sure its spelled exactly the same)
  // whenever our routes are dynamic - we can get the data through the params
}) {
  // for Next JS 15
  // Await params if it's asynchronous
  const { username, eventUrl } = await params;

  // getData now requires two properties
  // now we can pass these params as an arg
  // change params.evenUrl & params.username for Next Js 15
  const data = await getData(eventUrl, username);

  // INFO: Making the date in the first grid section dynamic
  // use to update the first grid section date with selected date from Calendar
  const selectedDate = searchParams.date // we cant get searchParams as its a js client side bundle, we have to get it via Serverside
    ? new Date(searchParams.date)
    : new Date();

  // give the dynamic date some formatting
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(selectedDate);

  // NOTE: checks if both data and time are true
  // we dont have .time yet, so we need to get it through searchParams
  // double !! converts any value to a BOOLEAN
  const showForm = !!searchParams.date && !!searchParams.time

  return (
    <div className="flex min-h-screen w-screen items-center justify-center">

      {showForm ? (

        <Card className="max-w-[600px] w-full ">
          {/* this creating the Card Content as a grid is a little tricky */}
          <CardContent className="gap-4 p-5 md:grid md:grid-cols-[1fr,auto,1fr]">
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
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                {data.User?.name}
              </p>
              <h1 className="mt-2 text-xl font-semibold">
                {data.title}
              </h1>
              <p className="text-sm font-medium text-muted-foreground">
                {data.description}
              </p>

              <div className="Image m-5 flex flex-col gap-y-3">
                <p className="flex items-center">
                  <CalendarX2 className="mr-2 size-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {/* will hard code this for now - change later once the calendar is setup */}
                    {formattedDate}
                  </span>
                </p>

                <p className="flex items-center">
                  <Clock2 className="mr-2 size-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {data.duration} Minutes
                  </span>
                </p>

                <p className="flex items-center">
                  <VideoIcon className="mr-2 size-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {data.videoCallSoftware}
                  </span>
                </p>
              </div>
            </div>

            {/* Second Grid Section (separator) */}
            <Separator
              orientation="vertical"
              className="h-[full] w-[1px]"
            />

            {/* NOTE: Form Data for Participant Form Input */}
            <form className="flex flex-col gap-y-4 " action={CreateMeetingAction}>

              {/* HACK: add a type input hidden for data handling from CreateMeetingActions() */}
              <input type="hidden" name="fromTime" value={searchParams.time}/>
              <input type="hidden" name="eventDate" value={searchParams.date}/>

              {/* HACK: the value is taken from EventType data that we fetched above using Prisma */}
              <input type="hidden" name="meetingLength" value={data.duration}/> 
              <input type="hidden" name="provider" value={data.videoCallSoftware}/>
              <input type="hidden" name="eventTypeId" value={data.id}/>

              {/* HACK: the value is taken from the params we created above in our BookingFormRoute() */}
              <input type="hidden" name="username" value={params.username}/>

              <div className="flex flex-col gap-y-2 mt-5 ">
                <Label>Your Name</Label>
                <Input name="name" placeholder="Enter Your Name" />
              </div>
              <div className="flex flex-col gap-y-2 ">
                <Label>Your Email</Label>
                <Input name="email" placeholder="JohnDoe@exmaple.com" />
              </div>
              <SubmitButton className="w-full mt-7" text="Book Meeting" />

            </form>

          </CardContent>
        </Card>

      ) : (

        <Card className="mx-auto w-full max-w-[1000px]">
          {/* this creating the Card Content as a grid is a little tricky */}
          <CardContent className="gap-4 p-5 md:grid md:grid-cols-[1fr,auto,1fr,auto,1fr]">
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
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                {data.User?.name}
              </p>
              <h1 className="mt-2 text-xl font-semibold">
                {data.title}
              </h1>
              <p className="text-sm font-medium text-muted-foreground">
                {data.description}
              </p>

              <div className="Image m-5 flex flex-col gap-y-3">
                <p className="flex items-center">
                  <CalendarX2 className="mr-2 size-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {/* will hard code this for now - change later once the calendar is setup */}
                    {formattedDate}
                  </span>
                </p>

                <p className="flex items-center">
                  <Clock2 className="mr-2 size-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {data.duration} Minutes
                  </span>
                </p>

                <p className="flex items-center">
                  <VideoIcon className="mr-2 size-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {data.videoCallSoftware}
                  </span>
                </p>
              </div>
            </div>

            {/* Second Grid Section (separator) */}
            <Separator
              orientation="vertical"
              className="h-[full] w-[1px]"
            />

            {/* Third Grid Section (the custom calendar via React Aria) */}
            <RenderCalendar
              availability={data.User?.availability as any}
            />

            {/* Fourth Grid Section Separator */}
            <Separator
              orientation="vertical"
              className="h-[full] w-[1px]"
            />

            {/* Fifth Grid Section - Time Table */}
            <TimeTable
              selectedDate={selectedDate}
              userName={params.username}
              duration={data.duration}
            />
          </CardContent>
        </Card>

      )}

    </div>
  );
}
