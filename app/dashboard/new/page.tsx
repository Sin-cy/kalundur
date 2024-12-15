import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function NewEventRoute() {
  return (
    <div className="flex h-full w-full flex-1 items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Add new appointment type</CardTitle>
          <CardDescription>
            appointment that allows other people to book you
          </CardDescription>
        </CardHeader>
        <form>
          <CardContent className="grid gap-y-5">
            <div className="flex flex-col gap-y-2">
              <Label>Title</Label>
              <Input placeholder="30 mins meeting" />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>URL Slug</Label>
              <div className="flex rounded-md">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-muted bg-muted px-3 text-sm text-muted-foreground">
                  Kalundur.com/
                </span>
                <Input className="rounded-l-none" placeholder="example-url-1" />
              </div>
            </div>

            <div className="flex flex-col gap-y-2 ">
              <Label>Description</Label>
              <Textarea placeholder="enter you message..."/>
            </div>

            <div className="flex flex-col gap-y-2">
              <Label>Duration</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Duration</SelectLabel>
                    <SelectItem value="15" >15 mins</SelectItem>
                    <SelectItem value="30" >30 mins</SelectItem>
                    <SelectItem value="45" >45 mins</SelectItem>
                    <SelectItem value="60" >1 hour</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
