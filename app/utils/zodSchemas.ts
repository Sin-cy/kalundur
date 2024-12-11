import { conformZodMessage } from "@conform-to/zod";
import { z } from "zod";
// creating an onboarding schema with zod
// we will use z as the short form of zod which needs importing

export const onboardingSchema = z.object({
    fullName: z.string().min(3).max(150),
    // min 3 means minimum 3 characters, same goes for max
    // for username : want to create a regex cuz we dont want blank spaces and allow only specific chars
    // this regex says we want only lowcase & uppercase a to z, 0 to 9 and dashes
    // + means string must contain at least 1 valid char and $ anchors match to the end of the string
    userName: z
        .string()
        .min(3)
        .max(150)
        .regex(/^[a-zA-Z0-9-]+$/, {
            message: "username can only be in characters,numbers and -",
        }),
});

// Looks at the unique username id and validates
// during the form submition
// options by default has the type of any so we made it a promise that results in boolean
// we can now get the results if the username is unique true or false
// username can either be unique or already used
export function onboardingSchemaValidation(options?: {
    isUsernameUnique: () => Promise<boolean>;
}) {
    // NOTE: but we cant just return is simply
    // the fact that we have to fetch data from the server to check if its really a unique username
    // we have to do an async
    return z.object({
        fullName: z.string().min(3).max(150),
        // Username is complicated because we have to check for Unique Username
        userName: z
            .string()
            .min(3)
            .max(150)
            .regex(/^[a-zA-Z0-9-]+$/, {
                message: "username can only be in characters,numbers and -",
            })
            // pipe means - this schema will only run if the username is valid
            // super refine allows us to check custom validation logic
            .pipe(
                z.string().superRefine((_, ctx) => {
                    // NOTE: create a gate block by checking if the isUsernameUnique type is not a function then
                    // run ctx that throws a validation errors
                    if (typeof options?.isUsernameUnique !== "function") {
                        ctx.addIssue({
                            code: "custom",
                            message: conformZodMessage.VALIDATION_UNDEFINED,
                            fatal: true,
                        });
                        return;
                    }
                    // here we check if username is REALLY unique
                    // our isUnique param will look at our options which is <boolean>
                    // so the param holds a value of either true or false
                    return options.isUsernameUnique().then((isUnique) => {
                        if (!isUnique) {
                            ctx.addIssue({
                                code: "custom",
                                message: "Username is already taken",
                            });
                        }
                    });
                }),
            ),
    });
}
