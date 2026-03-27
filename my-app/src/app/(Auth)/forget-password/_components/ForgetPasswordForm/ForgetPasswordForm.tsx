"use client"

import { forgetPasswordAction } from '@/actions/authActions/Verifications/forgetPassword.action';
import SpinnerLoader from '@/components/Spinner/spinnerLoader';
import ToastMessage from '@/components/Toast/ToastMessage';
import { forgetPasswordSchemaValidation } from '@/utils/Validations';
import Link from 'next/link';
import React, { useState } from 'react'
import { IoMdMailUnread } from "react-icons/io";

const ForgetPasswordForm = () => {
  const [email, setEmail] = useState<string>("");
  const [clientErrors, setClientErrors] = useState<string>("");
  const [serverErrors, setServerErrors] = useState<string>("");
  const [serverSuccess, setServerSuccess] = useState<string>("");
  const [loading,setLoading] = useState<boolean>(false);

    const onFormSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
            const validation = forgetPasswordSchemaValidation.safeParse({email});
            
            if(!validation.success){
                return setClientErrors("Enter correct email address");
            }
            
            await forgetPasswordAction({email}).then((resolve) => {
                if(resolve.success){
                    setClientErrors("");
                    setServerErrors("");
                    setEmail("");
                    setServerSuccess(resolve.message);
                }
                
                if(!resolve.success){
                    setServerSuccess("");
                    setServerErrors(resolve.message);
                }
            });

        } catch (error) {
            setClientErrors("something went error, please try again");
        }finally{
            setLoading(false);
        }
    };

    return (
        <div className="w-full bg-white border border-slate-300 text-gray-500 max-w-96 mx-4 md:p-6 p-4 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 cursor-pointer">
                Forget Password
            </h2>

            <form onSubmit={onFormSubmit}>
                <input
                    id="email"
                    className="w-full bg-transparent border my-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button
                    disabled={loading}
                    type="submit"
                    className="flex items-center justify-center gap-2 text-base disabled:bg-gray-400 disabled:pointer-events-none w-full mb-3 bg-sky-600 hover:bg-sky-700 transition-all duration-300 py-2.5 rounded-full text-white cursor-pointer"
                >
                    { loading ? <SpinnerLoader /> : "Submit" }
                    { loading ? null : <IoMdMailUnread size={20} /> }
                </button>
                

                <Link
                    className="w-full flex items-start justify-center capitalize text-xs hover:text-black hover:scale-105 transition-all duration-200"
                    href={"/login"}
                    >
                    back to login
                </Link>

                { clientErrors && <ToastMessage message={clientErrors} messageType="error" /> }
                { serverSuccess && <ToastMessage message={serverSuccess} messageType="success" />}
            </form>
        </div>
    );
}

export default ForgetPasswordForm