import Image from "next/image";
import { AuthModal } from "./AuthModal";
import HeroBg from "@/public/tothestars.png";

export function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center py-12 lg:py-20">
      <div className="text-center">
        <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium tracking-tight text-primary">
          Welcome to Kalundur
        </span>
        <h1 className="mt-8 text-4xl font-medium leading-none sm:text-6xl md:text-7xl lg:text-8xl">
          Automate schedule meetings{" "}
          <span className="-mt-2 block text-primary">
            with your calendar
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground lg:text-lg">
          Setting up meetings can be hard but with Kalundur its as
          easy as a few buttons to get you and your clients ready to
          go!
        </p>

        <div className="mb-12 mt-5">
          <AuthModal />
        </div>
      </div>

      <div className="relative mx-auto mt-12 w-full items-center py-12">
        <Image
          src={HeroBg}
          alt="Hero Bg"
          className=" relative w-full rounded-lg border border-sky-200 object-cover shadow-2xl shadow-sky-500  lg:rounded-2xl"
        />
      </div>
    </section>
  );
}
