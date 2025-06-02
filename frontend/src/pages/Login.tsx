
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/context/AuthContext';

import { FaFacebookF, FaGooglePlusG, FaLinkedinIn} from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import { UserRole } from '@/types';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const Login: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const { login } = useAuth();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      
      try {
        await login(email, password);
        navigate('/dashboard');
      } catch (error) {
        console.error('Login failed:', error);
      } finally {
        setLoading(false);
      }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
          alert('Passwords do not match');
          return;
        }
        
        setLoading(true);
        
        try {
          await register(name, email, password, role);
          navigate('/dashboard');
        } catch (error) {
          console.error('Registration failed:', error);
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
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex justify-center items-center flex-col min-h-screen bg-gray-100 font-['Montserrat']">
      
      
      <div className={`bg-white rounded-xl shadow-lg relative overflow-hidden w-full max-w-4xl min-h-[480px] ${isRightPanelActive ? 'right-panel-active' : ''}`}>
        {/* Sign Up Form */}
        <div className={`absolute top-0 h-full transition-all duration-600 ease-in-out left-0 w-1/2 opacity-0 z-10 ${isRightPanelActive ? 'translate-x-full opacity-100 z-50' : ''}`}>
          <form className="bg-white flex items-center justify-center flex-col p-0 sm:p-12 h-full text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight mb-4">Create Account</h1>
            
            <Input
                        id="name"
                        className="bg-gray-200 border-none p-3 my-2 w-full"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                        required
                      />
            <Input
                        id="email"
                        type="email"
                        className="bg-gray-200 border-none p-3 my-2 w-full"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                      />
            <Input
                        id="password"
                        type="password"
                        className="bg-gray-200 border-none p-3 my-2 w-full"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
            <div className="bg-gray-200 p-3 my-2 w-full rounded-md">
  
  <RadioGroup
    defaultValue="student"
    value={role}
    onValueChange={(value) => setRole(value as UserRole)}
    className="mt-2 space-y-2"
  >
    <div className="flex items-center space-x-2">
      <RadioGroupItem value="student" id="student" />
      <Label htmlFor="student" className="text-sm text-gray-800">Student</Label>
    </div>
    <div className="flex items-center space-x-2">
      <RadioGroupItem value="admin" id="admin" />
      <Label htmlFor="admin" className="text-sm text-gray-800">Administrator</Label>
    </div>
  </RadioGroup>
</div>

            <button onClick={handleSignUp} className="rounded-3xl border border-red-500 bg-red-500 text-white text-xs font-bold py-3 px-11 uppercase tracking-wider mt-4" disabled={loading}>
              Sign Up
            </button>
          </form>
        </div>

        {/* Sign In Form */}
        <div className={`absolute top-0 h-full transition-all duration-600 ease-in-out left-0 w-1/2 z-20 ${isRightPanelActive ? 'translate-x-full' : ''}`}>
          <form className="bg-white flex items-center justify-center flex-col p-0 sm:p-12 h-full text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight mb-4">Sign in</h1>

            
            
            <Input
                        id="email"
                        type="email"
                        className="bg-gray-200 border-none p-3 my-2 w-full"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@college.edu"
                        required
                      />
            <Input
                        id="password"
                        type="password"
                        className="bg-gray-200 border-none p-3 my-2 w-full"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                      />
            <a href="#" className="text-gray-700 text-sm my-3">Forgot your password?</a>
            <button onClick={handleSignIn}className="rounded-3xl border border-red-500 bg-red-500 text-white text-xs font-bold py-3 px-11  tracking-wider mt-4" disabled={loading}>
              {loading ? 'Logging in...' : 'Sign In'}
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
        <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-600 ease-in-out z-30 ${isRightPanelActive ? '-translate-x-full' : ''}`}>
          <div className={`bg-gradient-to-r from-red-500 to-pink-600 text-white relative -left-full h-full w-[200%] transform transition-transform duration-600 ease-in-out ${isRightPanelActive ? 'translate-x-1/2' : ''}`}>
            {/* Overlay Left */}
            <div className={`absolute flex items-center justify-center flex-col py-0 px-10 text-center top-0 h-full w-1/2 transform transition-transform duration-600 ease-in-out ${isRightPanelActive ? 'translate-x-0' : '-translate-x-1/5'}`}>
              <h1 className="font-bold m-0">Welcome Back!</h1>
              <p className="text-sm font-thin leading-5 tracking-wider my-5">
                To keep connected with us please login with your personal info
              </p>
              <button 
                onClick={handleSignInClick}
                className="rounded-3xl border border-white bg-transparent text-white text-xs font-bold py-3 px-11 uppercase tracking-wider mt-4"
              >
                Sign In
              </button>
            </div>

            {/* Overlay Right */}
            <div className={`absolute flex items-center justify-center flex-col py-0 px-10 text-center top-0 right-0 h-full w-1/2 transform transition-transform duration-600 ease-in-out ${isRightPanelActive ? 'translate-x-1/5' : 'translate-x-0'}`}>
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
  );
};

export default Login;
