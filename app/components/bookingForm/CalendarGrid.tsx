import { useCalendarGrid, useLocale } from 'react-aria';
import { getWeeksInMonth, DateDuration, endOfMonth } from '@internationalized/date';
import { CalendarState } from "react-stately"
import { CalendarCell } from './CalendarCell';
import { DateValue } from "@react-types/calendar"

export function CalendarGrid({ 
  state, 
  offset = {},
  isDateUnavailable 
  }:  {
    state: CalendarState;
    offset?: DateDuration;
    isDateUnavailable? : (date: DateValue) => boolean;
  }) {

  // calculate the days we have in a month - each month has different end dates
  const startDate = state.visibleRange.start.add(offset)
  const endDate = endOfMonth(startDate)

  let { locale } = useLocale();
  let { gridProps, headerProps, weekDays } = useCalendarGrid({ // this just manages the grid structure and the weekdays header
    startDate,
    endDate,
    weekdayStyle: 'short',
  },
    state
  );

  // calculate how many weeks we have in a month
  const weeksInMonth = getWeeksInMonth(startDate, locale)
  return (
    <table {...gridProps} cellPadding={0} className="flex-1" > 
      <thead {...headerProps} className="text-sm font-medium ">
        <tr>
          {/* rendering all the days like mon,tue and so on... */}
          {weekDays.map((day, index) => <th key={index}>{day}</th>)}
        </tr>
      </thead>
      <tbody>
        {[...new Array(weeksInMonth).keys()].map((weekIndex) => (
          <tr key={weekIndex}>
            {state.getDatesInWeek(weekIndex).map((date, i) => (
              date
                ? (
                  <CalendarCell
                    key={i}
                    state={state}
                    date={date}
                    currentMonth={startDate}
                    isUnavailable={isDateUnavailable?.(date)}
                  />
                )
                : <td key={i} />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )

}
