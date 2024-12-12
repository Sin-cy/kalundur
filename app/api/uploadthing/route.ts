// taken from Upload thing docs --> https://docs.uploadthing.com/getting-started/appdir#set-up-a-file-router 
// NOTE: This creates RouteHandler for user to upload their images

import { createRouteHandler } from "uploadthing/next";

// import the function from core.ts
import { ourFileRouter } from "./core";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
