

import { nylas, nylasConfig } from "@/app/utils/nylas"
import { redirect } from "next/navigation"

// check the `Redirect users to Nylas` section in the docs
// https://developer.nylas.com/docs/v3/sdks/node/#redirect-end-user-to-nylas
export async function GET(){
    const authUrl =  nylas.auth.urlForOAuth2({
        //  HACK: grabbing nylasConfig from nylas object created in nylas.ts
        clientId: nylasConfig.clientId ,
        redirectUri: nylasConfig.redirectUri, 
    })

    // redirect the user
    return redirect(authUrl)
}
