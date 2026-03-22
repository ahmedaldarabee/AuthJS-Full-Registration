import Link from "next/link";
import { CiLogin } from "react-icons/ci";

export default function Home() {
  return (
   <main className="bg-slate-100 w-full min-h-screen flex items-center justify-center flex-col gap-2">
      <div>
        <h3 className="capitalize text-2xl">welcome in home page</h3>
      </div>      
      <div>
          <Link 
          className="cursor-pointer flex items-center gap-2 hover:bg-sky-700 transition-all duration-200 bg-sky-500 py-1 px-4 rounded-md text-white"
          href={"/login"}>
            Login
            <CiLogin size={23} />
          </Link>
      </div>
   </main>
  );
}
