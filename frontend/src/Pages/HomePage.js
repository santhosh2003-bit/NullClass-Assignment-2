import React, { useEffect, useState } from "react";
import { Language } from "./Language";

// Define your default image URL here
const defaultImage =
  "https://media.istockphoto.com/id/1391605502/photo/default-defined-in-a-business-dictionary.jpg?s=612x612&w=0&k=20&c=DKhHBK_HWJPDuBgC8MOpGWu30zt881HT4bX3CwSBZmE="; // Replace this URL with your default image URL

const HomePage = () => {
  const [otp, setOtp] = useState("");
  const [requestedLanguage, setRequestedLanguage] = useState("");
  const [image, setImage] = useState(defaultImage); // Set the default image initially
  const userData = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const [blog, setBlog] = useState({
    blogHeading: "Select A Language",
    blogDescription:
      "Verify Your OTP by entering your OTP and select your language",
  });
  const handleRequestOtp = async () => {
    try {
      const response = await fetch(
        "https://nullclass-assignment-2.onrender.com/api/users/otp/request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: userData.email,
          }),
        }
      );
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.log(error);
      alert("Failed to request OTP");
    }
  };

  const handleVerifyOtp = async (langCode, otp) => {
    try {
      const response = await fetch(
        "https://nullclass-assignment-2.onrender.com/api/users/otp/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            otp: otp,
            language: langCode,
          }),
        }
      );
      const data = await response.json();
      if (data.message) {
        alert(data.message);
        setRequestedLanguage(langCode);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to verify OTP");
    }
  };

  useEffect(() => {
    const selectedLanguage = Language.find(
      (data) => data.name === requestedLanguage
    );
    if (selectedLanguage) {
      setImage(selectedLanguage.image);
      setBlog({
        blogHeading: selectedLanguage.blogHeading,
        blogDescription: selectedLanguage.blogDescription,
      });
    } else {
      setImage(defaultImage); // Reset to default image if no language is selected or found
    }
  }, [requestedLanguage]);
  if (!token) {
    window.location.href = "/login";
  }

  const handle_buttons = () => {
    return (
      <div className="flex space-x-10 justify-between mb-7">
        <button className="bg-green-600 text-white font-bold pt-1 pb-1 pl-2 pr-2 rounded">
          Login
        </button>
        <button className="bg-red-500 text-white font-bold pt-1 pb-1 pl-2 pr-2 rounded">
          Register
        </button>
      </div>
    );
  };

  const handle_logOut = () => {
    localStorage.clear();
    window.location.href = "/login";
  };
  return (
    <div
      className="h-auto py-[5vh] bg-cover bg-center flex flex-col justify-center items-center"
      style={{
        backgroundImage: `url(${image})`,
      }}
    >
      {!token && handle_buttons() ? null : (
        <button
          className="bg-red-500 text-white font-bold pt-1 pb-1 pl-2 pr-2 rounded mb-6"
          onClick={handle_logOut}
        >
          LogOut
        </button>
      )}
      <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg max-w-lg w-full mx-4 md:mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">
          Welcome to Language Management Web
        </h1>
        <button
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded mb-4 hover:bg-blue-700"
          onClick={handleRequestOtp}
        >
          Request OTP
        </button>
        <input
          className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <div className="flex flex-wrap justify-center space-x-2 space-y-2">
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
            onClick={() => handleVerifyOtp("es", otp)}
          >
            Español
          </button>
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
            onClick={() => handleVerifyOtp("hi", otp)}
          >
            हिंदी
          </button>
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
            onClick={() => handleVerifyOtp("pt", otp)}
          >
            Português
          </button>
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
            onClick={() => handleVerifyOtp("ta", otp)}
          >
            தமிழ்
          </button>
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
            onClick={() => handleVerifyOtp("bn", otp)}
          >
            বাংলা
          </button>
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
            onClick={() => handleVerifyOtp("fr", otp)}
          >
            Français
          </button>
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
            onClick={() => handleVerifyOtp("en", otp)}
          >
            English
          </button>
        </div>
      </div>
      <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg max-w-lg w-full mx-4 my-6 md:mx-auto text-center flex items-center justify-center gap-5 flex-col">
        <h2 className="text-2xl text-black font-semibold">
          {blog.blogHeading}
        </h2>
        <p className="text-gray text-lg">{blog.blogDescription}</p>
      </div>
    </div>
  );
};

export default HomePage;
