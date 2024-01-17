import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar.component";
import UserAuthForm from "./pages/userAuthForm.page";

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navbar />}
      >
        <Route
          path="signin"
          element={<UserAuthForm type="sing-in" />}
        />
        <Route
          path="signup"
          element={<UserAuthForm type="sing-up" />}
        />
      </Route>
    </Routes>
  );
};

export default App;
