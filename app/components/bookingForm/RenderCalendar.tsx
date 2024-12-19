"use client";

import { Calendar } from "./Calendar";
import { today, getLocalTimeZone, parseDate, CalendarDate } from "@internationalized/date";
import { DateValue } from "@react-types/calendar";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// This interface is a part of Grabbing data from Availability into the EventTypes calendar page
// by using the data that we fetch and rendering it onto the RenderCalendar()
interface renderCalProps {
  availability: {
    day: string;
    isActive: boolean;
  }[]; // Important to mark this as an Array of Monday till Sunday
  // now just destructure these into RenderCalendar so we can use this data on this page as well
}

// NOTE: This Component will make sure that the prev days counting from current day can't be selected
// we will render this function instead of the default Calendar component on the bookingForm page
export function RenderCalendar({ availability }: renderCalProps) {
  // for saving the state of the date into the URL
  const searchParams = useSearchParams(); // from next navigation

  const router = useRouter() // ONLY! from next navigation 

  const [date, setDate] = useState(() => {
    // get the data through the first param
    const dateParam = searchParams.get("date");

    // we get the param date - if available then parse it
    // else just get todays date in current time zone
    return dateParam ? parseDate(dateParam) : today(getLocalTimeZone());
  });

  // useEffect helps keep everything in sync
  // Always keep the state in balance 
  useEffect(() => {
    const dateParam = searchParams.get('date')

    if(dateParam){
      setDate(parseDate(dateParam))
    }

  },[searchParams]) // always rerun this hook when searchParams update (when new date is selected)

  const handleDateChange = (date: DateValue) => {
    // this gets our date and set it to our state
    // basically it updates our getter `date`
    setDate(date as CalendarDate)

    const url = new URL(window.location.href) // this gets our URL
    url.searchParams.set("date", date.toString())
    // update and push to url 
    router.push(url.toString()) // this will give us a query in our URL when new date is selected

  }

  // this func will be used to find which day is not available and which is
  const isDateUnavailable = (date: DateValue) => {
    // we can get date from the params with a type of DateValue from React Types Calendar
    const dayOfWeek = date.toDate(getLocalTimeZone()).getDay();
    // dayOfWeek grabs the index like we have [0 - 6]
    // INFO: THIS IS CONFUSING bcuz the calendar starts from Sun by default but this works correctly still
    // it returns an index of 0 to 6 (from Sunday till Saturday) but our calendar starts from Monday
    // to fix that
    const adjustedIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    return !availability[adjustedIndex].isActive; // returns true when this condition is falsy
  };
  return (
    // this is the minimum date to be accessible
    // to do this we get the current time which is a hook we can use
    <Calendar
      minValue={today(getLocalTimeZone())}
      isDateUnavailable={isDateUnavailable}
      value={date}
      onChange={handleDateChange}
    />
  );
}
