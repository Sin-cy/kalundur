import prisma from "@/app/utils/db";
import { nylas } from "@/app/utils/nylas";
import { Button } from "@/components/ui/button";
import { Prisma } from "@prisma/client";
import { addMinutes, format, fromUnixTime, isAfter, isBefore, parse } from "date-fns";
import Link from "next/link";
import { GetFreeBusyRequest, GetFreeBusyResponse } from "nylas";

async function getData(userName: string, selectedDate: Date) {
  // format the selectedDate object for Dynamic dates
  const currentDay = format(selectedDate, "EEEE");

  // NOTE: used with nylas date data fetching
  const startOfDay = new Date(selectedDate);
  startOfDay.setHours(0, 0, 0, 0); // this creates a new date object and starts at midnight
  const endOfDay = new Date(selectedDate);
  endOfDay.setHours(23, 59, 59, 999); // this creates a new date object and ends 1ms just before midnight

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
      },
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
        },
      },
    },
  });

  // with the help of Nylas calendar api
  const nylasCalendarData = await nylas.calendars.getFreeBusy({
    identifier: data?.User?.grantId as string, // gives nylas the rights to search our calendar
    requestBody: {
      // tell nylas what time range to look at
      // we have to first get the fromTime and endTime
      startTime: Math.floor(startOfDay.getTime() / 1000), // converts js milisecond timestamp to UNIX base timestamp for Nylas
      // divide 1000 converts ms into s to match Unix
      // Math.floor gives whole number
      endTime: Math.floor(endOfDay.getTime() / 1000),
      emails: [data?.User?.grantEmail as string], // nylas now knows what calendar associated with the email to search up
      // grantEmail is the user personal email authenticated with Nylas
    },
  });

  return {
    data,
    nylasCalendarData,
  };
}

interface timeTableProps {
  selectedDate: Date;
  userName: string;
  duration: number;
}

function calculateAvailableTimeSlots(
  date: string,
  dbAvailability: {
    // make sure from & till Time spelling are exactly the same
    fromTime: string | undefined;
    tillTime: string | undefined;
  },
  nylasData: NylasResponse<GetFreeBusyResponse[]>,
  duration: number,
) {
  const now = new Date();

  // convert db availability to a js date object
  // import parse ONLY from date-fns
  // NOTE: currently we get date and dbAvailability through params & they are currently just names
  // they dont contain any values yet - we will pass them as an arg later when we call calculateAvailableTimeSlots function
  const availableFrom = parse(
    // we can get the date & dbAvailability through our params
    `${date} ${dbAvailability.fromTime}`,
    "yyyy-MM-dd HH:mm",
    new Date(),
  );

  const availableTill = parse(
    `${date} ${dbAvailability.tillTime}`,
    "yyyy-MM-dd HH:mm",
    new Date()
  )

  // this equals to nylas data which we have to get first
  // @ts-ignore
  const busySlots = nylasData.data[0].timeSlots.map((slot) => (
    {
      start: fromUnixTime(slot.startTime),
      end: fromUnixTime(slot.endTime)
    }
  ))

  // now we get all possible timeSlots for available time
  const allSlots = []
  let currentSlot = availableFrom
  // isBefore imported from date-fns
  while (isBefore(currentSlot, availableTill)) {
    allSlots.push(currentSlot)
    // addMinutes imported from date-fns
    currentSlot = addMinutes(currentSlot, duration) // here we add a possible window duration time for a meeting as well
    // by generating the timeslots based on the duration that we have
    // to do that, we can get the duration through the params by adding it to this parent function
  }


  const freeSlots = allSlots.filter((slot) => { // filters allSlots array and creates a new array
    // iterate the array using filter
    // calculate the end time of each slot by adding duration
    const slotEnd = addMinutes(slot, duration);

    return (
      // slot should only start at the current time
      isAfter(slot, now) &&
      !busySlots.some(
        // check slot overlap with Busy Periods which we get from Nylas
        (busy: { start: any; end: any }) =>
          (!isBefore(slot, busy.start) && isBefore(slot, busy.end)) || // if slots starts with busy period
          (isAfter(slotEnd, busy.start) && !isAfter(slotEnd, busy.end)) || // if slots ends with busy period
          (isBefore(slot, busy.start) && isAfter(slotEnd, busy.end)) // if slots is within the busy period
        // if none of these are true, then its just a free slot
      )
    )
  });


  // Return the formatted Freeslots
  return freeSlots.map((slot) => format(slot, "HH:mm"));

}

// we can use async here cuz this is a server component
// nth is leaked to the client, everything is server side
export async function TimeTable({ selectedDate, userName , duration }: timeTableProps) {
  // getData() takes in a username as a param - which we dont have yet
  // so add userName in our interface, destrcuture it and we are gtg
  const { data, nylasCalendarData } = await getData(userName, selectedDate);

  const formattedDate = format(selectedDate, "yyyy-MM-dd")
  const dbAvailability = {
    fromTime: data?.fromTime,
    tillTime: data?.tillTime,
  }

  const availableSlots = calculateAvailableTimeSlots(
    formattedDate,
    dbAvailability,
    nylasCalendarData,
    duration,
  );

  return (
    <div>
      <p className="text-base font-semibold">
        {format(selectedDate, "EEE")}{" "}
        <span className="text-md text-muted-foreground">
          {format(selectedDate, "MMM. d")}
        </span>
      </p>
      {/* to now render the time table - we need to fetch the data */}

      <div className="mt-3 max-h-[350px] overflow-y-auto  ">
        {availableSlots.length > 0 ? (
          availableSlots.map((slot, index) => (
            <Link href={`?date=${format(selectedDate, "yyyy-MM-dd" )}&time=${slot}`} key={index}>
              <Button className="w-full mb-2"  variant="outline">
                {slot}
              </Button>
            </Link>
          ))
        ) : (
          <p>
            No Time slots available
          </p>
        )}

      </div>
    </div>
  );
}
