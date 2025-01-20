import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold text-center sm:text-left">
          ONI Rocket Calculator (Base Game)
        </h1>
        <p className="text-center sm:text-left">
          A simple calculator to help you calculate the cost of your rocket
          launch.
        </p>
        <Link
          href="/calculator"
          className="px-4 py-2 text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600"
        >
          Get Started
        </Link>
        
      </main>

    </div>
  );
}
