"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Link2 } from "lucide-react";
import { toast } from "sonner";

const CopyLinkMenuItem = ( {meetingUrl}: {meetingUrl: string}) => {
  const handleCopy = async () => {
    // use the meetingUrl and store it in the clipboard
    try {
      await navigator.clipboard.writeText(meetingUrl);
      toast.success("URL has been copied")
      
    } catch (error) {
      toast.error("Could not copy the URL")
      console.log(error)
    }
  }

    return (
    // onSelect requires a JS bundles so we add "use client" at the top of the file
      <DropdownMenuItem onSelect={handleCopy}>
        <Link2 className="mr-2 size-4" />
        Copy
      </DropdownMenuItem>

    )
}

export default CopyLinkMenuItem;
