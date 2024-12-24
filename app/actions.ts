"use server";
// always create this when we want to run a server action similar to our inline server action

import prisma from "./utils/db";
import { requireUser } from "./utils/hooks";
import { parseWithZod } from "@conform-to/zod";
import {
    eventTypeSchema,
    onboardingSchemaValidation,
    settingsSchema,
} from "./utils/zodSchemas";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { nylas } from "./utils/nylas";

// becuz this is not our Routes like /dashboard or /onboarding
// we dont have to use a export default
// we can just run this as a normal async export (async is a must)

// NOTE: Server action for Onboarding
// the reason we added prevState
// after we submit the form out prevSate will become the new initial current state
export async function OnboardingAction(prevState: any, formData: FormData) {
    // typescript has an interface of FormData that lets us easily create key value pairs like in form.
    // when updating a user
    // to pass in what user or which user to update
    // typically ,its with a unqiue id that matches our user
    // we can grab the user id from
    const session = await requireUser(); // this gives us access to the user data from our Prisma db

    // validating conform with zod schema
    // parseWithZod this checks our formData with the zod schema we created
    // const submission = parseWithZod(formData, {
    //     schema: onboardingSchema,
    // })
    // HACK: we need to write it differently now because we added a new function
    // inside the zodSchema to check for a unique username
    const submission = await parseWithZod(formData, {
        schema: onboardingSchemaValidation({
            // it is now async
            // we basically revert the boolean value
            // if existing username is true we return false
            // if its false we return true
            async isUsernameUnique() {
                const existingUsername = await prisma.user.findUnique({
                    where: {
                        userName: formData.get("userName") as string, // the get 'username' must match the zodSchema
                    },
                });
                return !existingUsername; // ! is logical not used in TS
            },
        }),
        // marks async as boolean of true
        async: true, // if we dont add this it will complain about the await at submission
    });

    // submission can only have two results
    // check if the submission is a success or a fail
    if (submission.status !== "success") {
        return submission.reply(); // this returns error message should also be show on the Client Side
        // using the React 19 hook serverActionState()
        // we can grab this onto our Client Side Page Form /onboarding
    }

    const data = await prisma.user.update({
        // the question is how do we get the id of the user
        // remembering our hook requireUser() that we created at the start
        // this checks the condition for update
        where: {
            id: session.user?.id,
        },
        // NOTE: this is the data we want to update
        // but remember, we need the form input data to be right here
        // how do we get those values?
        // by specifying an argument to this function (ps. and its typescript)
        // ts provides a default Interface `FormData` which is a key value pairts to use as a type for Forms
        data: {
            userName: submission.value.userName, // using submission after checking conform with zod
            name: submission.value.fullName,
            // creating the default availability data when user comes Onboard
            availability: {
                createMany: {
                    data: [
                        {
                            day: "Monday",
                            fromTime: "08:00",
                            tillTime: "18:00",
                        },
                        {
                            day: "Tuesday",
                            fromTime: "08:00",
                            tillTime: "18:00",
                        },
                        {
                            day: "Wednesday",
                            fromTime: "08:00",
                            tillTime: "18:00",
                        },
                        {
                            day: "Thursday",
                            fromTime: "08:00",
                            tillTime: "18:00",
                        },
                        {
                            day: "Friday",
                            fromTime: "08:00",
                            tillTime: "18:00",
                        },
                        {
                            day: "Saturday",
                            fromTime: "08:00",
                            tillTime: "18:00",
                        },
                        {
                            day: "Sunday",
                            fromTime: "08:00",
                            tillTime: "18:00",
                        },
                    ],
                },
            },
        },
    });
    // now when the submit button is finished (done with the onboarding forms)
    // also need to redirect the user back to the /dashboard route from /onboarding
    // by using redirect from next navigation
    // ** return redirect("/dashboard") **
    // NOTE : But now that the /onboarding/grant-id route is ready
    // when the user has created the first on boarding route, we will now
    // redirect the user to the /onboarding/grant-id route directly
    // to connect their calendar with Nylas right away

    return redirect("/onboarding/grant-id");
}

// NOTE: Server Action for Save Settings Buttons
// this is not a route - no need for export default
// for the params we will use the formData with the FormData type provided by TS
export async function SettingsAction(prevState: any, formData: FormData) {
    // check for only authenticated user access
    // grab our User session Data
    const session = await requireUser();

    // compare our formData with Zod Schema ( ** formData is basically our Prisma Schema ** )
    const submission = parseWithZod(formData, {
        // this line specifies the schema we want to use from zodSchema.ts
        // which is the settingSchema = z.object({}) we just created
        schema: settingsSchema,
    });

    // check block
    // parseWithZod() returns either true or false
    if (submission.status !== "success") {
        return submission.reply();
    }

    const user = await prisma.user.update({
        where: {
            //tell prisma what condition to update
            id: session.user?.id,
        },
        data: {
            //tells prisma which data we wanna update based on the schema data specified from zodSchema
            // the key (name & image) properties correspond to our prisma User Schema.
            name: submission.value.fullName, // NOTE: why do we need .value to access zod properites ???
            image: submission.value.profileImage,
        },
    });

    // redirect user back to a specific page
    return redirect("/dashboard");
}

// NOTE: server action for the Save Changes button in availability page

export async function updateAvailabilityAction(formData: FormData) {
    const session = await requireUser(); // this makes sure only authenticated users are allowed to save changes

    // this takes our formData and conver into an object where the arrays
    // the 1st element becomes the key, the 2nd becomes the value
    const rawData = Object.fromEntries(formData.entries());

    const availabilityData = Object.keys(rawData) // this gets the keys from our rawData
        .filter((key) => key.startsWith("id-")) // filter the keys to the one that starts with `id-` which is the <input type='hidden'> we created
        .map((key) => {
            // remove `id-` from prefix & grab the id which is ${item.id} in the <input>
            const id = key.replace("id-", "");

            return {
                id, // basically the id of the item (which is the same id of the object of is isActive,fromTime,tillTime)
                // added in Switch and Select Components

                // the <Switch> only returns string (true returns on, false returns undefined)
                isActive: rawData[`isActive-${id}`] === "on",

                fromTime: rawData[`fromTime-${id}`] as string,
                tillTime: rawData[`tillTime-${id}`] as string,
                // HACK: in simple terms these are just sorting
                // All return corresponds to the same availability data/object
            };
        });

    try {
        await prisma.$transaction(
            availabilityData.map((item) =>
                prisma.availability.update({
                    where: {
                        id: item.id,
                    },
                    data: {
                        isActive: item.isActive,
                        fromTime: item.fromTime,
                        tillTime: item.tillTime,
                    },
                }),
            ),
        );

        revalidatePath("/dashboard/availability");
        return {
            status: "success",
            message: "Availability updated successfully",
        };
    } catch (error) {
        console.log(error);
        return { status: "error", message: "Failed to update availability" };
    }
}

export async function CreateEventTypeAction(
    prevState: any,
    formData: FormData,
) {
    // ensures only authenticated users can make changes
    // will be used later when creating a new model with prisma below
    const session = await requireUser();

    // here we need to pass in our formData
    // which we can get through the params so we can pass it as an arg here
    const submission = parseWithZod(formData, {
        // To compare our formData with zod we need to
        // specify the zod schema we want to compare with formData(Prisma Schema)
        schema: eventTypeSchema,
    });

    if (submission.status !== "success") {
        return submission.reply();
    }

    // create our mutation for comparision
    await prisma.eventType.create({
        data: {
            title: submission.value.title,
            duration: submission.value.duration,
            url: submission.value.url,
            description: submission.value.description,
            videoCallSoftware: submission.value.videoCallSoftware,
            // we also need to add one more thing
            // relation between User model and this model using userId
            // we will use this to make sure that this entry is related to this specific user
            userId: session.user?.id,
        },
    });

    return redirect("/dashboard");
    // with this Server Side action done
    // we can go and create a Client Side action using Conform back in our page.tsx
}

export async function CreateMeetingAction(formData: FormData) {
    const getUserData = await prisma.user.findUnique({
        where: {
            userName: formData.get("username") as string, // we will get the 'username' when configuring the client side <input> hidden
        },
        select: {
            grantEmail: true,
            grantId: true,
        },
    });

    if (!getUserData) {
        throw new Error("User not found");
    }

    // we also need the data for EventType which is title and description
    const eventTypeData = await prisma.eventType.findUnique({
        where: {
            id: formData.get("eventTypeId") as string, // we will get the 'eventTypeId' when configuring the client side <input> hidden
        },
        select: {
            title: true,
            description: true,
        },
    });

    // get fromTime & eventDate
    const fromTime = formData.get("fromTime") as string;
    const eventDate = formData.get("eventDate") as string;
    // meetingLength needs to be converted to a number as well (try not converting and see what error shows up)
    const meetingLength = Number(formData.get("meetingLength"));
    // provider is the videoCallSoftware - like goole meets, teams and so on...
    const provider = formData.get("provider") as string;

    // combine fromTime & eventDate into one JS date object
    // as both of these is just a string atm - later on we will convert to Unix so it can work with Nylas
    const startDateTime = new Date(`${eventDate}T${fromTime}:00`);

    // end time = startTime + meetingLength
    // need to get meetingLength through the formData
    const endDateTime = new Date(
        startDateTime.getTime() + meetingLength * 60000,
    ); // * 60000 -> convert minutes to miliseconds

    // INFO: Creating an API call with Nylas
    // to create event in Current User calendar and also the Participants Calendar
    await nylas.events.create({
        identifier: getUserData.grantId as string,
        requestBody: {
            title: eventTypeData?.title,
            description: eventTypeData?.description,
            // we currently dont have startDate - need to get it first
            when: {
                // conver standard JS object time from ms to s Unix based time for Nylas
                startTime: Math.floor(startDateTime.getTime() / 1000),
                endTime: Math.floor(endDateTime.getTime() / 1000),
            },
            conferencing: {
                autocreate: {},
                provider: provider as any, // we dont have provider - so get it with formData
            },
            participants: [
                // this will contain the user Inputing the name and email in the TimeTable selected form
                {
                    name: formData.get("name") as string,
                    email: formData.get("email") as string,
                    status: "yes", // this mean we create an event for this Participant
                },
            ],
        },
        queryParams: {
            calendarId: getUserData.grantEmail as string,
            notifyParticipants: true, // participants will get an email confirmation
        },
    });

    return redirect("/success");
    // we can then call this action on the <form> of the 3 grid layout or Participant Form
    // back in our page.tsx
}

export async function cancelMeetingAction(formData: FormData) {
    const session = await requireUser();

    const userData = await prisma.user.findUnique({
        where: {
            id: session.user?.id,
        },
        select: {
            grantEmail: true,
            grantId: true,
        },
    });

    if (!userData) {
        throw new Error("User data not found");
    }

    // nylas api request
    const data = await nylas.events.destroy({
        // get eventId through formData params
        eventId: formData.get("eventId") as string, // checks which event we want to delete
        identifier: userData.grantId as string,
        queryParams: {
            calendarId: userData.grantEmail as string, // id of the calendar where the event has been created
        },
    });

    revalidatePath("/dashboard/meetings"); // revalidates the cache, get the new data and update for this path
}

export async function EditEventTypeAction(prevState: any, formData: FormData) {
    const session = await requireUser();

    // compare formData (Prisma Schema) with Zod Schema
    const submission = parseWithZod(formData, {
        // specify the eventTypeSchema as the schema we want to use from zodSchema
        schema: eventTypeSchema,
    });

    if (submission.status !== "success") {
        return submission.reply();
    }

    const data = await prisma.eventType.update({
        where: {
            id: formData.get("id") as string,
            userId: session.user?.id,
        },
        data: {
            title: submission.value.title,
            duration: submission.value.duration,
            url: submission.value.url,
            description: submission.value.description,
            videoCallSoftware: submission.value.videoCallSoftware,
        },
    });

    // redirect user to dashboard once the mutation is complete
    return redirect("/dashboard");
}

// NOTE: Server Action for the Switch of Event Type
export async function UpdateEventTypeStatusAction( prevState: any,{
    eventTypeId,
    isChecked,
}: {
    eventTypeId: string;
    isChecked: boolean;
}) {
    try {
        const session = await requireUser();

        const data = await prisma.eventType.update({
            where: {
                id: eventTypeId,
                // make sure only allow the current user to change the status
                userId: session.user?.id,
            },
            data: {
                active: isChecked,
            },
        });

        revalidatePath("/dashboard"); // update the cache and revalidate the data

        return {
            status: "success",
            message: "Event Type Status Updated",
        };
    } catch (error) {
        console.log(error)
        return {
            status: "error",
            message: "Something went wrong",
        };
    }
}
