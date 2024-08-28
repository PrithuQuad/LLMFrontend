import { createContext, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { server } from "../main";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [btnLoading, setBtnLoading] = useState(false);

async function loginUser(email, navigate) {
  setBtnLoading(true);
  try {
    // Send login request to the backend with the user's email
    const { data } = await axios.post(`${server}/api/user/login`, { email });

    // Show success message that OTP has been sent
    toast.success(data.message);

    // Store the OTP verifyToken and the role in localStorage
    localStorage.setItem("verifyToken", data.verifyToken);
    localStorage.setItem("role", data.role); // Store role ('admin' or 'user')

    // Navigate to the OTP verification page
    navigate("/verify");
  } catch (error) {
    // Display the error message if something goes wrong
    toast.error(error?.response?.data?.message || "Login failed. Please try again.");
  } finally {
    // Set loading state to false after the process finishes
    setBtnLoading(false);
  }
}


  const [user, setUser] = useState([]);
  const [isAuth, setIsAuth] = useState(false);

async function verifyUser(otp, navigate, fetchChats) {
  const verifyToken = localStorage.getItem("verifyToken");
  setBtnLoading(true);

  if (!verifyToken) return toast.error("Please provide token");

  try {
    const { data } = await axios.post(`${server}/api/user/verify`, {
      otp,
      verifyToken,
    });

    toast.success(data.message);
    localStorage.clear();
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user.role); // Store role in localStorage
    setIsAuth(true);
    setUser(data.user);
    fetchChats();

    // Redirect based on the user's role
    if (data.user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  } catch (error) {
    toast.error(error.response.data.message || "Verification failed");
  } finally {
    setBtnLoading(false);
  }
}


  const [loading, setLoading] = useState(true);

  async function fetchUser() {
    try {
      const { data } = await axios.get(`${server}/api/user/me`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      setIsAuth(true);
      setUser(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setIsAuth(false);
      setLoading(false);
    }
  }

  const logoutHandler = (navigate) => {
    localStorage.clear();

    toast.success("logged out");
    setIsAuth(false);
    setUser([]);
    navigate("/login");
  };

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <UserContext.Provider
      value={{
        loginUser,
        btnLoading,
        isAuth,
        setIsAuth,
        user,
        verifyUser,
        loading,
        logoutHandler,
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);
