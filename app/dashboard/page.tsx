// Its important to Name the file page.tsx or else it wont be converted to a route
// Our goal is to make the dashboard page route SO YEAH!

import { requireUser } from "../utils/hooks";

// Bacuz this is a Route, we have to do export default

// marking this func as async is safe, everything is on the server cuz we are using react server components (rsc)
// read more at docs next.js server components
// so nth is sent to the client side
export default async function DashboardPage() {
    // checks if the user has a session, if not then return *** redirect from next navigation ***
    const session = await requireUser()


    return (
        <div>
            <h1>Hi from Dashboard Page</h1>
        </div>
    );
}
