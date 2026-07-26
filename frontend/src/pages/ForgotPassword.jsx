import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { toast } from "react-toastify";
import useForgotPassword from "../hooks/auth/useForgotPassword";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const hasSubmittedRef = useRef(false);

  const { mutate: sendResetEmail, isPending } = useForgotPassword();

  React.useEffect(() => {
    if (!isPending && hasSubmittedRef.current) {
      hasSubmittedRef.current = false;
    }
  }, [isPending]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (hasSubmittedRef.current || isPending) return;
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    hasSubmittedRef.current = true;

    sendResetEmail({
      email: email.trim(),
    });
  };

  const handleSendAgain = (e) => {
    e.preventDefault();
    setEmailSent(false);
    setEmail("");
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary-600 to-secondary flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate("/login")}
          className="absolute top-6 left-6 text-white hover:text-white/80 transition-colors flex items-center gap-2 z-20"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline text-sm font-medium">Back to Login</span>
        </button>

        <div className="w-full max-w-md relative z-10">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full shadow-soft-lg mb-4">
              <CheckCircle2 className="w-9 h-9 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Check Your Email
            </h1>
            <p className="text-white/80 text-sm">
              We've sent password reset instructions to<br />
              <span className="font-medium">{email}</span>
            </p>
          </div>

          <Card className="shadow-soft-lg">
            <CardHeader>
              <CardTitle>Reset Password Instructions Sent</CardTitle>
              <CardDescription>
                Follow the link in the email to reset your password
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 mb-1">
                      Check your email
                    </p>
                    <p className="text-xs text-blue-700">
                      The password reset link will expire in 1 hour for security reasons.
                    </p>
                  </div>
                </div>
              </div>

              {/* Spam Warning */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-xs text-yellow-800">
                  <span className="font-semibold">💡 Tip:</span> If you don't see the email, please check your spam or junk folder.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => navigate("/login")}
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  Back to Login
                </Button>

                <Button
                  onClick={handleSendAgain}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  Try Another Email
                </Button>
              </div>

              {/* Additional Help */}
              <div className="bg-neutral-50 rounded-lg p-4 text-center">
                <p className="text-xs text-neutral-600 mb-3">
                  Didn't receive the email?
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary-600"
                >
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-white/70">
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-white font-semibold hover:text-white/80 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-600 to-secondary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      {/* Back Button */}
      <Link
        to="/login"
        className="absolute top-6 left-6 text-white hover:text-white/80 transition-colors flex items-center gap-2 z-20"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="hidden sm:inline text-sm font-medium">Back to Login</span>
      </Link>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-soft-lg mb-4">
            <Lock className="w-9 h-9 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Reset Your Password
          </h1>
          <p className="text-white/80 text-sm">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        <Card className="shadow-soft-lg">
          <CardHeader>
            <CardTitle>Forgot Password?</CardTitle>
            <CardDescription>
              We'll help you get back into your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="your.email@example.com"
                  icon={<Mail className="w-5 h-5" />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isPending}
                  required
                />
                <p className="mt-2 text-xs text-neutral-600">
                  Enter the email address associated with your account
                </p>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700">
                    You'll receive an email with a link to reset your password. The link will expire in 1 hour.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isPending || !email.trim()}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Sending Reset Email...
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5 mr-2" />
                    Send Reset Email
                  </>
                )}
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-neutral-500">
                    or
                  </span>
                </div>
              </div>

              {/* Alternative Actions */}
              <div className="flex flex-col gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => navigate("/login")}
                >
                  Back to Login
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  className="w-full text-primary hover:text-primary-600"
                  onClick={() => navigate("/register")}
                >
                  Create New Account
                </Button>
              </div>

              {/* Help Section */}
              <div className="bg-neutral-50 rounded-lg p-4 text-center">
                <p className="text-xs text-neutral-600 mb-3">
                  Having trouble? We're here to help
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary-600"
                >
                  Contact Support
                </Button>
              </div>
            </form>

            {/* Additional Info */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-xs text-green-700">
                <span className="font-semibold">✓ Secure:</span> Your password reset is protected with industry-standard encryption.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-white/70">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-white font-semibold hover:text-white/80 transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
