"use client"

import { Calendar } from "./Calendar";
import { today, getLocalTimeZone} from "@internationalized/date"

// NOTE: This Component will make sure that the prev days counting from current day can't be selected
// we will render this function instead of the default Calendar component on the bookingForm page
export function RenderCalendar() {
  return (
    // this is the minimum date to be accessible
    // to do this we get the current time which is a hook we can use
    <Calendar minValue={today(getLocalTimeZone())}/>
  )
}
