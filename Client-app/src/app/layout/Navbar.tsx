import { Link, NavLink } from "react-router";
import { useStore } from "../stores/Store";
import type { CSSProperties } from "react";
import { observer } from "mobx-react-lite";

function Navbar() {
  const {userStore: {user, logout, isLoggedIn}} = useStore();

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
          className={({ isActive }) => `btn btn-ghost me-auto text-base hover:text-black ${
            isActive ? "btn-active text-black" : "text-white"
          }`}
        >
          Errors
        </NavLink>

        {isLoggedIn &&
        <div className="flex items-center">
          <img
            src={user?.image || "/assets/user.png"}
            alt="user"
            className="rounded-full w-10"
          />
          <button className="btn btn-link p-0 ps-2 text-white hover:text-gray-300" popoverTarget="profile-dropdown" 
            style={{ anchorName: "--profile-anchor" } as CSSProperties}>
            {user?.displayName}
          </button>
          <ul className="dropdown dropdown-end mt-1 menu w-52 rounded-box bg-base-100 shadow-sm"
            popover="auto" id="profile-dropdown" style={{ positionAnchor: "--profile-anchor" } as CSSProperties}>
            <li><Link to={`/Profiles/${user?.username}`}>Profile</Link></li>
            <li className="text-error"><Link to="/" onClick={logout}>Logout</Link></li>
          </ul>
        </div>}
      </div>
    </div>
  );
}

export default observer(Navbar);
