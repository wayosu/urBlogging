import { useContext, useRef } from "react";
import { Link, Navigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import AnimationWrapper from "../common/page-animation";
import { storeInSession } from "../common/session";
import { UserContext } from "../App";
import { authWithGoogle } from "../common/firebase";

const UserAuthForm = ({ type }) => {
  const authForm = useRef();

  let {
    userAuth: { accessToken },
    setUserAuth,
  } = useContext(UserContext);

  const userAuthThroughServer = (serverRoute, formData) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
      .then(({ data }) => {
        storeInSession("user", JSON.stringify(data));
        setUserAuth(data);
      })
      .catch(({ response }) => {
        toast.error(response.data.error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let serverRoute = type == "sign-in" ? "/signin" : "/signup";

    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

    // Form Data
    let form = new FormData(formElement);
    let formData = {};

    form.forEach((value, key) => {
      formData[key] = value;
    });

    let { fullname, email, password } = formData;

    // Form Validation
    if (fullname) {
      if (fullname.length < 3) {
        return toast.error("Fullname must be at least 3 characters long");
      }
    }
    if (!email.length) {
      return toast.error("Email cannot be empty");
    }
    if (!emailRegex.test(email)) {
      return toast.error("Email is not valid");
    }
    if (!passwordRegex.test(password)) {
      return toast.error(
        "Password should be between 6 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter"
      );
    }

    userAuthThroughServer(serverRoute, formData);
  };

  const handleGoogleAuth = (e) => {
    e.preventDefault();

    authWithGoogle()
      .then((user) => {
        let serverRoute = "/google-auth";

        let formData = {
          accessToken: user.accessToken,
        };

        userAuthThroughServer(serverRoute, formData);
      })
      .catch((err) => {
        toast.error("trouble login through google");
        console.log(err);
      });
  };

  return accessToken ? (
    <Navigate to="/" />
  ) : (
    <AnimationWrapper keyValue={type}>
      <section className="h-cover flex items-center justify-center">
        <Toaster containerStyle={{ top: 50 }} />
        <form
          id="formElement"
          className="w-[80%] max-w-[400px]"
        >
          <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
            {type === "sign-in" ? "Welcome Back" : "Join Us Today"}
          </h1>

          {type != "sign-in" ? (
            <InputBox
              name="fullname"
              type="text"
              placeholder="Full Name"
              icon="fi fi-rr-user"
            />
          ) : null}

          <InputBox
            name="email"
            type="email"
            placeholder="Email"
            icon="fi fi-rr-envelope"
          />

          <InputBox
            name="password"
            type="password"
            placeholder="Password"
            icon="fi fi-rr-key"
          />

          <button
            onClick={handleSubmit}
            className="btn-dark w-[90%] center mt-14"
          >
            {type.replace("-", " ")}
          </button>

          <div
            className="
              relative 
              w-full 
              flex 
              items-center 
              gap-2 
              my-10 
              opacity-10 
              uppercase 
              text-black 
              font-bold
            "
          >
            <hr className="w-1/2 border-black" />
            <p>or</p>
            <hr className="w-1/2 border-black" />
          </div>

          <button
            onClick={handleGoogleAuth}
            className="
              btn-dark 
              flex 
              items-center 
              justify-center 
              gap-4 
              w-[90%] 
              center
            "
          >
            <img
              src={googleIcon}
              alt="google icon"
              className="w-5"
            />
            Continue with Google
          </button>

          {type === "sign-in" ? (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="underline text-black text-xl ml-1"
              >
                Join us today.
              </Link>
            </p>
          ) : (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Already a member?{" "}
              <Link
                to="/signin"
                className="underline text-black text-xl ml-1"
              >
                Sign in here.
              </Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
};

export default UserAuthForm;
