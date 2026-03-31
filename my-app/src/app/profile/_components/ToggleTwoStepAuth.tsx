"use client"

import { toggleTwoStepAuthAction } from "@/actions/authActions/Verifications/twoStepAuth.action";
import ToastMessage from "@/components/Toast/ToastMessage";
import React, { useState } from "react";


interface ToggleTwoStepAuthProps {
  userId: string,
  isTwoStepEnabled: boolean;
}

const ToggleTwoStepAuth = ({userId,isTwoStepEnabled}:ToggleTwoStepAuthProps) => {
  
  const [isEnabled,setIsEnabled] = useState(isTwoStepEnabled);
  const [serverSuccess, setServerSuccess] = useState<string>("");
  const [serverErrors, setServerErrors] = useState<string>("");

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerSuccess("");
    setServerErrors("");

    await toggleTwoStepAuthAction(userId,isEnabled).then((resolve) => {
        
        if(resolve.success){
          setServerSuccess(`user now is ${isEnabled ? 'enabled': 'disable'} two step authentication `);
        }
        
        if(!resolve.success){
          setServerErrors(resolve.message);
        }

    }).catch((error) => {
      console.log("error about 2 step authentications: ", error);
      setServerErrors("Something went wrong");
    })
  }

  return (
    <form onSubmit={onSubmitHandler}>
      
      <div className="flex items-center gap-4 my-2">
          <input
            id="toggleTwoStepAuth" 
            type="checkbox"
            checked={isEnabled}
            onChange={(e) => setIsEnabled(e.target.checked)}
            />

          <label 
            className="block cursor-pointer"
            htmlFor="toggleTwoStepAuth">Enable / disable two step authentication</label>
      </div>

            <button
              type="submit"
              className="block w-full transition-all duration-200 bg-sky-500 px-4 py-1 rounded-md text-white cursor-pointer hover:bg-sky-700"
            > Save </button>
          
          { serverSuccess && <ToastMessage message={serverSuccess} messageType="success" /> }
          { serverErrors && <ToastMessage message={serverErrors} messageType="error" /> }

    </form>
  )
}

export default ToggleTwoStepAuth