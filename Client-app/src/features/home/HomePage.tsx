import { Link } from "react-router"

function HomePage() {
  return (
    <div className="h-screen bg-base-200 flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl font-bold mb-4">Welcome</h1>
      <p className="text-lg opacity-70 mb-8">
        This is your homepage. Navigate to activities below.
      </p>

      <Link to="/Activities" className="btn btn-link p-0">
        Go to Activities
      </Link>
    </div>
  )
}

export default HomePage