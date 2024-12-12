// NOTE: configuration files for nylas
// we pass our env variables here which is a SECRET key
// configured in side .env files

import Nylas from "nylas";

// adding ! will tell ts that this these NylasAPIs are already defined
export const nylas = new Nylas({
  apiKey: process.env.NYLAS_API_SECRET_KEY!,
  apiUri: process.env.NYLAS_API_URI!,
})   

// creating another object to use for client GET()
// we have to create the clientid and redirectUri in the .env
export const nylasConfig = {
    clientId: process.env.NYLAS_CLIENT_ID!,
    redirectUri: process.env.NEXT_PUBLIC_URL! + "/api/oauth/exchange", // do not misspell this addition route
    apiKey: process.env.NYLAS_API_SECRET_KEY!,
    apiUri: process.env.NYLAS_API_URI!,
}
