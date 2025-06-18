import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { UserRole } from "@/types";
import { toast } from "@/components/ui/use-toast";

const Login: React.FC = () => {
  const { isAuthenticated, login, register } = useAuth();
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signinEmail, setSigninEmail] = useState("");
  const [signinPassword, setSigninPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const navigate = useNavigate();
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const isMobile = window.innerWidth < 768;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login(signinEmail, signinPassword);
      if (user.is_admin === false) {
        navigate("/dashboard");
      } else {
        navigate("/admin");
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !signupEmail || !signupPassword || !role) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all the fields before registering.",
        variant: "destructive",
      });
      return;
    }

    if (signupPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await register(name, signupEmail, signupPassword, role);
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpClick = () => {
    setIsRightPanelActive(true);
  };

  const handleSignInClick = () => {
    setIsRightPanelActive(false);
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex justify-center items-center flex-col min-h-screen bg-gray-100 font-['Montserrat']">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl min-h-[480px] relative overflow-hidden">
        {/* ----------- MOBILE VIEW (stacked) ----------- */}
        <div className="block md:hidden">
          <div className="flex justify-center mt-4 space-x-2">
            <button
              onClick={() => setIsRightPanelActive(false)}
              className={`px-4 py-2 rounded-t bg-gray-200 font-semibold ${
                !isRightPanelActive ? "bg-red-500 text-white" : ""
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsRightPanelActive(true)}
              className={`px-4 py-2 rounded-t bg-gray-200 font-semibold ${
                isRightPanelActive ? "bg-red-500 text-white" : ""
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="w-full">
            {!isRightPanelActive ? (
              <form
                onSubmit={handleSignIn}
                className="p-6 flex flex-col items-center"
              >
                <h1 className="text-3xl font-bold mb-4">Sign in</h1>
                <Input
                  type="email"
                  placeholder="you@college.edu"
                  className="my-2 bg-gray-200 w-full"
                  value={signinEmail}
                  onChange={(e) => setSigninEmail(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="my-2 bg-gray-200 w-full"
                  value={signinPassword}
                  onChange={(e) => setSigninPassword(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 bg-red-500 text-white px-8 py-2 rounded-full text-xs uppercase font-bold"
                >
                  {loading ? "Logging in..." : "Sign In"}
                </button>
              </form>
            ) : (
              <form
                onSubmit={handleSignUp}
                className="p-6 flex flex-col items-center"
              >
                <h1 className="text-3xl font-bold mb-4">Create Account</h1>
                <Input
                  placeholder="Name"
                  className="my-2 bg-gray-200 w-full"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  type="email"
                  placeholder="Email"
                  className="my-2 bg-gray-200 w-full"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                  className="my-2 bg-gray-200 w-full"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  className="my-2 bg-gray-200 w-full"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 bg-red-500 text-white px-8 py-2 rounded-full text-xs uppercase font-bold"
                >
                  Sign Up
                </button>
              </form>
            )}
          </div>
        </div>
        {!isMobile && (
          <div className={`hidden md:flex w-full h-full relative`}>
            <div
              className={`bg-white rounded-xl shadow-lg relative overflow-hidden w-full max-w-4xl min-h-[480px] ${
                isRightPanelActive ? "right-panel-active" : ""
              }`}
            >
              {/* Sign Up Form */}
              <div
                className={`absolute top-0 h-full transition-all duration-600 ease-in-out left-0 w-1/2 opacity-0 z-10 ${
                  isRightPanelActive ? "translate-x-full opacity-100 z-50" : ""
                }`}
              >
                <form className="bg-white flex items-center justify-center flex-col p-0 sm:p-12 h-full text-center">
                  <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight mb-4">
                    Create Account
                  </h1>

                  <Input
                    id="name"
                    className="bg-gray-200 border-none p-3 my-2 w-full"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    required
                  />
                  <Input
                    id="signup-email"
                    type="email"
                    className="bg-gray-200 border-none p-3 my-2 w-full"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="Email"
                    required
                  />
                  <Input
                    id="signup-password"
                    type="password"
                    className="bg-gray-200 border-none p-3 my-2 w-full"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Password"
                    required
                    minLength={8}
                  />
                  <Input
                    id="confirmPassword"
                    type="password"
                    className="bg-gray-200 border-none p-3 my-2 w-full"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    required
                  />
                  <button
                    onClick={handleSignUp}
                    className="rounded-3xl border border-red-500 bg-red-500 text-white text-xs font-bold py-3 px-11 uppercase tracking-wider mt-4"
                    disabled={loading}
                  >
                    Sign Up
                  </button>
                </form>
              </div>

              {/* Sign In Form */}
              <div
                className={`absolute top-0 h-full transition-all duration-600 ease-in-out left-0 w-1/2 z-20 ${
                  isRightPanelActive ? "translate-x-full" : ""
                }`}
              >
                <form className="bg-white flex items-center justify-center flex-col p-0 sm:p-12 h-full text-center">
                  <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight mb-4">
                    Sign in
                  </h1>

                  <Input
                    id="signin-email"
                    type="email"
                    className="bg-gray-200 border-none p-3 my-2 w-full"
                    value={signinEmail}
                    onChange={(e) => setSigninEmail(e.target.value)}
                    placeholder="you@college.edu"
                    required
                  />
                  <Input
                    id="signin-password"
                    type="password"
                    className="bg-gray-200 border-none p-3 my-2 w-full"
                    value={signinPassword}
                    onChange={(e) => setSigninPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <a href="#" className="text-gray-700 text-sm my-3">
                    Forgot your password?
                  </a>
                  <button
                    onClick={handleSignIn}
                    className="rounded-3xl border border-red-500 bg-red-500 text-white text-xs font-bold py-3 px-11  tracking-wider mt-4"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Sign In"}
                  </button>
                  <div className="border-t pt-4">
                    <p className="text-xs text-center text-muted-foreground">
                      Demo credentials: <br />
                      Admin: admin@college.edu / password <br />
                      Student: student@college.edu / password
                    </p>
                  </div>
                </form>
              </div>

              {/* Overlay */}
              <div
                className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-600 ease-in-out z-30 ${
                  isRightPanelActive ? "-translate-x-full" : ""
                }`}
              >
                <div
                  className={`bg-gradient-to-r from-red-500 to-pink-600 text-white relative -left-full h-full w-[200%] transform transition-transform duration-600 ease-in-out ${
                    isRightPanelActive ? "translate-x-1/2" : ""
                  }`}
                >
                  {/* Overlay Left */}
                  <div
                    className={`absolute flex items-center justify-center flex-col py-0 px-10 text-center top-0 h-full w-1/2 transform transition-transform duration-600 ease-in-out ${
                      isRightPanelActive ? "translate-x-0" : "-translate-x-1/5"
                    }`}
                  >
                    <h1 className="font-bold m-0">Welcome Back!</h1>
                    <p className="text-sm font-thin leading-5 tracking-wider my-5">
                      To keep connected with us please login with your personal
                      info
                    </p>
                    <button
                      onClick={handleSignInClick}
                      className="rounded-3xl border border-white bg-transparent text-white text-xs font-bold py-3 px-11 uppercase tracking-wider mt-4"
                    >
                      Sign In
                    </button>
                  </div>

                  {/* Overlay Right */}
                  <div
                    className={`absolute flex items-center justify-center flex-col py-0 px-10 text-center top-0 right-0 h-full w-1/2 transform transition-transform duration-600 ease-in-out ${
                      isRightPanelActive ? "translate-x-1/5" : "translate-x-0"
                    }`}
                  >
                    <h1 className="font-bold m-0">Hello, Friend!</h1>
                    <p className="text-sm font-thin leading-5 tracking-wider my-5">
                      Enter your personal details and start journey with us
                    </p>
                    <button
                      onClick={handleSignUpClick}
                      className="rounded-3xl border border-white bg-transparent text-white text-xs font-bold py-3 px-11 uppercase tracking-wider mt-4"
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
