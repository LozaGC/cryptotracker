
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { ReactNode } from 'react';

interface AuthWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const AuthWrapper = ({ children, fallback }: AuthWrapperProps) => {
  return (
    <>
      <SignedIn>
        {children}
      </SignedIn>
      <SignedOut>
        {fallback || (
          <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                Portfolio Access Required
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Please sign in to access your portfolio
              </p>
              <SignInButton mode="modal">
                <button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 hover:scale-105 transform">
                  Sign In
                </button>
              </SignInButton>
            </div>
          </div>
        )}
      </SignedOut>
    </>
  );
};

export default AuthWrapper;
