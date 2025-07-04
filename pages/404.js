import Link from "next/link";
export default function Custom404() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <h1 className="text-7xl font-extrabold text-black">404</h1>
      <p className="mt-4 text-xl text-gray-700">
        Oops! The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block bg-white text-black px-6 py-2 rounded-md shadow hover:bg-blue-700 hover:text-white transition"
      >
        Go back home
      </Link>
    </div>
  );
}
