"use server";
// always create this when we want to run a server action similar to our inline server action

import prisma from "./utils/db";
import { requireUser } from "./utils/hooks";
import { parseWithZod } from "@conform-to/zod";
import { onboardingSchemaValidation, settingsSchema } from "./utils/zodSchemas";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

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

export async function updateAvailabilityAction( formData: FormData ) {
    const session = await requireUser(); // this makes sure only authenticated users are allowed to save changes

    // this takes our formData and conver into an object where the arrays
    // the 1st element becomes the key, the 2nd becomes the value
    const rawData = Object.fromEntries(formData.entries());

    const availabilityData = Object.keys(rawData) // this gets the keys from our rawData
    .filter((key) => key.startsWith("id-")) // filter the keys to the one that starts with `id-` which is the <input type='hidden'> we created
    .map((key) => { 
        // remove `id-` from prefix & grab the id which is ${item.id} in the <input>
        const id = key.replace("id-", "") 

        return { 
            id, // basically the id of the item (which is the same id of the object of is isActive,fromTime,tillTime) 
            // added in Switch and Select Components

            // the <Switch> only returns string (true returns on, false returns undefined) 
            isActive: rawData[`isActive-${id}`] === "on", 

            fromTime: rawData[`fromTime-${id}`] as string,  
            tillTime: rawData[`tillTime-${id}`] as string,
            // HACK: in simple terms these are just sorting
            // All return corresponds to the same availability data/object
        }
    })

    try {
        await prisma.$transaction(
            availabilityData.map((item) => prisma.availability.update({
                where : {
                    id: item.id,
                },
                data : {
                    isActive: item.isActive,
                    fromTime: item.fromTime,
                    tillTime: item.tillTime,
                }
            }))
        )

        // revalidatePath("/dashboard/availability");

    } catch (error) {
        console.log(error)
    }

}
