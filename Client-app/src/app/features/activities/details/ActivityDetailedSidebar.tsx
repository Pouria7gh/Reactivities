
function ActivityDetailedSideBar() {
  return (
    <div className="rounded-lg shadow-lg bg-base-200 shadow-gray-300 inset-ring inset-ring-gray-300 p-2">
      <div className="text-center rounded-t-lg bg-accent p-3 mb-2 text-white -m-2">3 people going</div>
      <div className="flex">
        <img src="/assets/user.png" alt="User" className="w-15 rounded-full" />
        <div className="ms-2 me-auto">
          <p className="mt-1">Bob</p>
          <p className="text-warning text-sm">following</p>
        </div>
        <div className="badge badge-warning mt-4">host</div>
      </div>
      <div className="divider m-0"></div>
      <div className="flex">
        <img src="/assets/user.png" alt="User" className="w-15 rounded-full" />
        <div className="ms-2 me-auto">
          <p className="mt-1">Mia</p>
          <p className="text-warning text-sm">following</p>
        </div>
      </div>
      <div className="divider m-0"></div>
      <div className="flex">
        <img src="/assets/user.png" alt="User" className="w-15 rounded-full" />
        <div className="ms-2 me-auto">
          <p className="mt-1">Morgan</p>
        </div>
      </div>
    </div>
  )
}

export default ActivityDetailedSideBar