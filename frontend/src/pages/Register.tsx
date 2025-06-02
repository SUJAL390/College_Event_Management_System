
import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '@/components/auth/RegisterForm';
import { useAuth } from '@/context/AuthContext';
import { Calendar } from 'lucide-react';

const Register: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="flex justify-center">
              <a href="/" className="inline-flex items-center gap-2">
                <Calendar className="h-8 w-8 text-college-600" />
                <span className="text-2xl font-bold">CampusEvents</span>
              </a>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create your account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="font-medium text-college-600 hover:text-college-500">
                Sign in
              </a>
            </p>
          </div>
          
          <div className="bg-white shadow-md rounded-lg p-6 sm:p-8">
            <RegisterForm />
          </div>
        </div>
      </div>
      
      <footer className="bg-white py-4 border-t">
        <div className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} CampusEvents. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Register;
