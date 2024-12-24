import { EditEventForm } from "@/app/components/bookingForm/EditEventTypeForm";
import prisma from "@/app/utils/db";
import { notFound } from "next/navigation";

async function getData(eventTypeId: string) {
    const data = await prisma.eventType.findUnique({
        where: {
            id: eventTypeId,
        },
        select: {
            title: true,
            description: true,
            duration: true,
            url: true,
            id: true,
            videoCallSoftware: true,
        },
    });

    if (!data) {
        return notFound(); // return a 404 not found from next/navigation
    }

  return data;
}

// make sure eventTypeId is spelled exactly like how we created the folder [eventTypeId]
const EditRoute = async ({ params }: { params: Promise<{ eventTypeId: string }> }) => {
  const eventTypeId = (await params).eventTypeId
    const data = await getData(eventTypeId);
    // we need conform for this (break it into component)
    // we cant mark this file as use client cuz we are fetching data, this is a server component
    return (
        <EditEventForm
            callProvider={data.videoCallSoftware}
            description={data.description}
            duration={data.duration}
            id={data.id}
            title={data.title}
            url={data.url}
        />
    );
};

export default EditRoute;
