import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <SignUp 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-gray-800 shadow-xl border border-gray-700",
            headerTitle: "text-white",
            headerSubtitle: "text-gray-400",
            socialButtonsBlockButton: "bg-gray-700 hover:bg-gray-600 text-white border-gray-600",
            formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
            footerActionLink: "text-blue-500 hover:text-blue-400",
            formFieldLabel: "text-gray-300",
            formFieldInput: "bg-gray-700 border-gray-600 text-white",
            identityPreviewText: "text-white",
            identityPreviewEditButton: "text-blue-500"
          }
        }}
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        redirectUrl="/"
      />
    </div>
  );
}
