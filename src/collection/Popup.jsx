
import React, { useEffect, useState } from "react";

const SimpleMessagePopup = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 10000); // 2 sec delay
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShow(false); // Just close popup, no localStorage
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 flex flex-col items-center space-y-4
                   transform scale-90 opacity-0 animate-popup transition-all duration-500"
      >
        <img
          src="mypic.jfif" // Replace this later
          alt="Message"
          className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-gradient-to-r from-blue-400 to-purple-500 shadow-lg bg-gray-200 object-cover"
        />
        <h2 className="text-2xl md:text-3xl font-extrabold text-center">
          Hello 👋
        </h2>
        <p className="text-center text-gray-700 dark:text-gray-300 text-base md:text-lg">
          WELLCOME USERS! THIS IS MY WHATSAPP CLONE PROJECT. ENJOY THE CHATTING
          EXPERIENCE. BY @FASEE DEVELOPER 
        </p>
        <button
          onClick={handleClose}
          className="mt-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white rounded-xl font-bold shadow-lg transition-all transform hover:scale-105"
        >
          Close
        </button>
      </div>

      {/* Tailwind animation using keyframes */}
      <style>
        {`
          @keyframes popup {
            0% { opacity: 0; transform: scale(0.9); }
            100% { opacity: 1; transform: scale(1); }
          }
          .animate-popup {
            animation: popup 0.4s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default SimpleMessagePopup;
