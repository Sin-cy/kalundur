import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CheckCircleIcon } from "lucide-react";
import Link from "next/link";

export default function SuccessRoute() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Card className="mx-auto w-full max-w-[400px]">
        <CardContent className="flex w-full flex-col items-center p-6">
          <div className="size-17 flex items-center justify-center rounded-full bg-green-500/30">
            <CheckCircleIcon className="size-9 text-green-500" />
          </div>

          <h1 className="mt-4 text-2xl font-semibold">
            This Event is Scheduled
          </h1>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            We emailed you a calendar invitation with all the
            details and video call links
          </p>
        </CardContent>
        <CardFooter>
          {/* we rendered something inside a button component - must give it asChild property */}
          <Button className="w-full" asChild>
            <Link href="/">
              Close this page
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
