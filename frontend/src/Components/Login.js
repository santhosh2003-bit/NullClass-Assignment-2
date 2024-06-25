import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import login from "../images/login.jpg";
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://nullclass-assignment-2.onrender.com/api/users/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );
      const data = await response.json();
      if (data.token) {
        // console.log(data.token);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <img
        className="w-full md:w-1/2 h-1/2 md:h-full object-cover "
        src={login}
        alt="login"
      />
      <div className="flex w-full md:w-1/2 h-full justify-center items-center bg-gray-500">
        <form
          className="flex flex-col p-4 rounded-xl shadow-2xl w-10/12 max-w-md"
          onSubmit={handleSubmit}
        >
          <h1 className="text-3xl font-bold text-white mb-7 text-center">
            Login Form
          </h1>
          <label className="text-xl mb-3 text-slate-100">Enter Email</label>
          <input
            className="text-xl text-slate-300 bg-transparent outline-none border pt-1 pb-1 pl-2 pr-2 rounded-lg mb-4"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="text-xl mb-3 text-slate-100">Enter Password</label>
          <input
            className="text-xl text-slate-300 bg-transparent outline-none border pt-1 pb-1 pl-2 pr-2 rounded-lg mb-4"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="mt-3 bg-sky-700 text-white font-bold text-xl pt-1 pb-1 pl-2 pr-2 rounded-lg hover:bg-sky-500"
            type="submit"
          >
            Login
          </button>
          <p className="text-white mt-2 text-center">
            If you don`t have an Account{" "}
            <span
              className="font-bold text-blue-300 underline cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
