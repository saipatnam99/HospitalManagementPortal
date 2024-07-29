import { NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div>
      <nav className="sticky flex-col flex-grow pb-4 md:pb-2 md:pt-2 md:flex md:justify-end md:flex-row bg-slate-400 text-white rounded-md">
        <Link
          href="/login"
          className="px-3 py-2 mt-2 text-md font-semibold bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline transition ease-in-out delay-150 bg-blue-500 hover:-translate-y-1 hover:scale-110  duration-300"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="px-3 py-2 mt-2 text-md font-semibold bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline transition ease-in-out delay-150 bg-blue-500 hover:-translate-y-1 hover:scale-110  duration-300"
        >
          SignUp
        </Link>
      </nav>

      <div>
        <h1 className=" text-black text-3xl p-8 w-full min-h-screen">
          Welcome to Hospital Management Portal
        </h1>
      </div>
      <footer className="absolute bottom-2 w-full py-4 text-center bg-gray-200">
        <p>Disclaimer and Copyright © 2024</p>
      </footer>
    </div>
  );
};
export default Home;
