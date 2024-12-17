"use client";
import { cn } from "@/lib/utils";
import { ButtonProps } from "./button";
import { Children, cloneElement, ReactElement } from "react";

interface buttonGroupProps {
  className?: string;
  children: ReactElement<ButtonProps>[];
}

// Creating Button Groups
export function ButtonGroup({ className, children }: buttonGroupProps) {
  // calculate the total button in the array
  const totalButtons = Children.count(children);
  return (
    <div className={cn("flex w-full", className)}>
      {children.map((child, index) => {
        // boolean check first and lastItem for truthy values
        // check when the button is first and last in the array
        const isFirstItem = index === 0;
        const isLastItem = index === totalButtons - 1;

        // creates a new element
        return cloneElement(child, {
          className: cn({
            "rounded-l-none": !isFirstItem, // firstItems is not true - no left rounding
            "rounded-r-none": !isLastItem, // lastItems is not true - no right rouding
            "border-l-zero": !isFirstItem, // firstItems is not true - no left border
          }, child.props.className),
        });
      })}
    </div>
  );
}
