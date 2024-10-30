import React, { useState } from "react";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import { Button } from "../components/ui/button";
import { FcGoogle } from "react-icons/fc";

const Auth: React.FC = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  
  const handleClick = () => {
    setIsSignIn(!isSignIn);
  }

  return (
    <div className="w-screen h-screen grid place-items-center">
      <div className="w-5/6 md:w-3/6 lg:w-2/6 bg-zinc-900 p-8 rounded-lg">
        {isSignIn ? (
          <SignIn handleClick={handleClick} />
        ) : (
          <SignUp handleClick={handleClick} />
        )}
        <div className="flex items-center mt-5">
          <span className="border-t flex-grow border-slate-800"></span>
          <span className="px-4 text-gray-500 text-sm">or</span>
          <span className="border-t flex-grow border-slate-800"></span>
        </div>

        <div className="flex justify-center mt-2">
          <Button
            type="button"
            onClick={() => console.log("Continue with Google clicked")}
          >
            <FcGoogle /> Continue with Google
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Auth;
