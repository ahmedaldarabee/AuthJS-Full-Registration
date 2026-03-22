
const SpinnerLoader = () => {
  return (
    <div className="w-full flex justify-center items-center gap-2">
        <div
         role="status" aria-label="loading"
         className="animate-spin rounded-full h-5 w-5 border-b-4 border-white"></div>
         <span className="text-white block">wait...</span>
    </div>

  )
}

export default SpinnerLoader