import Link from "next/link";

export default function Custom500() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-orange-50 text-center px-4">
      <h1 className="text-7xl font-extrabold text-black">500</h1>
      <p className="mt-4 text-xl text-gray-800">
        Something went wrong on our end. We&apos;re working on it.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block bg-white text-black px-6 py-2 rounded-md shadow hover:bg-orange-600 hover:text-white transition"
      >
        Try again later or return home
      </Link>
    </div>
  );
}
