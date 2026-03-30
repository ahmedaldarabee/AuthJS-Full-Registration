import { LogoutAction } from "@/actions/authActions/Login/auth.action";
import { auth } from "@/auth"
import { CiLogout } from "react-icons/ci";
import ToggleTwoStepAuth from "./_components/ToggleTwoStepAuth";


const Profile = async () => {
    const session = await auth();

    return (
        <div className='w-full min-h-screen flex items-center justify-center text-center'>
            <div className='w-full max-w-md flex items-center justify-center gap-4 flex-col mx-auto'>
                <p>{JSON.stringify(session)}</p>
               
                <h2>Welcome <strong> { session?.user?.username || "ahmed al darabee" } </strong>  in profile page</h2>
                <p>your email: { session?.user?.email }</p>
                
                <form action={LogoutAction}>
                    <button type="submit" className="cursor-pointer flex items-center gap-2 hover:bg-sky-700 transition-all duration-200 bg-sky-500 py-1 px-4 rounded-md text-white">
                        <CiLogout size={23} />
                        Logout
                    </button>
                </form>
                
                {
                    session?.user.id && 
                    <ToggleTwoStepAuth
                        userId={session?.user.id}
                        isTwoStepEnabled={session?.user.isTwoStepEnabled}/>
                }
            </div>
        </div>
    )
}

export default Profile