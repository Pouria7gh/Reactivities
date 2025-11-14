import { useStore } from "../stores/Store"

function Navbar() {
  const { activityStore } = useStore();
  const { openForm } = activityStore;

  return (
    <div className="navbar bg-gradient-to-r from-blue-800 to-blue-300 shadow-sm">
        <div className='container flex mx-auto items-center px-2'>
            <img src="./assets/logo.png" width={40} className='me-2 ms-2' alt="logo" />
            <a href="#" className='inline-block me-5 md:me-12 lg:me-15 xl:me-20 text-xl text-white'>Reactivity</a>

            <button className='btn btn-ghost text-base text-white hover:text-black me-3'>Activities</button>
            <button className='btn btn-success text-base me-auto' onClick={() => openForm()}>Create Activity</button>

            <button className="btn btn-square btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path> </svg>
            </button>
        </div>
    </div>
  )
}

export default Navbar