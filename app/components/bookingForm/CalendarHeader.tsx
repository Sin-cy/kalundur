"use client";
import { CalendarState } from "react-stately";
import { FocusableElement, DOMAttributes } from "@react-types/shared";
import { type AriaButtonProps } from "@react-aria/button";
import { useDateFormatter } from "@react-aria/i18n";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { CalendarButton } from "./CalendarButton";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function CalendarHeader({
  state,
  calendarProps,
  previousButtonProps,
  nextButtonProps,
}: {
  state: CalendarState;
  calendarProps: DOMAttributes<FocusableElement>;
  previousButtonProps: AriaButtonProps<"button">;
  nextButtonProps: AriaButtonProps<"button">;
}) {
  // this is the Dynamic date that we did not add at First
  const monthDateFormatter = useDateFormatter({
    month: "short", // get the month in a short format
    year: "numeric", // if the year changes it will show accordingly
    timeZone: state.timeZone,
  });

  // formatToParts is called on the Formatter
  // breaks it into different parts which is - month and year
  // as seen in the array
  // the underscore is just for ignoring and nothing is being returned
  const [monthName, _ , year] = monthDateFormatter
    .formatToParts(
      // this here refers to the starting date and to the current visible calendar range
      state.visibleRange.start.toDate(state.timeZone),
    )
    // we map over this array to get the month name and the year
    .map((part) => part.value);

  return (
    <div className="flex items-center pb-4">
      {/* visually hidden hides then from normal user but the screen reader can still select all calendar dates*/}
      <VisuallyHidden>
        <h2>{calendarProps["aria-label"]}</h2>
      </VisuallyHidden>

      <h2 className="font-semibold flex-1">
        {monthName}{"."}{" "}
        <span className="text-md font-medium text-muted-foreground">
          {year}
        </span>
      </h2>

      <div className="flex items-center gap-2">
        {/* now we have to create our own component for Calendar buttons */}
        <CalendarButton  {...previousButtonProps} >
          <ChevronLeft className="size-4" />
        </CalendarButton> 

        <CalendarButton  {...nextButtonProps} >
          <ChevronRight className="size-4" />
        </CalendarButton> 

      </div>
    </div>
  );
}
