import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";

const UserAuthForm = ({ type }) => {
  return (
    <section className="h-cover flex items-center justify-center">
      <form className="w-[80%] max-w-[400px]">
        <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
          {type === "sing-in" ? "Sign In" : "Sign Up"}
        </h1>

        {type != "sing-in" ? (
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

        <button className="btn-dark w-[90%] center mt-14">
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
      </form>
    </section>
  );
};

export default UserAuthForm;
