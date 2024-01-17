import { useState } from "react";

const InputBox = ({ name, type, id, value, placeholder, icon }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="relative w-[100%] mb-4">
      <input
        type={type == "password" && !passwordVisible ? "password" : "text"}
        id={id}
        name={name}
        defaultValue={value}
        placeholder={placeholder}
        className="input-box"
      />
      <i className={`${icon} input-icon`}></i>

      {type == "password" ? (
        <i
          onClick={() => setPasswordVisible(!passwordVisible)}
          className={`fi ${
            passwordVisible ? "fi-rr-eye" : "fi-rr-eye-crossed"
          }  input-icon left-[auto] right-4 cursor-pointer`}
        ></i>
      ) : null}
    </div>
  );
};

export default InputBox;
