import { useRef } from "react";
import { mergeProps, useCalendarCell, useFocusRing } from "react-aria";
import { CalendarState } from "react-stately";
import {
  CalendarDate,
  getLocalTimeZone,
  isSameMonth,
  isToday,
} from "@internationalized/date";
import { cn } from "@/lib/utils";

export function CalendarCell({
  state,
  date,
  currentMonth,
  isUnavailable,
}: {
  state: CalendarState;
  date: CalendarDate;
  currentMonth: CalendarDate;
    isUnavailable?: boolean;
}) {
  const ref = useRef(null);
  const {
    cellProps,
    buttonProps,
    isSelected,
    isDisabled,
    formattedDate,
  } = useCalendarCell({ date }, state, ref);

  const { focusProps, isFocusVisible } = useFocusRing();

  // this Hook is used to check what day it is it today
  // This will allow us to style a small dot at the end of the current date
  // we can then pass a current date & getLocalTimezone through the params
  const isDateToday = isToday(date, getLocalTimeZone());

  // we will use this to prevent date from other months showing up in the current month
  const isOutsideOfMonth = !isSameMonth(currentMonth, date)

  // condition that checks unavailable date from Availability and adds it to calendar cell
  const finallyDisabled = isDisabled || isUnavailable

  return (
    <td
      {...cellProps}
      className={`relative px-0.5 py-0.5 ${isFocusVisible ? "z-10" : "z-0"}`}
    >
      <div
        {...mergeProps(buttonProps, focusProps)}
        ref={ref}
        hidden={isOutsideOfMonth} // this will be hidden when isOutsideOfMonth if true
        className="group size-10 sm:size-12 rounded-md outline-none"
      >
        <div
          className={cn(
            "flex size-full items-center justify-center rounded-sm text-sm font-semibold",

            isSelected ? "bg-primary text-white" : "", // style for selecting available days
            finallyDisabled
              ? "cursor-not-allowed text-muted-foreground"
              : "", // style for unavailable days

            !isSelected && !finallyDisabled ? "bg-secondary" : "", // style for hoverin avaialble days only
          )}
        >
          {/* we have a hook for this */}
          {formattedDate}
          {isDateToday && (
            <div
              className={cn(
                "absolute bottom-1 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-primary",
                isSelected && "bg-white",
              )}
            />
          )}
        </div>
      </div>
    </td>
  );
}
