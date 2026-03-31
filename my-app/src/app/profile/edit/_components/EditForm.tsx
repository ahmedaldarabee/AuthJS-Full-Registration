"use client"

import React, { useEffect, useState } from 'react'
import SpinnerLoader from '@/components/Spinner/spinnerLoader';
import Link from 'next/link';
import ToastMessage from '@/components/Toast/ToastMessage';
import { TbEditOff } from "react-icons/tb";
import { getUserName, updateProfileAction } from '@/actions/authActions/Profile/profile.action';
import { editProfileSchemaValidation } from '@/utils/Validations';
import { useRouter } from 'next/navigation';

interface EditFormProps {
    userId: string,
    username: string;
}

const EditForm = ({userId}:EditFormProps) => {
    const router = useRouter();

    const [newName,setNewName] = useState("");
    const [clientError, setClientError] = useState<string>("");
    const [serverErrors, setServerErrors] = useState<string>("");
    const [serverSuccess, setServerSuccess] = useState<string>("");
    const [loading,setLoading] = useState<boolean>(false);


    const getName = async () => {
        await getUserName(userId).then((resolve) => {
            if(resolve.success){
                setNewName(resolve.message || "");
                console.log("user name return result: ", resolve.message)
            }
    
            if(!resolve.success){
                setServerErrors(resolve.message || "user not found");
            }
        });
    }

    useEffect(() => {
        getName();
    }, [userId]); // Run when userId changes

    const EditFormHandler = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        
        try {
            const validation = editProfileSchemaValidation.safeParse({username: newName});
            
            if(!validation.success){
                setClientError("Invalid username");
            }

            await updateProfileAction(validation.data!,userId).then((resolve) => {
                if(resolve.success){
                    setNewName("");
                    setClientError("");
                    setServerSuccess(resolve.message);
                }

                if(!resolve.success){
                    setServerSuccess("");
                    setServerErrors(resolve.message);
                }
            });

            router.push("/profile");

        } catch (error) {
            console.log("Error: ", error);

        }finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full bg-white border border-slate-300 text-gray-500 max-w-96 mx-4 md:p-6 p-4 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 cursor-pointer">
                Edit Profile Name
            </h2>

            <form onSubmit={EditFormHandler}>
                <input
                    id="newName"
                    className="w-full bg-transparent border my-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4"
                    type="text"
                    placeholder="Enter new name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />

                <button
                    disabled={loading}
                    type="submit"
                    className="flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:pointer-events-none w-full mb-3 bg-sky-600 hover:bg-sky-700 transition-all duration-300 py-2.5 rounded-full text-white cursor-pointer"
                >
                    { loading ? <SpinnerLoader /> : "Edit" }
                    { loading ? null : <TbEditOff size={17} /> }
                    
                </button>
            </form>

            <Link
                className="w-full flex items-start justify-center capitalize text-xs hover:text-black hover:scale-105 transition-all duration-200"
                href={"/profile"}
            >
                back to profile
            </Link>
    
            { serverSuccess && <ToastMessage message={serverSuccess} messageType="success" /> }
            { serverErrors && <ToastMessage message={serverErrors} messageType="error" /> }
            { clientError && <ToastMessage message={clientError} messageType="error" /> }

        </div>
    );
}

export default EditForm