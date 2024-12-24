"use client";
import { Switch } from "@/components/ui/switch";
import { useActionState, useEffect, useTransition } from "react";
import { UpdateEventTypeStatusAction } from "../actions";
import { toast } from "sonner";

// we need to check if our switch/eventType is active or not active
// in schema EventType table model - the active boolean defaults to true

export function MenuActiveSwitch({
    initialChecked,
    eventTypeId,
}: {
    initialChecked: boolean;
    eventTypeId: string;
}) {
    // use the useTransition from React - check for pending state
    // in pending state the Switch will be disabled
    const [isPending, startTransition] = useTransition(); 
    // HACK: useTransition must be the first thing that runs or else the button dont state gets stuck on disabled in this case

    const [state, action] = useActionState(
        UpdateEventTypeStatusAction,
        undefined,
    );

    // useEffect will only run once the [state] from useActionState is updated
    useEffect(() => {
        if (state?.status === "success") {
            toast.success(state.message);
        } else if (state?.status === "error") {
            toast.error(state.message);
        }
    }, [state]);

    // disabled will be true whenever isPending is true
    // onCheckedChange activates when we toggle the switch - then updates the data in the database
    return (
        <Switch
            disabled={isPending}
            defaultChecked={initialChecked}
            onCheckedChange={(isChecked) => {
                startTransition(() => {
                    action({
                        isChecked: isChecked, // we get isChecked through the params
                        eventTypeId: eventTypeId,
                    });
                });
            }}
        />
    );
}
