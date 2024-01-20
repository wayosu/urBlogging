import { createContext, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import UserAuthForm from "./pages/userAuthForm.page";
import { lookInSession } from "./common/session";
import Navbar from "./components/navbar.component";
import Editor from "./pages/editor.pages";

export const UserContext = createContext({});

const App = () => {
  const [userAuth, setUserAuth] = useState({});

  useEffect(() => {
    let userInSession = lookInSession("user");

    userInSession
      ? setUserAuth(JSON.parse(userInSession))
      : setUserAuth({ accessToken: null });
  }, []);

  return (
    <UserContext.Provider value={{ userAuth, setUserAuth }}>
      <Routes>
        <Route
          path="/editor"
          element={<Editor />}
        ></Route>
        <Route
          path="/"
          element={<Navbar />}
        >
          <Route
            path="signin"
            element={<UserAuthForm type="sign-in" />}
          />
          <Route
            path="signup"
            element={<UserAuthForm type="sign-up" />}
          />
        </Route>
      </Routes>
    </UserContext.Provider>
  );
};

export default App;
