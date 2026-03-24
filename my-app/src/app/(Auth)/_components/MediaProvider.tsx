import { FaGithub, FaGoogle } from 'react-icons/fa'
import { signIn } from 'next-auth/react'

type ProvidersType = "github" | "google"

const MediaProvider = () => {
  
    const signInProviderHandler = (provider : ProvidersType) => {
        signIn(provider,{redirectTo:"/profile"});
    }

    return (
        <div>
            <button
                onClick={() => signInProviderHandler('github')}
                type="button"
                className="w-full flex items-center gap-2 justify-center mt-5 bg-black py-2.5 rounded-full text-white cursor-pointer"
            >
                <FaGithub className="w-4 h-4" /> Go with Github
            </button>
            
            <button
                onClick={() => signInProviderHandler('google')}
                type="button"
                className="cursor-pointer w-full flex items-center gap-2 justify-center my-3 bg-white border border-gray-500/30 py-2.5 rounded-full text-gray-800"
            >
                <FaGoogle className="w-4 h-4" /> Go with Google
            </button>
        </div>
  )
}

export default MediaProvider