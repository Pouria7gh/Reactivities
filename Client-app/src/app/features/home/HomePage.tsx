import { Link } from "react-router"
import { useStore } from "../../stores/Store";
import LoginForm from "../users/LoginForm";
import RegisterForm from "../users/RegisterForm";

function HomePage() {
  const {userStore, modalStore} = useStore();

  return (
    <div 
      className="h-screen flex flex-col items-center justify-center text-center px-4"
      style={{background: "linear-gradient(45deg, #1e40af, #60a5fa)"}}
    >
      <div className="flex items-center">
        <img src="/assets/logo.png" alt="Logo" className="w-15 me-1" />
        <h1 className="text-6xl font-bold mb-4 text-white pt-2">Reactivities</h1>
      </div>
      <p className="text-lg opacity-90 text-white font-bold">
        Welcome to Reactivities
      </p>
      {!userStore.isLoggedIn &&
      <div className="mt-2">
        <button onClick={() => modalStore.openModal(LoginForm)} className="btn btn-outline text-white font-bold mt-3 hover:text-gray-700 me-2">
          Login
        </button>
        <button onClick={() => modalStore.openModal(RegisterForm)} className="btn btn-outline text-white font-bold mt-3 hover:text-gray-700">
          Register
        </button>
      </div>}
      {userStore.isLoggedIn &&
      <Link to="/Activities" className="btn btn-outline text-white font-bold mt-3 hover:text-gray-700">
        View Activities
      </Link>}
    </div>
  )
}

export default HomePage