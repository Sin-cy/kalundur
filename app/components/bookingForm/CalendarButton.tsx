import { Button } from "@/components/ui/button";
import { AriaButtonProps, useButton } from "@react-aria/button";
import { CalendarState } from "@react-stately/calendar";
import { mergeProps } from "@react-aria/utils";
import { useRef } from "react";
import { useFocusRing } from "@react-aria/focus";

export function CalendarButton(
  props: AriaButtonProps<"button"> & {
    state?: CalendarState;
    side?: "left" | "right";
  },
) {
  const ref = useRef(null); // ref interacts with the dom element(or with the button)
  const { buttonProps } = useButton(props, ref); // get button behavior like event handlers 
  const { focusProps } = useFocusRing(); // provide styles when the button is focus
  return (
    <Button
      variant="outline"
      size="icon"
      ref={ref}
      disabled={props.isDisabled}
      // this merge props combine buttonProps & focusProps 
      // which we got from the two hooks to ensure the button handles
      // interactions correctly
      {...mergeProps(buttonProps, focusProps)} 
    >
      {props.children}
    </Button>
  );
}
