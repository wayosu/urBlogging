import { useContext } from "react";
import AnimationWrapper from "../common/page-animation";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import { removeFromSession } from "../common/session";

const UserNavigationPanel = () => {
  const {
    userAuth: { username },
    setUserAuth,
  } = useContext(UserContext);

  const signOutUser = () => {
    removeFromSession("user");
    setUserAuth({ accessToken: null });
  };

  return (
    <AnimationWrapper transition={{ duration: 0.2 }}>
      <div
        className="
          bg-white 
          absolute 
          top-[65px]
          right-0 
          border 
          border-grey 
          w-60 
          duration-200
        "
      >
        <Link
          to="/editor"
          className="flex gap-2 link md:hidden pl-8 py-4"
        >
          <i className="fi fi-rr-pen-clip"></i>
          <p>Write</p>
        </Link>

        <Link
          to={`/user/${username}`}
          className="flex gap-2 link md:hidden pl-8 py-4"
        >
          <p>Profile</p>
        </Link>

        <Link
          to="/dashboard/blogs"
          className="flex gap-2 link md:hidden pl-8 py-4"
        >
          <p>Dashboard</p>
        </Link>

        <Link
          to="/dashboard/edit-profile"
          className="flex gap-2 link md:hidden pl-8 py-4"
        >
          <p>Settings</p>
        </Link>

        <span className="absolute border-t border-grey w-[100%] md:hidden"></span>

        <button
          onClick={signOutUser}
          className="text-left p-4 hover:bg-grey w-full pl-8 py-4"
        >
          <h1 className="font-bold text-xl mg-1">Sign Out</h1>
          <p className="text-dark-grey">@{username}</p>
        </button>
      </div>
    </AnimationWrapper>
  );
};

export default UserNavigationPanel;
