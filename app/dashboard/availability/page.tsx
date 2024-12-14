// this is a route - use export default
// creating the availablity route

import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";


// Render on Client Page
// async if safe here - this is a Server Component
export default async function AvailabilityRoute() {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Availability</CardTitle>
        <CardDescription>
          A place to manage your availablity.
        </CardDescription>
      </CardHeader>
      <form>
        <CardContent>
        </CardContent>
      </form>

    </Card>    
  )

}
