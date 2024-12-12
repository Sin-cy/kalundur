// This is not a route handler
// This is a config file, we will create route handler later
// read the docs for more  --> https://docs.uploadthing.com/getting-started/appdir#set-up-a-file-router
// this code is basically followed from the docs and adding our own auth data sessions 
import { requireUser } from "@/app/utils/hooks";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    imageUploader: f({
        image: {
            /**
             * For full list of options and defaults, see the File Route API reference
             * @see https://docs.uploadthing.com/file-routes#route-config
             */
            maxFileSize: "4MB",
            maxFileCount: 1,
        },
    })
        // Set permissions and file types for this FileRoute
        // This make sures that only authenticated users can upload and change the images
        .middleware(async ({ req }) => {
            // This code runs on your server before upload
            // NOTE: calling our session User Data
            const session = await requireUser();

            // NOTE: checking session for user id
            if (!session.user?.id) throw new UploadThingError("Unauthorized");

            // NOTE: Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { userId: session.user.id };
        })
        //this console.logs everythign and returns the userId itself
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log("Upload complete for userId:", metadata.userId);

            console.log("file url", file.url);

            // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
            return { uploadedBy: metadata.userId };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
