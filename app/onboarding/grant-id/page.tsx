
// this route is used to authenticate with Nylas
// to get the grant id and grant email 
// to later on to the API reques to get the Data from Calendar

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TextEffect } from "@/components/ui/text-effect";
// import VideoGif from '@/public/'
import { CalendarHeartIcon } from "lucide-react";
import Link from "next/link";

// and to create events
export default function OnboardingrouteTwo() {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>
            <TextEffect per='word' as='h3' preset='slide'>
              You are almost done!
            </TextEffect>
          </CardTitle>
          <CardDescription><TextEffect per='char' preset='fade'>
            We have to connect your calendar to KalundurWiz.
          </TextEffect></CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            {/* this route in the link is taken care of by Nylas */}
            <Link href="/api/auth">
              <CalendarHeartIcon className="size-4" />
              <TextEffect per='char' preset='blur'>
                Connect your Calendar
              </TextEffect>
            </Link>
          </Button>
        </CardContent>
      </Card>

    </div>
  )
} 
