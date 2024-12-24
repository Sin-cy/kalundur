// this will render our settings page
// this is an actual route - use export default
//

import { SettingsForm } from "@/app/components/SettingsForm";
import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/hooks";
import { notFound } from "next/navigation";

async function getData(id: string) {
    // const session = await requireUser()
    const data = await prisma.user.findUnique({
        where: {
            id: id,
        },
        // where is this select object coming from
        // why is select object set to boolean
        // why are we not grabbing it from session
        // how can we just use the param id and call it directly? Is it a next.js thing or what
        select: {
            name: true,
            email: true,
            image: true,
        },
    });

    if (!data) {
        // this returns a next/navigation 404 data not found
        return notFound();
    }

    return data;
}

// HACK: add async is safe cuz this is a server component that runs on the server
export default async function Settingsroute() {
    const session = await requireUser();
    // INFO: this answers my param id question - `session is being passed in as a arg for getData()`
    const data = await getData(session.user?.id as string); // to render this data on our SettingForm component, we create interface and destructure it
    return (
        <SettingsForm
            fullName={data.name as string}
            email={data.email}
            profileImage={data.image as string}
        />
    // we need to create a form but we wont create it in this file (which is a server component ? by default in NextJS)
    // cuz we have to fetch data here, its better to create a separate componentt
    // because we r using conform and we have to mark component as "use client" as js bundle
    // which means we can't fetch data cuz it isn't a server component anymore
    );
}
