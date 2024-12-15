"use client" // we are calling a useActionSate() client side component

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState } from "react";
import { OnboardingAction } from "../actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { onboardingSchema } from "../utils/zodSchemas";
import { SubmitButton } from "../components/SubmitButtons";

export default function OnboardingRoute() {
  // useActionState requires 2 args
  // first is the server action which we called as OnboardingAction
  // HACK: OnboardingAction is a server side component but useActionState is a client side
  const [lastResult, action] = useActionState(OnboardingAction, undefined);

  // NOTE: using conform
  const [form, fields] = useForm({
    // sync the result of our submission using lastResult from useActionState() hook
    lastResult,
    // validate data on the client side
    // onValidate validates the form schema on the client side
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: onboardingSchema,
      });
    },

    // NOTE: Important !!!
    shouldValidate: "onBlur", // form is validated when user types and click out of the input
    shouldRevalidate: "onInput", // then when user starts typing again it is re-validated
    // Now we have to add this to our <form> below
  });

  return (
    <div className="flex min-h-screen w-screen items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>
            {" "}
            Welcome to Kalundur
            <span className="text-primary">Wiz</span>{" "}
          </CardTitle>
          <CardDescription>
            Please provide the following information to help us set
            your profile
          </CardDescription>
        </CardHeader>

        {/* NOTE: Connecting <form> with conform */}
        {/* action is taken from the useActionState() hook */}
        <form
          id={form.id}
          onSubmit={form.onSubmit}
          action={action}
          noValidate
        >
          {/* to make the buttons clickable we will wrap the whole CardContent div into a form */}
          <CardContent className="flex flex-col gap-y-5">
            <div className="grid gap-y-2">
              <Label>Name</Label>
              {/* NOTE: Connecting <Input> with conform so we can get our error messages on the client side*/}
              <Input
                name={fields.fullName.name}
                defaultValue={fields.fullName.initialValue}
                key={fields.fullName.key}
                placeholder="Lord Sinquad"
              />
              <p className="text-red-500 text-sm ">{fields.fullName.errors}</p>
            </div>
            <div>
              <Label>Username</Label>
              <div className="flex rounded-md">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-muted bg-muted px-3 text-sm text-muted-foreground">
                  Kalundur.com/
                </span>
                {/* NOTE: Connecting <Input> with conform so we can get our error messages on the client side*/}
                <Input
                  name={fields.userName.name}
                  key={fields.userName.key}
                  defaultValue={fields.userName.initialValue}
                  placeholder="exmaple-user-1"
                  className="rounded-l-none"
                />
              </div>
              <p className="text-red-500 text-sm ">{fields.userName.errors}</p>
            </div>
          </CardContent>
          <CardFooter>
            {/* in our interface for submit button the text string is required and not optional so we must give it a text */}
            <SubmitButton  text="Submit" className="w-full" />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
