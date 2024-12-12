
import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

// type keywords allows for type helping later on when we use the components
import type { OurFileRouter } from "../api/uploadthing/core";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
