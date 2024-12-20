import prisma from "@/app/utils/db";
import { nylas } from "@/app/utils/nylas";
import { Prisma } from "@prisma/client";
import { format } from "date-fns";

async function getData(userName: string, selectedDate: Date){
  // format the selectedDate object for Dynamic dates
  const currentDay = format(selectedDate , "EEEE")

  // NOTE: used with nylas date data fetching
  const startOfDay = new Date(selectedDate)
  startOfDay.setHours(0,0,0,0) // this creates a new date object and starts at midnight
  const endOfDay = new Date(selectedDate)
  endOfDay.setHours(23,59,59,999) // this creates a new date object and ends 1ms just before midnight

  // we need to find the specific availability
  // the reason we use firstFirst is bacuz  
  const data = await prisma.availability.findFirst({
    where: {
      // here we want to find the availability where the day matches
      // to make the date dynamic, we have to get the selectedDate and note that its an object - it needs to be formatted
      // in the Availability table schema - Day is an enum not a string
      // HACK: this Prisma.EnumDayFilter say that `day` the same type as the `enum Day`
      day: currentDay as Prisma.EnumDayFilter, 
      User: {
        userName: userName,
      }
    },
    select: {
      fromTime: true,
      tillTime: true,
      id: true,
      User: {
        // later we will need these two things to authenticate our request
        select: {
          grantEmail: true,
          grantId: true,
        }
      }
    }
  });

  // with the help of Nylas calendar api
  const nylasCalendarData =  await nylas.calendars.getFreeBusy({
    identifier: data?.User?.grantId as string, // gives nylas the rights to search our calendar
    requestBody: { // tell nylas what time range to look at
      // we have to first get the fromTime and endTime
      startTime: Math.floor(startOfDay.getTime() / 1000), // converts js milisecond timestamp to UNIX base timestamp for Nylas
      // divide 1000 converts ms into s to match Unix
      // Math.floor gives whole number
      endTime: Math.floor(endOfDay.getTime() / 1000),
      emails: [data?.User?.grantEmail as string] // nylas now knows what calendar associated with the email to search up 
      // grantEmail is the user personal email authenticated with Nylas
    }
  })

  return {
    data,
    nylasCalendarData,
  }
}

interface timeTableProps {
  selectedDate: Date;
  userName: string;
}

// we can use async here cuz this is a server component
// nth is leaked to the client, everything is server side
export async function TimeTable({ selectedDate, userName }: timeTableProps) {
  // getData() takes in a username as a param - which we dont have yet
  // so add userName in our interface, destrcuture it and we are gtg
  const { data, nylasCalendarData } = await getData(userName, selectedDate)

  console.log(nylasCalendarData)

  return (
    <div>
      <p className="text-base font-semibold">
        {format(selectedDate, "EEE")} 
        {" "}
        <span className="text-md text-muted-foreground ">{format(selectedDate, "MMM. d")}</span>
      </p>
      {/* to now render the time table - we need to fetch the data */}



    </div>
  );
}
