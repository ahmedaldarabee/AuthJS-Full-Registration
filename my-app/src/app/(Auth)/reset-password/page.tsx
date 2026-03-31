import { Suspense } from 'react';
import ResetPasswordForm from './_components/ResetPasswordForm/ResetPasswordForm';

const ResetPasswordPage = async () => {
    
    return (
        <div className='w-full min-h-screen flex items-center justify-center'>
            <Suspense>
                <ResetPasswordForm />
            </Suspense>
        </div>
  )
}

export default ResetPasswordPage