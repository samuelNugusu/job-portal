import React from "react";
import {
  SignIn,
  SignUp,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";

// ✅ Sign In page
export const SignInPage: React.FC = () => {
  return (
    <div style={{ maxWidth: 720, margin: "4rem auto" }}>
      <SignIn routing="path" path="/sign-in" />
    </div>
  );
};

// ✅ Sign Up page
export const SignUpPage: React.FC = () => {
  return (
    <div style={{ maxWidth: 720, margin: "4rem auto" }}>
      <SignUp routing="path" path="/sign-up" />
    </div>
  );
};

// ✅ ProtectedRoute wrapper
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};
