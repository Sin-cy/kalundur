// this is a route - use export default
// creating the availablity route

import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/hooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { notFound } from "next/navigation";
import { times } from "@/app/utils/times";
import { SubmitButton } from "@/app/components/SubmitButtons";
import { updateAvailabilityAction } from "@/app/actions";

// fetch data from Availability table in prisma schema
async function getData(userId: string) {
  const data = await prisma.availability.findMany({
    where: {
      // we can get the userId through the params
      // so we can later pass in an argument from our hook when we call the function
      userId: userId,
    },
    // HACK: had to add this or else sometimes the Data Render on Client Page gets swapped 
    // even though the real data is still correct, the render becomes wrong
    orderBy: {
      day: 'asc', // Enum ordering as stored in database so the days dont swap out of correct order
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

// Render on Client Page
// async if safe here - this is a Server Component
export default async function AvailabilityRoute() {
  // our hook to grab User session data from Prisma Schema
  const session = await requireUser();

  const data = await getData(session.user?.id as string);

  return (
    <Card>

      <CardHeader>
        <CardTitle>Availability</CardTitle>
        <CardDescription>
          A place to manage your availablity.
        </CardDescription>
      </CardHeader>

      <form action={updateAvailabilityAction} >
        <CardContent className="flex flex-col gap-y-4">
          {data.map((item) => (
            // when mapping over a data
            // key={} is a must have, as the key must be unique which is the item.id in this case
            <div
              key={item.id}
              className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2 md:grid-cols-3"
            >

              {/* grabbing the dynamic id for the formData */}
              <input type="hidden" name={`id-${item.id}`} value={item.id} />

              <div className="flex items-center gap-x-3">
                {/* NOTE: from our schema isActive can either be true or false */}
                {/* if isActive is false it wont be checked and vice versa */}
                <Switch name={`isActive-${item.id}`} defaultChecked={item.isActive} />
                <span>{item.day}</span>
              </div>

              {/* Start Time */}
              {/* defaultValue sets the default placeholder with the value set in actions.ts file inside OnboardingActions() */}
              <Select name={`fromTime-${item.id}`} defaultValue={item.fromTime}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Start Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {/* this is where we will render our time selects */}
                    {/* <p className="flex border rounded-md p-1 mb-2 text-center justify-center text-sm">  */}
                    {/*   tips: type time to go to approx. time */}
                    {/* </p> */}
                    {times.map((time) => (
                      // HACK: rememeber when mapping always add a key
                      // SelectItem from shadcn requires a value as well
                      <SelectItem
                        key={time.id}
                        value={time.time}
                      >
                        {time.time}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {/* End Time */}
              {/* defaultValue sets the default placeholder with the value set in actions.ts file inside OnboardingActions() */}
              <Select name={`tillTime-${item.id}`} defaultValue={item.tillTime}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="End Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {/* this is where we will render our time selects */}
                    {/* <p className="flex border rounded-md p-1 mb-2 text-center justify-center text-sm">  */}
                    {/*   tips: type time to go to approx. time */}
                    {/* </p> */}
                    {times.map((time) => (
                      // HACK: rememeber when mapping always add a key
                      // SelectItem from shadcn requires a value as well
                      <SelectItem
                        key={time.id}
                        value={time.time}
                      >
                        {time.time}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ))}

        </CardContent>
        <CardFooter>
          <SubmitButton text="Save Changes" />
        </CardFooter>
      </form>
    </Card>
  );
}
