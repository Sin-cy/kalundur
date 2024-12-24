import { redirect } from "next/navigation";
import { Navbar } from "./components/Navbar";
import { auth } from "./utils/auth";
import { Hero } from "./components/Hero";

export default async function Home() {
    // this should now open us in the dashboard (if we are already authenticated)
    const session = await auth();
    if(session?.user) {
        // redirect from the next navigation
        return redirect("/dashboard")
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Navbar />
            <Hero />
        </div>
    );
}
