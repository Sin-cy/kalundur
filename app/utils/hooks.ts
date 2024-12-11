import { redirect } from "next/navigation";
import { auth } from "./auth";


// Hook for Redirect back to Homepage (used in multiple places)
export async function requireUser() {
    // This block for session check will be used in couple more places such as server and so on
    const session = await auth();

       // checks if the user has a session, if not then return *** redirect from next navigation ***
    if(!session?.user){
        return redirect("/")
    }

    // if session is valid, then return the user data or session data
    return session;
}

