import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/hooks";
import { nylas, nylasConfig } from "@/app/utils/nylas";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest){

    // this makes sure only authenticated user are able to
    // reach this route
    const session = await requireUser()
    const url = new URL(req.url)
    // read more in the docs for the Handle Authentication Response with Nylas 
    // https://developer.nylas.com/docs/v3/sdks/node/#handle-the-authentication-response
    const code = url.searchParams.get("code")

    // handle errors 
    if(!code){
        return Response.json("No authorization code returned from Nylas",{
            status: 400,
        })
    }

    // now we can use what we have to get the exchangeToken
    try {
        // this is available in the Nylas - Handle Authentication Response docs
        // now we can grab these values from our nylasConfig Object in our nylas.ts
        const response = await nylas.auth.exchangeCodeForToken({ 
                clientSecret: nylasConfig.apiKey,  
                clientId: nylasConfig.clientId, 
                redirectUri:  nylasConfig.redirectUri,
                code: code, 
        })

        const { grantId , email } = response 
        console.log({grantId})
        // from the const response - we can now destructure the grantId and email
        // we need these two things to authenticate the api request then store it in the database
        // but the User data in the Prisma Schema, these values are not created yet so create them
        await prisma.user.update({
            where: {
                // to get the id - we use can use const session
                // that is already returning the session data
                id: session.user?.id,
            },
            data: {
                grantId: grantId,
                grantEmail: email,
            }
        })

    } catch (error) {
       console.log("Error : something went wrong !", error ) 
    }

    redirect("/dashboard")


}
