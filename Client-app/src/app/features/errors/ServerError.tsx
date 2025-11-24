import { Link } from "react-router"
import { useStore } from "../../stores/Store"

function ServerError() {
    const {commonStore} = useStore();
  return (
    <div className="min-h-[calc(100vh-70px)] top-0 flex flex-col items-center justify-center bg-base-200 text-center">
        <div className="w-full">
            <h1 className="text-5xl font-bold text-primary mb-4 mt-10">{commonStore.serverError?.status} Server Error</h1>
            <h2 className="text-xl font-semibold mb-4">{commonStore.serverError?.message}</h2>
            <div className="container mx-auto px-10 text-left">
                {commonStore.serverError?.details}
            </div>
            <Link
            to="/Activities"
            className="btn btn-primary btn-wide rounded-2xl shadow-lg hover:shadow-xl transition-all my-5"
            >
            Go Back To Activities
            </Link>
        </div>
    </div>
  )
}

export default ServerError