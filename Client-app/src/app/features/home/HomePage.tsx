import { Link } from "react-router"

function HomePage() {
  return (
    <div className="h-screen bg-gradient-to-r from-blue-800 to-blue-300 flex flex-col items-center justify-center text-center px-4">
      <div className="flex items-center mb-2">
        <img src="/assets/logo.png" alt="Logo" className="w-20 me-1" />
        <h1 className="text-5xl font-bold mb-4 text-white pt-2">Reactivities</h1>
      </div>
      <p className="text-lg opacity-70 text-white">
        Welcome to Reactivities
      </p>

      <Link to="/Activities" className="btn btn-link p-0 text-blue-100">
        Go to Activities
      </Link>
    </div>
  )
}

export default HomePage