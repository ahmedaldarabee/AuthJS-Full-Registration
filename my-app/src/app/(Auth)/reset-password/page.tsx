import ShowMessage from '../verify/_components/ShowMessage/ShowMessage';
import Link from 'next/link';
import { CiLogin } from 'react-icons/ci';
import ResetPasswordForm from './_components/ResetPasswordForm/ResetPasswordForm';

const ResetPasswordPage = async () => {
 
    return (
        <div className='w-full min-h-screen flex items-center justify-center'>
            <ResetPasswordForm />
        </div>
  )
}

export default ResetPasswordPage