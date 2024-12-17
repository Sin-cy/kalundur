"use client";
import { CreateEventTypeAction } from "@/app/actions";
import { SubmitButton } from "@/app/components/SubmitButtons";
import { eventTypeSchema } from "@/app/utils/zodSchemas";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/ButtonGroup";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import Link from "next/link";
import { useState, useActionState } from "react";

// setup for use of generic
type VideoCallProvider = "Zoom Meeting" | "Google Meet" | "Microsoft Teams";

export default function NewEventRoute() {
  // adding a generic into our useState hook 
  // default set to Google Meet - user can change later
  const [activePlatform, setActivePlatform] =
    useState<VideoCallProvider>("Google Meet");

  // get data using Conform with the help of React hook
  // HACK: dont forget add a param - `prevState: any` inside our CreateEventTypeAction() function back in action.ts page
  const [lastResult, action] = useActionState(CreateEventTypeAction, undefined);

  // useForm from Conform
  const [form, fields] = useForm({
    lastResult,

    onValidate({ formData }) {
      return parseWithZod(formData, {
        // this is the validation on the client side
        schema: eventTypeSchema, // this will now compare our formData with our zodschema
      });
    },

    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <div className="flex h-full w-full flex-1 items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Add new appointment type</CardTitle>
          <CardDescription>
            appointment that allows other people to book you
          </CardDescription>
        </CardHeader>
        <form
          id={form.id}
          onSubmit={form.onSubmit}
          action={action}
          noValidate
        >
          <CardContent className="grid gap-y-5">
            <div className="flex flex-col gap-y-2">
              <Label>Title</Label>
              <Input
                name={fields.title.name}
                key={fields.title.key}
                defaultValue={fields.title.initialValue}
                placeholder="30 mins meeting"
              />
              <p className="text-red-500 text-sm">{fields.title.errors}</p>
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>URL Slug</Label>
              <div className="flex rounded-md">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-muted bg-muted px-3 text-sm text-muted-foreground">
                  Kalundur.com/
                </span>
                <Input
                  name={fields.url.name}
                  key={fields.url.key}
                  defaultValue={fields.url.initialValue}
                  className="rounded-l-none"
                  placeholder="example-url-1"
                />
              </div>
              <p className="text-red-500 text-sm">{fields.url.errors}</p>
            </div>

            <div className="flex flex-col gap-y-2">
              <Label>Description</Label>
              <Textarea
                name={fields.description.name}
                key={fields.description.key}
                defaultValue={fields.description.initialValue}
                placeholder="enter you message..."
              />
              <p className="text-red-500 text-sm">{fields.description.errors}</p>
            </div>

            <div className="flex flex-col gap-y-2">
              <Label>Duration</Label>
              <Select
                name={fields.duration.name}
                key={fields.duration.key}
                defaultValue={fields.duration.initialValue}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Duration</SelectLabel>
                    <SelectItem value="15">
                      15 mins
                    </SelectItem>
                    <SelectItem value="30">
                      30 mins
                    </SelectItem>
                    <SelectItem value="45">
                      45 mins
                    </SelectItem>
                    <SelectItem value="60">
                      1 hour
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <p className="text-red-500 text-sm">{fields.duration.errors}</p>

            </div>
            <div className="grid gap-y-2">
              <Label>Video Call Provider</Label>
              <input
                type="hidden"
                name={fields.videoCallSoftware.name}
                value={activePlatform}
              />
              {/* unfortunately shadcn does not have a button group so lets just make one ourselfs */}
              <ButtonGroup>
                <Button
                  type="button"
                  onClick={() =>
                    setActivePlatform("Zoom Meeting")
                  }
                  className="w-full"
                  variant={
                    activePlatform === "Zoom Meeting"
                      ? "secondary"
                      : "outline"
                  }
                >
                  Zoom
                </Button>
                <Button
                  type="button"
                  onClick={() =>
                    setActivePlatform("Google Meet")
                  }
                  className="w-full"
                  variant={
                    activePlatform === "Google Meet"
                      ? "secondary"
                      : "outline"
                  }
                >
                  Google Meet
                </Button>
                <Button
                  type="button"
                  onClick={() =>
                    setActivePlatform("Microsoft Teams")
                  }
                  className="w-full"
                  variant={
                    activePlatform === "Microsoft Teams"
                      ? "secondary"
                      : "outline"
                  }
                >
                  Microsoft Teams
                </Button>
              </ButtonGroup>
              <p className="text-red-500 text-sm">{fields.videoCallSoftware.errors}</p>
            </div>
          </CardContent>
          <CardFooter className="flex w-full justify-between">
            <Button variant="secondary" asChild>
              <Link href="/dashboard">Cancel</Link>
            </Button>
            <SubmitButton text="Create Event Type" />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
