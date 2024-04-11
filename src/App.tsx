import React, { useEffect, useState } from "react";
import "./index.css";
import "./App.css";
import { Toaster } from "react-hot-toast";
import Sidebar from "./components/Sidebar";
import Routes from "./Routes";
import Login from "./components/Login";
import { getToken } from "./api";

function App() {
  useEffect(() => {
    void getJwtToken();
  }, []);

  const [token, setToken] = useState<string>();
  const getJwtToken = async () => {
    try {
      const token = localStorage.getItem("jwt");
      if (token) {
        setToken(token);
      } else {
        const data = await getToken();
        if (data.jwt) {
          setToken(data.jwt);
          localStorage.setItem("jwt", data.jwt);
        }
      }
    } catch (error) {}
  };

  return (
    <div className="App">
      <Toaster />
      <div className="w-full h-full flex gap-0 items-start">
        <Sidebar />
        <div className="w-full p-2 h-[100vh] items-start flex">
          {token ? (
            <Routes />
          ) : (
            <Login
              setToken={(t) => {
                setToken(t);
                localStorage.setItem("jwt", t);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
