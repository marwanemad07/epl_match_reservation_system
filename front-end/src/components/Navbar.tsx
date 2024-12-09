import { Link } from "react-router-dom";
import Logo from "./Logo";
import { Avatar, AvatarFallback, AvatarImage } from "./shadcn/avatar";
import { Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./shadcn/dropdown-menu";
import { toast } from "react-toastify";

function Navbar() {
  const user = {
    id: 5,
  };

  // TODO: search functionality, login navigation (state), logout functionality

  const handleLogout = () => {
    console.log("logout");
    toast.success("Logged out successfully");
  };

  return (
    <section className="w-screen sticky flex justify-between items-center py-4 px-24 border-b shadow-md bg-opacity-60 backdrop-blur-xl">
      <div className="flex items-center gap-10">
        <div className="flex gap-3 items-center">
          {/* LOGO */}
          <Logo className="w-9" />
          <h3 className="text-3xl font-bold text-blue-800">Tickestria</h3>
        </div>
        {/* <nav className="text-muted-foreground text-md font-semibold">
          <Link
            to="/matches"
            className="hover:text-primary transition-colors duration-300"
          >
            Matches
          </Link>
        </nav> */}
      </div>

      <div className="flex items-center gap-8">
        {/* SEARCH */}
        <div className="w-60 rounded-lg shadow-sm border-2 outline-none flex gap-2 h-9 border-input focus-visible:shadow-md duration-200 ease-in-out bg-transparent px-3 py-1 text-base transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
          <label htmlFor="searchInput" className="w-[10%] cursor-pointer">
            <Search className="w-full text-muted-foreground" />
          </label>
          <input
            type="text"
            id="searchInput"
            placeholder="Search Matches"
            className="outline-none focus-visible:outline-none w-[80%]"
          />
        </div>

        {/* ICON */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="cursor-pointer">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={10}>
            {user ? (
              <>
                <DropdownMenuItem>
                  <Link className="w-full" to={`/profile/${user.id}`}>
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem>
                  <Link
                    className="w-full"
                    to="/register"
                    state={{ isLogin: false }}
                  >
                    Signup
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link
                    className="w-full"
                    to="/register"
                    state={{ isLogin: true }}
                  >
                    Login
                  </Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </section>
  );
}

export default Navbar;
