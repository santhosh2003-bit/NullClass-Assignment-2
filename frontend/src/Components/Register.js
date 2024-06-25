import React, { useState } from "react";
import registration from "../images/registration.jpg";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
        }),
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
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
        className="w-full md:w-1/2 h-1/2 md:h-full object-cover"
        src={registration}
        alt="Registration"
      />
      <div className="flex w-full md:w-1/2 h-full justify-center items-center bg-gray-500">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col p-4 rounded-xl shadow-2xl w-10/12 max-w-md"
        >
          <h1 className="text-3xl font-bold text-white mb-7 text-center">
            Registration Form
          </h1>
          <label className="text-xl mb-3 text-slate-100">Enter User Name</label>
          <input
            className="text-xl text-slate-300 bg-transparent outline-none border pt-1 pb-1 pl-2 pr-2 rounded-lg mb-4"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
            Register
          </button>
          <p className="text-white mt-2 text-center">
            If you have an Account{" "}
            <span
              className="font-bold text-blue-300 underline cursor-pointer"
              onClick={() => (window.location.href = "/login")}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
