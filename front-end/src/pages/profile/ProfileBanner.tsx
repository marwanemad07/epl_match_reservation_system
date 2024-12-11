import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcn/avatar";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/shadcn/dialog";
import { useUserStore } from "@/stores/userStore";
import { AtSign, Ellipsis, LocateIcon, MapPin, User } from "lucide-react";
import { ParallaxBanner } from "react-scroll-parallax";

function ProfileBanner() {
  const username = useUserStore((state) => state.username);
  return (
    <section>
      <ParallaxBanner
        layers={[
          { image: "/registerBg.jpeg", speed: -20 },
          {
            speed: -15,
            children: (
              <div className="absolute inset-0 top-20 flex items-center justify-end p-20">
                <h1 className="text-8xl text-white font-thin capitalize">
                  Welcome, {username}!
                </h1>
              </div>
            ),
          },
        ]}
        className="h-96 w-screen"
      />
      <div className="w-full px-20 flex justify-between items-center h-20 border-b shadow-md">
        <Avatar className="w-52 h-52 relative bottom-14 shadow-lg">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback className="text-5xl text-slate-800 bg-gray-400 border-4">
            CN
          </AvatarFallback>
        </Avatar>

        <div className="flex w-1/2 justify-between items-center">
          <div className="flex gap-3">
            <AtSign />
            <h2>sofa5060@gmail.com</h2>
          </div>

          <div className="flex gap-3">
            <User />
            <h2>Fan</h2>
          </div>
          <div className="flex gap-3">
            <MapPin />
            <h2> Giza</h2>
          </div>
          <Dialog>
            <DialogTrigger
              title="Edit Profile"
              className="hover:bg-gray-200 transition-all ease-in-out duration-500 p-3 rounded-full"
            >
              <Ellipsis />
            </DialogTrigger>
            <DialogContent>hello there</DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
}

export default ProfileBanner;
