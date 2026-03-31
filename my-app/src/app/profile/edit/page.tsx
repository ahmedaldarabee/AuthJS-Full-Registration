"use server"

import { auth } from '@/auth';
import EditForm from './_components/EditForm';

const EditProfilePage = async() => {
    const session = await auth();
    
    return (
       <div className='w-full min-h-screen flex items-center justify-center'>
            
            {/* this way session?.user && .... also || "" -> to avoid build errors  */}
            {
                session?.user && 
                
                <EditForm 
                    userId={session?.user?.id || ""} 
                    username={session?.user?.username || ""} />
            }

       </div>
    );
}

export default EditProfilePage