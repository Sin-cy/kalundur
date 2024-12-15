// Its important to Name the file page.tsx or else it wont be converted to a route
// Our goal is to make the dashboard page route SO YEAH!

import { notFound } from "next/navigation";
import prisma from "../utils/db";
import { requireUser } from "../utils/hooks";
import { EmptyState } from "../components/EmptyState";

async function getData(userId: string) {
    const data = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            userName: true,
            eventType: {
                select: {
                    id: true,
                    active: true,
                    title: true,
                    url: true,
                    duration: true,
                },
            },
        },
    });

    if (!data) {
        return notFound();
    }

    return data;
}

// Bacuz this is a Route, we have to do export default
// marking this func as async is safe, everything is on the server cuz we are using react server components (rsc)
// read more at docs next.js server components
// nth is sent to the client side
export default async function DashboardPage() {
    // checks if the user has a session, if not then return *** redirect from next navigation ***
    const session = await requireUser();
    // grabs the data into the client/front end
    const data = await getData(session.user?.id as string);

    return (
        <>
            {data.eventType.length === 0 ? (
                <EmptyState
                    title="You have no Event Types"
                    description="You can create your first event type by clicking the button below "
                    buttonText="Add Event Type"
                    href="/dashboard/new" 
                />
            ) : (
                <p>We have event types</p>
            )}
        </>
    );
}
