import { HashRouter, Routes, Route } from "react-router-dom";
// import { HashRouter as Router, Route, Routes } from "react-router-dom"; // Import HashRouter instead of Router


import Home from "./pages/Home";
import Login from "./pages/Login";
import Verify from "./pages/Verify";
import HomePage from "./pages/homepage/Homepage"
import { UserData } from "./context/UserContext";
import { LoadingBig } from "./components/Loading";

const App = () => {
  const { user, isAuth, loading } = UserData();
  return (
    <>
      {loading ? (
        <LoadingBig />
      ) : (
        <HashRouter>
          <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={isAuth ? <Home /> : <Login />} />
            <Route path="/login" element={isAuth ? <Home /> : <Login />} />
            <Route path="/verify" element={isAuth ? <Home /> : <Verify />} />
          </Routes>
        </HashRouter>
      )}
    </>
  );
};

export default App;
