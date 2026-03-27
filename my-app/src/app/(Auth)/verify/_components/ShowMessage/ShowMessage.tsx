
import { GoVerified } from "react-icons/go";

interface ShowMessageProps {
    result: "success" | "error"
}

const ShowMessage = ({result}:ShowMessageProps) => {
  return (
    <div className="w-full text-center flex items-center justify-center flex-col gap-4">
        <div> <GoVerified size={80} className={`${result === "success" ? "text-green-600":"text-red-600"}`}/> </div>
        <div className={`text-4xl ${result === "success" ? "text-green-600":"text-red-600"}`}> 
            {result === "success" ? "Email verified successfully":"Something went wrong, try again"}    
        </div>
    </div>
  )
}

export default ShowMessage