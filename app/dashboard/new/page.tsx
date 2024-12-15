import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NewEventRoute(){
  return (
    <div className="w-full h-full flex flex-1 items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Add new appointment type</CardTitle>
          <CardDescription>appointment that allows other people to book you</CardDescription>
        </CardHeader>
        <form>
          <CardContent className="grid gap-y-5">
            <div className="flex flex-col gap-y-2">
              <Label >Title</Label>
              <Input placeholder="30 mins meeting"/>
            </div>
            <div className="flex flex-col gap-y-2" >
              <Label>URL Slug</Label>
              <div className="flex items-center rounded-md">
                <span>
                  Kalundur.com/
                </span>
                <Input placeholder="example-url-1"/>
              </div>
            </div>
          </CardContent>
        </form>
      </Card>

    </div>
  )
}
