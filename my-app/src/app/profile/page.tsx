import { LogoutAction } from "@/actions/authActions/Login/auth.action";
import { auth } from "@/auth"
import ToggleTwoStepAuth from "./_components/ToggleTwoStepAuth";
import Image from "next/image";
import Link from "next/link";
import { TbEditOff } from "react-icons/tb";

const Profile = async () => {
    const session = await auth();

    return (
        <div className='w-full min-h-screen flex items-center justify-center text-center bg-slate-100'>
            <div className='bg-white w-full max-w-md flex items-center justify-between gap-4 flex-col mx-auto border hover:border-sky-500 transition-all duration-200 cursor-pointer border-sky-600 p-4 rounded-4xl'>               
               <div className="space-y-2 w-full">
                    <div className="flex items-center justify-between">
                        
                        <div className="flex items-start gap-2   flex-col">
                            <h2>Name: <strong> { session?.user?.username || "ahmed al darabee" } </strong></h2>
                            <p>Email: { session?.user?.email }</p>
                            <p>Role: { session?.user?.role }</p>
                            <Link 
                                className="block bg-sky-500 hover:bg-sky-700 transition-all duration-200 px-2 py-1 text-white rounded-xl text-sm"
                                href={"/profile/edit"}> 
                                
                                <TbEditOff className="inline-block mr-2"/>
                                Edit your name </Link>
                        </div>
                        
                        <Image 
                            src={"/imgs/profile-page/user-img-2.jpg"}
                            alt="profile"
                            width={150} height={150}
                            className="object-cover object-center w-32 h-32" />
                    </div>
                    
                    <form action={LogoutAction} className="w-full block space-y-4">
                    {
                        session?.user.id && 
                        <ToggleTwoStepAuth
                            userId={session?.user.id}
                            isTwoStepEnabled={session?.user.isTwoStepEnabled}/>
                    }
                        <button type="submit" className="w-full  cursor-pointer flex justify-center items-center gap-2 hover:bg-sky-700 transition-all duration-200 bg-sky-500 py-1 px-4 rounded-md text-white">
                            Logout
                        </button>
                    </form>
               </div>
                
            </div>
        </div>
    )
}

export default Profile