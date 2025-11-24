import { NavLink } from "react-router";

function Navbar() {

  return (
    <div className="navbar bg-gradient-to-r from-blue-800 to-blue-300 shadow-sm">
      <div className="container flex mx-auto items-center px-2">
        <NavLink className="flex me-5 md:me-12 lg:me-15 xl:me-20" to="/">
          <img src="/assets/logo.png" width={40} className="me-2" alt="logo" />
          <span className="inline-block self-center text-xl text-white">
            Reactivity
          </span>
        </NavLink>

        <NavLink
          to="/Activities"
          className={({ isActive }) => `btn btn-ghost ${
            isActive ? "btn-active" : "text-white"
          }
            hover:text-black text-base me-3`}
        >
          Activities
        </NavLink>

        <NavLink
          to="/CreateActivity"
          className={({ isActive }) => `btn btn-ghost me-3 text-base hover:text-black ${
            isActive ? "btn-active text-black" : "text-white"
          }`}
        >
          Create Activity
        </NavLink>

        <NavLink
          to="/Errors"
          className={({ isActive }) => `btn btn-ghost me-3 text-base hover:text-black ${
            isActive ? "btn-active text-black" : "text-white"
          }`}
        >
          Errors
        </NavLink>
      </div>
    </div>
  );
}

export default Navbar;
