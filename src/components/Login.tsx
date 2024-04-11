import React, { FC, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { login } from "../api";

const Login: FC<{ setToken: (token: string) => void }> = ({ setToken }) => {
  const [accessToken, setAccessToken] = useState<string>();

  const handleLogin = async () => {
    const id = toast.loading("Logging in...");
    try {
      if (!accessToken) {
        toast.error("Please enter access token!", { id });
        return;
      }
      const data = await login(accessToken);

      if (data.jwt) {
        setToken(data.jwt);
        toast.success(data.message, { id });
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? error.message, { id });
    }
  };

  return (
    <div className="w-[50%] ml-auto mr-auto mt-[10%] bg-gray-700 rounded-md flex items-center justify-center h-[50vh] p-4">
      <div className="flex flex-col items-start gap-3 w-[50%]">
        <label className="text-tw-green text-lg font-bold">Access Token:</label>
        <input
          onChange={(e) => setAccessToken(e.target.value)}
          placeholder="Access token"
          className="bg-transparent w-full border-[1px] border-tw-green rounded-md"
        />
        <div className="flex w-full justify-end">
          <button
            onClick={handleLogin}
            className="bg-tw-green px-4 py-1 rounded-md text-black font-bold"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
