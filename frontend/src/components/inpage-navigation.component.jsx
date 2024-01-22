import { useEffect, useRef, useState } from "react";

const InPageNavigation = ({
  routes,
  defaultHidden = [],
  defaultActiveIndex = 0,
  children,
}) => {
  let activeTabLineRef = useRef();
  let activeTabRef = useRef();

  let [inPageNavIndex, setInPageNavIndex] = useState(defaultActiveIndex);

  const changePageState = (btn, index) => {
    let { offsetWidth, offsetLeft } = btn;
    activeTabLineRef.current.style.width = `${offsetWidth}px`;
    activeTabLineRef.current.style.left = `${offsetLeft}px`;

    setInPageNavIndex(index);
  };

  useEffect(() => {
    changePageState(activeTabRef.current, defaultActiveIndex);
  }, []);

  return (
    <>
      <div
        className="
          relative 
          mb-8 
          bg-white 
          border-b 
          border-grey 
          flex 
          flex-nowrap 
          overflow-x-auto
        "
      >
        {routes.map((route, index) => (
          <button
            ref={index === defaultActiveIndex ? activeTabRef : null}
            onClick={(e) => changePageState(e.target, index)}
            key={index}
            className={
              "py-4 px-5 capitalize " +
              (inPageNavIndex === index ? "text-black" : "text-dark-grey") +
              (defaultHidden.includes(route) ? " md:hidden" : " ")
            }
          >
            {route}
          </button>
        ))}

        <hr
          ref={activeTabLineRef}
          className="absolute bottom-0 duration-300"
        />
      </div>

      {Array.isArray(children) ? children[inPageNavIndex] : children}
    </>
  );
};

export default InPageNavigation;
