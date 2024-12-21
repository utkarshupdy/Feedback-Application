'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User } from 'next-auth';
import { Button } from './ui/button';

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-800 text-white">
      <div className="container mx-auto flex items-center justify-between">
        {/* Brand Name */}
        <Link href="/" className="text-2xl font-bold text-gray-100 hover:text-gray-400 transition duration-300">
          True Feedback
        </Link>

        {/* Welcome Message (for logged-in users) */}
        {session && (
          <span className="text-gray-300 text-lg font-medium mx-8 hidden md:block">
            Welcome, {user?.username || user?.email}
          </span>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center space-x-4">
          {session ? (
            <>
              {/* Home Button */}
              <Link href="/">
                <Button className="w-full md:w-auto bg-gray-700 hover:bg-gray-600 text-white" variant="outline">
                  Home
                </Button>
              </Link>

              {/* Dashboard Button */}
              <Link href="/dashboard">
                <Button className="w-full md:w-auto bg-gray-700 hover:bg-gray-600 text-white" variant="outline">
                  Dashboard
                </Button>
              </Link>

              {/* Logout Button */}
              <Button
                onClick={() => signOut()}
                className="w-full md:w-auto bg-red-600 hover:bg-red-500 text-white"
                variant="outline"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              {/* Login Button */}
              <Button className="w-full md:w-auto bg-green-600 hover:bg-green-500 text-white" variant="outline">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
