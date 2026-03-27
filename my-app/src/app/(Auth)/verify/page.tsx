import { verificationEmailAction } from "@/actions/authActions/Verifications/verification.action";
import ShowMessage from "./_components/ShowMessage/ShowMessage";
import Link from "next/link";
import { CiLogin } from "react-icons/ci";


interface VerifyEmailPageProps{
    searchParams: Promise<{
        token: string
    }>
}

const VerifyEmailPage = async ({searchParams}: VerifyEmailPageProps) => {
    const searchParamsData = await searchParams;
    const result = await verificationEmailAction(searchParamsData.token);

    return (
    <div className="w-full min-h-screen flex items-center justify-center flex-col gap-4">
        {result.success ? <ShowMessage result="success"/>:<ShowMessage result="error"/>}
         
         <Link className="cursor-pointer flex items-center gap-2 hover:bg-sky-700 transition-all duration-200 bg-sky-500 py-1 px-4 rounded-md text-white"
          href={"/login"}> Login <CiLogin size={23} /> </Link>
    </div>
  )
}

export default VerifyEmailPage