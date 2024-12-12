"use client"; // conform requires js bundle
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "./SubmitButtons";
import { useActionState, useState } from "react";
import { SettingsAction } from "../actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { settingsSchema } from "../utils/zodSchemas";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { UploadDropzone } from "../utils/uploadthing";
import { toast } from "sonner";

// HACK: An interface to render data from settings/page.tsx onto the page
interface settingsProps {
  fullName: string;
  email: string;
  profileImage: string;
}
// with this created, we can grab these from the params
// by destructuring it

// once the the destructuring is done, dont forget to go back to where <SettingsForm /> was called
// and put it the destructured properties with the correct type as well. TS will check for that
// only then, we can use these properties in this SettingsForm component
// use it as what ? - use it as a defaultValue to render on client side
export function SettingsForm({ fullName, email, profileImage }: settingsProps) {
  // provide first arg of SettingsAction from actions.ts or server action
  // second arg of initialValue which is undefined
  // back in our action.ts at SettingsAction(), we must provide param with type of `prevSate : any`
  // else it will complain the first param and this will not work
  const [lastResult, action] = useActionState(SettingsAction, undefined);

  // using useState hook, we pass in the profileImage to the getter
  const [currentProfileImage, setCurrentProfileImage] =
    useState(profileImage);

  // NOTE: setup Conform
  // useForm imported from conform/react
  const [form, fields] = useForm({
    lastResult, // this is stored in form

    // this functions validates formData (Prisma schema) with settigsSchema (zodSchema)
    // just to validate on the client as well
    onValidate({ formData }) {
      // this is stored in fields
      return parseWithZod(formData, {
        schema: settingsSchema,
      });
    },

    shouldValidate: "onBlur", // validates on leaving the input
    shouldRevalidate: "onInput", // re-validates on typing back in the input
  });
  // with conform setup done
  // we can connect Conform with our <form> and <Inputs>

  // Delete Profile Image Button
  const handleDeleteImage = () => {
    // using a setter from react, we can just set the value to empty string
    // and that will do it. Now just use this function
    setCurrentProfileImage("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage your account settings</CardDescription>
      </CardHeader>

      {/* NOTE: The Settings Form - user can change Name, email, Profile Pic */}
      {/* and have a Submit button to GET() the data for name and email so it can be a save button*/}
      {/* HACK: adding id, onSubmit & action to connect with Conform */}
      <form
        id={form.id}
        onSubmit={form.onSubmit}
        action={action}
        noValidate
      >
        <CardContent className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-2">
            <Label>Full name</Label>

            {/* the only explanation I have for fields.fullName.name is its linking fields to our zodSchema, then to our prismaSchema */}
            <Input
              name={fields.fullName.name} // fields.fullName.<**These Properties**> are from Conform react
              key={fields.fullName.key}
              defaultValue={fullName}
              placeholder="enter your name.."
            />
            <p className="text-sm text-red-500">
              {fields.fullName.errors}
            </p>
          </div>
          <div className="flex flex-col gap-y-2">
            <Label>Email</Label>
            {/* we dont want the user to update the email */}
            <Input
              disabled
              defaultValue={email}
              placeholder="test@test.com"
            />
          </div>

          <div className="grid gap-y-5">
            <Label>Profile Image</Label>
            {/* NOTE: Grabbing the formData for profileImage to change the user Profile Image */}
            {/* hide the input on the client page but allows us to grab the data for changing user profile image */}
            <input
              type="hidden"
              name={fields.profileImage.name}
              key={fields.profileImage.key}
              value={currentProfileImage}
            />
            {currentProfileImage ? (
              <div className="relative ml-3 size-16">
                <Image
                  src={currentProfileImage}
                  alt="Profile"
                  priority
                  layout="fill"
                  className=" rounded-full"
                />
                <Button
                  onClick={handleDeleteImage}
                  variant="destructive"
                  type="button" // HACK: give a type of button, else Shadcn assumes it as type submit
                  className="absolute -right-3 -top-3 h-7 w-8"
                >
                  <XIcon className="size-4" />
                </Button>
              </div>
            ) : (
              // be sure to import from our utils/uploadthing
              // it will be missing an endpoint property
              // just add the imageUploader as that is set in our api/uploadthing/core.ts
              <UploadDropzone
                // using the setter to notify when the image is uploaded
                onClientUploadComplete={(res) => {
                  setCurrentProfileImage(res[0].url);
                  toast.success(
                    "Profile Image has been uploaded!",
                  );
                }}
                onUploadError={(error) => {
                  console.log("Something went wrong", error);
                  toast.error(error.message);
                }}
                endpoint="imageUploader"
              />
            )}
            <p className="text-red-500 text-sm ">{fields.profileImage.errors}</p>
          </div>
        </CardContent>
        <CardFooter>
          {/* importing our own submitbutton component that we made */}
          <SubmitButton text="Save Changes" />
        </CardFooter>
      </form>
    </Card>
  );
}
