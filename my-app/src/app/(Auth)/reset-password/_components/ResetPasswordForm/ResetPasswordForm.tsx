"use client"

import { resetPasswordAction } from '@/actions/authActions/Verifications/resetPassword.action';
import SpinnerLoader from '@/components/Spinner/spinnerLoader';
import ToastMessage from '@/components/Toast/ToastMessage';
import { resetPasswordSchemaValidation } from '@/utils/Validations';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react'
import { GrPowerReset } from "react-icons/gr";

const ResetPasswordForm = () => {
    const searchToken = useSearchParams().get('token');
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");

    const [clientErrors, setClientErrors] = useState<string>("");
    const [serverErrors, setServerErrors] = useState<string>("");
    const [serverSuccess, setServerSuccess] = useState<string>("");
    const [loading,setLoading] = useState<boolean>(false);

    const onFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {

            const validation = resetPasswordSchemaValidation.safeParse({newPassword});

            if(!validation.success || newPassword !== confirmNewPassword){
                return setClientErrors("Enter corrected password");
            }

            if(!searchToken){
                return setClientErrors("Sorry , there is no token for you!");
            }
            
            // why after user add own data like new password and confirm passowrd correctly and matched each other, it doesn't clear the inputs?
            await resetPasswordAction({newPassword},searchToken).then((resolve) => {
                if(resolve.success){
                    setNewPassword("");
                    setConfirmNewPassword("");
                    setServerErrors("");
                    setServerSuccess(resolve.message);
                }
                if(!resolve.success){
                    setServerErrors(resolve.message);
                }

            }).catch ((error) => {
                console.log("error about reset password: ", error.message);
            })
            
        } catch (error) {
            setClientErrors("something went error, please try again");
        }finally{
            setLoading(false);
        }
    };
    
    return (
        <div className="w-full bg-white border border-slate-300 text-gray-500 max-w-96 mx-4 md:p-6 p-4 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10">
                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 cursor-pointer">
                    Confirm Your Password
                </h2>

                <form onSubmit={onFormSubmit}>
                    <input
                        id="password"
                        className="w-full bg-transparent border my-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4"
                        type="password"
                        placeholder="Enter your password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    
                    <input
                        id="confirmNewPassword"
                        className="w-full bg-transparent border my-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4"
                        type="password"
                        placeholder="confirm your password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                    
                    <button
                        disabled={loading}
                        type="submit"
                        className="flex items-center justify-center gap-2 text-base disabled:bg-gray-400 disabled:pointer-events-none w-full mb-3 bg-sky-600 hover:bg-sky-700 transition-all duration-300 py-2.5 rounded-full text-white cursor-pointer"
                    >
                        { loading ? <SpinnerLoader /> : "Confirm" }
                        { loading ? null : <GrPowerReset size={20} /> }
                    </button>
                    
                    

                    <Link
                        className="w-full flex items-start justify-center capitalize text-xs hover:text-black hover:scale-105 transition-all duration-200"
                        href={"/login"}
                    >
                        back to login
                    </Link>

                    { clientErrors && <ToastMessage message={clientErrors} messageType="error" /> }
                    { serverErrors && <ToastMessage message={serverErrors} messageType="error" /> }
                    {/* 
                        here, why after i reset the password the message doesn't show ? and when i access login to set new password,
                        that show invalid signin
                    */}
                    { serverSuccess && <ToastMessage message={serverSuccess} messageType="success" /> }

                </form>
            </div>
    )
}

export default ResetPasswordForm