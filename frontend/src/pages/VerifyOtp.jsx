import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { toast } from "react-toastify";
import useVerifyOtp from "../hooks/auth/useVerifyOtp";
import useResendOtp from "../hooks/auth/useResendOtp";

const OTP_EXPIRE_TIME = 5 * 60;
const RESEND_OTP_TIME = 30;

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(OTP_EXPIRE_TIME);
  const [resendTimeLeft, setResendTimeLeft] = useState(RESEND_OTP_TIME);
  const [canResend, setCanResend] = useState(false);

  const { mutate: verifyOtp, isPending } = useVerifyOtp();
  const { mutate: resendOtp, isPending: isResendPending } = useResendOtp();

  const userEmail = location.state?.email;
  useEffect(() => {
    if (!userEmail) {
      toast.error("Invalid access. Please register again.");
      navigate("/register");
    }
  }, [userEmail, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });

      setResendTimeLeft((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // useEffect(() => {
  //   // if (timeLeft <= 0) {
  //   //   setCanResend(true);
  //   //   return;
  //   // }

  //   const timer = setInterval(() => {
  //     setTimeLeft((prev) => prev - 1);
  //   }, 1000);

  //   return () => clearInterval(timer);
  // }, [timeLeft]);

  //   useEffect(() => {
  //   if (timeLeft <= 0) return;

  //   const timer = setInterval(() => {
  //     setTimeLeft((prev) => prev - 1);
  //   }, 1000);

  //   return () => clearInterval(timer);
  // }, [timeLeft > 0]);

  // useEffect(() => {
  //   if (resendTimeLeft <= 0) {
  //     setCanResend(true);
  //     return;
  //   }

  //   const timer = setInterval(() => {
  //     setResendTimeLeft((prev) => prev - 1);
  //   }, 1000);

  //   return () => clearInterval(timer);
  // }, [resendTimeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) {
      toast.error("Please paste only digits");
      return;
    }

    const newOtp = pastedData.split("").concat(otp).slice(0, 6);
    setOtp(newOtp);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }

    if (timeLeft <= 0) {
      toast.error("OTP has expired. Please request a new one.");
      return;
    }

    verifyOtp({
      email: userEmail,
      otp: otpCode,
    });
  };

  const handleResend = () => {
    setTimeLeft(OTP_EXPIRE_TIME);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
    toast.info("OTP sent to your email");
    setResendTimeLeft(RESEND_OTP_TIME);

    resendOtp({
      email: userEmail,
    });
  };

  const isExpired = timeLeft <= 0;
  const isOtpComplete = otp.every((digit) => digit !== "");

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-600 to-secondary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 text-white hover:text-white/80 transition-colors flex items-center gap-2 z-20"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="hidden sm:inline text-sm font-medium">Back</span>
      </button>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-soft-lg mb-4">
            <Clock className="w-9 h-9 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Verify Your Email
          </h1>
          <p className="text-white/80 text-sm">
            We've sent a 6-digit code to
            <br />
            <span className="font-medium">{userEmail}</span>
          </p>
        </div>

        <Card className="shadow-soft-lg">
          <CardHeader>
            <CardTitle>Enter OTP Code</CardTitle>
            <CardDescription>
              Check your email for the verification code
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Timer Section */}
              <div
                className={`flex items-center justify-center gap-2 p-4 rounded-lg ${
                  isExpired
                    ? "bg-red-50 border border-red-200"
                    : timeLeft < 60
                      ? "bg-yellow-50 border border-yellow-200"
                      : "bg-blue-50 border border-blue-200"
                }`}
              >
                {isExpired ? (
                  <>
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-red-700">
                      OTP expired. Request a new one.
                    </span>
                  </>
                ) : (
                  <>
                    <Clock
                      className={`w-5 h-5 flex-shrink-0 ${
                        timeLeft < 60 ? "text-yellow-600" : "text-blue-600"
                      }`}
                    />
                    <span
                      className={`text-sm font-semibold ${
                        timeLeft < 60 ? "text-yellow-700" : "text-blue-700"
                      }`}
                    >
                      Expires in {formatTime(timeLeft)}
                    </span>
                  </>
                )}
              </div>

              {/* OTP Input Fields */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-neutral-700">
                  Enter 6-Digit Code
                </label>
                <div className="flex justify-center gap-2 sm:gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      disabled={isExpired}
                      className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-lg border-2 border-neutral-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:bg-neutral-100 disabled:cursor-not-allowed"
                    />
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isPending || !isOtpComplete || isExpired}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Verify OTP
                  </>
                )}
              </Button>

              {/* Resend Section */}
              <div className="flex items-center justify-center gap-2 pt-4 border-t border-neutral-200">
                {canResend || isResendPending || resendTimeLeft <= 0 ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleResend}
                    className="w-full"
                  >
                    Resend OTP Code
                  </Button>
                ) : (
                  <p className="text-sm text-neutral-600">
                    Didn't receive the code?{" "}
                    <span className="text-neutral-400">
                      Resend in {formatTime(resendTimeLeft)}
                    </span>
                  </p>
                )}
              </div>

              {/* Help Text */}
              <div className="bg-neutral-50 rounded-lg p-4 text-center">
                <p className="text-xs text-neutral-600 mb-2">
                  Check your spam folder if you don't see the email
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary-600"
                >
                  Need help?
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-white/70">
            Made a mistake?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-white font-semibold hover:text-white/80 transition-colors"
            >
              Go back to register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
