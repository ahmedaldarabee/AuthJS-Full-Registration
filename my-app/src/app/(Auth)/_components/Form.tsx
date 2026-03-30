"use client";

import Link from "next/link";
import React, { useState } from "react";
import { loginSchemaValidation , registerSchemaValidation} from "@/utils/Validations";
import ToastMessage from "@/components/Toast/ToastMessage";
import SpinnerLoader from "@/components/Spinner/spinnerLoader";
import { LoginAction } from "@/actions/authActions/Login/auth.action";
import { RegisterAction } from "@/actions/authActions/Register/auth.action";
import { MdOutlineLogin } from "react-icons/md";
import { FormProps, validationProcessProps } from "@/types/Form/Form";
import MediaProvider from "./MediaProvider";

const Form = React.memo(({ FormType }: FormProps) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  
  const [clientErrors, setClientErrors] = useState<string[] | string>([]);
  const [serverErrors, setServerErrors] = useState<string>("");
  const [serverSuccess, setServerSuccess] = useState<string>("");
  const [loading,setLoading] = useState<boolean>(false);


  // for handling code
  const [showTwoStep,setShowTwoStep] = useState(false);
  const [code,setCode] = useState("");

  const [submitCount, setSubmitCount] = useState(0);

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setClientErrors([]); 
    setServerErrors("");
    setServerSuccess("");
    setSubmitCount(prev => prev + 1); 
    validationProcess({ email, password, username });
  };

  const validationProcess = async ({ email, username = '', password }: validationProcessProps) => {
    setLoading(true);
    try {
      let result;

      if (FormType === "Login") {
        result = loginSchemaValidation.safeParse({ email, password , code});
        
        await LoginAction({ email, password,code }).then((resultOfServer) => {
          if(resultOfServer?.success){
            setClientErrors("");
            setServerErrors("");
            setServerSuccess(resultOfServer?.message || "Login successful");
          } else {
            setServerErrors(resultOfServer?.message || "Invalid credentials");
          }

          if(resultOfServer.twoStep){
            setShowTwoStep(true);
          }
        });
       
      } else {
        result = registerSchemaValidation.safeParse({ email, username, password });
        
        await RegisterAction({ email, password , username }).then((resultOfServer) => {
          if(resultOfServer.success){
            clearFormFields();
            setServerSuccess(resultOfServer.message);
          }else{
            setServerSuccess("");
            setServerErrors(resultOfServer.message);
          }
        });
      }

      if (!result.success) {
        setClientErrors(result.error.issues.map(issue => issue.message));
      }
    } catch (error) {
      console.error("Auth process error:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearFormFields = () => {
    setEmail("");
    setPassword("");
    setUsername("");
  };

  return (
    <div className="bg-white border border-slate-300 text-gray-500 max-w-96 mx-4 md:p-6 p-4 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 cursor-pointer">
        {FormType === "Login" ? "Welcome Back" : "Create New Account"}
      </h2>


      {[...clientErrors, ...(serverErrors ? [serverErrors] : [])].map((error, index) => (
        <ToastMessage 
          key={`${submitCount}-${index}`} 
          message={error} 
          messageType="error" 
        />
      ))}

      <form onSubmit={onFormSubmit}>

        {FormType === "Register" && (
          <input
            id="username"
            className="w-full bg-transparent border my-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4"
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        )}

        {
          showTwoStep ? <>
              <input
                id="code"
                className="w-full bg-transparent border my-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4"
                type="text"
                placeholder="Enter your verification code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
          </>:<>
          
            <input
              id="email"
              className="w-full bg-transparent border my-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
    
            <input
              id="password"
              className="w-full bg-transparent border mt-1 mb-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </>
        }

        <div className="py-2 ps-3 pb-4">
          <Link href="/forget-password" className={`${FormType === "Register" ? "hidden":"text-blue-600 underline"}`}>
            Forgot Password
          </Link>
        </div>

        <button
          disabled={loading}
          type="submit"
          className="flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:pointer-events-none w-full mb-3 bg-sky-600 hover:bg-sky-700 transition-all duration-300 py-2.5 rounded-full text-white cursor-pointer"
        >
          { loading ? <SpinnerLoader /> : FormType === "Login" ? showTwoStep ? "Confirm the code" : "Login" : "Register" }
          { loading ? null : <MdOutlineLogin size={21} /> }
        </button>
      </form>


      <p className={`text-center mt-4`}>
        {FormType === "Register" ? "Go to " : " Don’t have an account? "}

        <Link
          href={FormType === "Register" ? "/login" : "/register"}
          className="text-blue-500 underline"
        >
          {FormType === "Login" ? "Register" : "Login"}
        </Link>
      </p>

      <MediaProvider/>

      <Link
        className="w-full flex items-start justify-center capitalize text-xs hover:text-black hover:scale-105 transition-all duration-200"
        href={"/"}
      >
        back to home
      </Link>
      
      {
        serverSuccess &&
          <ToastMessage
           message={serverSuccess}
           messageType="success"
          />
      }
    </div>
  );
});

export default Form;
