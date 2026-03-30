"use client"

import { resetPasswordAction } from '@/actions/authActions/Verifications/resetPassword.action';
import SpinnerLoader from '@/components/Spinner/spinnerLoader';
import ToastMessage from '@/components/Toast/ToastMessage';
import { resetPasswordSchemaValidation } from '@/utils/Validations';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react'
import { GrPowerReset } from "react-icons/gr";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

const ResetPasswordForm = () => {
    const searchToken = useSearchParams().get('token');
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");

    const [clientErrors, setClientErrors] = useState<string>("");
    const [serverErrors, setServerErrors] = useState<string>("");
    const [serverSuccess, setServerSuccess] = useState<string>("");
    const [loading,setLoading] = useState<boolean>(false);


    // show eye icon for password and confirm password
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    const onFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setClientErrors("");
        setServerErrors("");
        setServerSuccess("");

        try {

            const validation = resetPasswordSchemaValidation.safeParse({newPassword});

            if(!validation.success || newPassword !== confirmNewPassword){
                setLoading(false);
                return setClientErrors("Please ensure passwords are correct and match each other.");
            }

            if(!searchToken){
                setLoading(false);
                return setClientErrors("Token is missing or invalid.");
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

                <form onSubmit={onFormSubmit} className='relative'>
                    <input
                        id="password"
                        className="w-full bg-transparent border my-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    {
                        showPassword ? 
                        <> <FaEyeSlash 
                        onClick={() => setShowPassword(false)}
                        className='absolute top-6 right-4 cursor-pointer' size={20} /> </>
                        : 
                        <> <FaEye 
                        onClick={() => setShowPassword(true)}
                        className='absolute top-6 right-4 cursor-pointer' size={20} /> </>
                    }
                    
                    <input
                        id="confirmNewPassword"
                        className="w-full bg-transparent border my-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="confirm your password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />

                    {
                        showConfirmPassword ? 
                        <> <FaEyeSlash 
                            onClick={() => setShowConfirmPassword(false)}
                            className='absolute top-22 right-4 cursor-pointer' size={20} /> </>
                        : 
                        <> <FaEye 
                        onClick={() => setShowConfirmPassword(true)}
                        className='absolute top-22 right-4 cursor-pointer' size={20} /> </>
                    }
                    
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
                
                    { serverSuccess && <ToastMessage message={serverSuccess} messageType="success" /> }

                </form>
            </div>
    )
}

export default ResetPasswordForm