"use client"
import { useCalendar, useLocale } from "react-aria";
import { useCalendarState } from "react-stately";
import { CalendarProps,DateValue } from "@react-types/calendar"
import { createCalendar } from "@internationalized/date";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarGrid } from "./CalendarGrid";

export function Calendar(
  props: CalendarProps<DateValue> & {
  isDateUnavailable? : (date: DateValue) => boolean // this function determines what day should be marked as disabled in the calendar
}) {
  const { locale } = useLocale(); // retrieves the user local (format user accordingly to their location and language)
  const state = useCalendarState({
    ...props,
    visibleDuration: { months: 1 }, // make sure we show only 1 month
    locale,
    createCalendar,
  });

  const { calendarProps, prevButtonProps, nextButtonProps, title } =
    useCalendar(props, state);

  // those were just the core APIs, but we still need to render the calendar

  return (
    <div {...calendarProps} className="line-block">
      <CalendarHeader
        state={state}
        calendarProps={calendarProps}
        previousButtonProps={prevButtonProps}
        nextButtonProps={nextButtonProps}
      />
      <div className="flex gap-8">
        {/* we are going to render a calendar grid */}
        {/* again we are going to create a Component for that */}
        <CalendarGrid state={state} isDateUnavailable={props.isDateUnavailable}/>
        {/* we grab the props. from above that we created */}

      </div>

    </div>
  );
}
