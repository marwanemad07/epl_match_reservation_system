import { Outlet } from "react-router-dom";

function HomeLayout() {
  return (
    <div>
      layout
      <Outlet />
    </div>
  );
}

export default HomeLayout;
