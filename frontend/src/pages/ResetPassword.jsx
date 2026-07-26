import React, { useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Lock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Zap,
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
import useResetPassword from "../hooks/auth/useResetPassword";

const PasswordStrength = {
  WEAK: "weak",
  FAIR: "fair",
  GOOD: "good",
  STRONG: "strong",
};

const getPasswordStrength = (password) => {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

  if (strength <= 1) return PasswordStrength.WEAK;
  if (strength === 2) return PasswordStrength.FAIR;
  if (strength === 3) return PasswordStrength.GOOD;
  return PasswordStrength.STRONG;
};

const getStrengthColor = (strength) => {
  switch (strength) {
    case PasswordStrength.WEAK:
      return "bg-red-500";
    case PasswordStrength.FAIR:
      return "bg-yellow-500";
    case PasswordStrength.GOOD:
      return "bg-blue-500";
    case PasswordStrength.STRONG:
      return "bg-green-500";
    default:
      return "bg-gray-300";
  }
};

const getStrengthLabel = (strength) => {
  switch (strength) {
    case PasswordStrength.WEAK:
      return "Weak";
    case PasswordStrength.FAIR:
      return "Fair";
    case PasswordStrength.GOOD:
      return "Good";
    case PasswordStrength.STRONG:
      return "Strong";
    default:
      return "";
  }
};

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const hasSubmittedRef = useRef(false);

  const { mutate: resetPassword, isPending } = useResetPassword();
  const email = searchParams.get("email");

  React.useEffect(() => {
    if (!isPending && hasSubmittedRef.current) {
      hasSubmittedRef.current = false;
    }
  }, [isPending]);

  React.useEffect(() => {
    if (!email) {
      toast.error("Invalid reset link. Please try again.");
      setTimeout(() => navigate("/forgot-password"), 1000);
    }
  }, [email, navigate]);

  const passwordStrength = getPasswordStrength(formData.password);

  const handlePasswordReset = (e) => {
    e.preventDefault();

    if (hasSubmittedRef.current || isPending) return;

    if (!formData.password.trim()) {
      toast.error("Please enter a new password");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (passwordStrength === PasswordStrength.WEAK) {
      toast.error("Password is too weak. Please use a stronger password");
      return;
    }

    hasSubmittedRef.current = true;

    resetPassword({
      email,
      newPassword: formData.password,
    });
  };

  const isPasswordValid =
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword &&
    formData.password.length >= 8;
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
        <span className="hidden sm:inline text-sm font-medium">Back</span>
      </button>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-soft-lg mb-4">
            <Lock className="w-9 h-9 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Create New Password
          </h1>
          <p className="text-white/80 text-sm">
            Enter a new password to secure your account
          </p>
        </div>

        <Card className="shadow-soft-lg">
          <CardHeader>
            <CardTitle>Reset Your Password</CardTitle>
            <CardDescription>
              Create a strong password to protect your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handlePasswordReset} className="space-y-6">
              {/* New Password Field */}
              <div className="relative">
                <Input
                  label="New Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  icon={<Lock className="w-5 h-5" />}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[42px] text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-neutral-700">
                      Password Strength
                    </label>
                    <span className="text-xs font-semibold text-neutral-600">
                      {getStrengthLabel(passwordStrength)}
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${getStrengthColor(passwordStrength)} transition-all duration-300`}
                      style={{
                        width:
                          passwordStrength === PasswordStrength.WEAK
                            ? "25%"
                            : passwordStrength === PasswordStrength.FAIR
                              ? "50%"
                              : passwordStrength === PasswordStrength.GOOD
                                ? "75%"
                                : "100%",
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Password Requirements */}
              <div className="bg-neutral-50 rounded-lg p-4 space-y-2">
                <p className="text-xs font-semibold text-neutral-700 mb-3">
                  Password Requirements:
                </p>
                <div className="space-y-2 text-xs text-neutral-600">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        formData.password.length >= 8
                          ? "bg-green-100"
                          : "bg-neutral-200"
                      }`}
                    >
                      {formData.password.length >= 8 && (
                        <div className="w-2 h-2 bg-green-600 rounded-full" />
                      )}
                    </div>
                    <span>At least 8 characters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        /[a-z]/.test(formData.password) &&
                        /[A-Z]/.test(formData.password)
                          ? "bg-green-100"
                          : "bg-neutral-200"
                      }`}
                    >
                      {/[a-z]/.test(formData.password) &&
                        /[A-Z]/.test(formData.password) && (
                          <div className="w-2 h-2 bg-green-600 rounded-full" />
                        )}
                    </div>
                    <span>Mix of uppercase and lowercase letters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        /\d/.test(formData.password)
                          ? "bg-green-100"
                          : "bg-neutral-200"
                      }`}
                    >
                      {/\d/.test(formData.password) && (
                        <div className="w-2 h-2 bg-green-600 rounded-full" />
                      )}
                    </div>
                    <span>At least one number</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
                          ? "bg-green-100"
                          : "bg-neutral-200"
                      }`}
                    >
                      {/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) && (
                        <div className="w-2 h-2 bg-green-600 rounded-full" />
                      )}
                    </div>
                    <span>At least one special character (!@#$%^&*)</span>
                  </div>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <Input
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  icon={<Lock className="w-5 h-5" />}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-[42px] text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Match Indicator */}
              {formData.confirmPassword && (
                <div
                  className={`flex items-center gap-2 p-3 rounded-lg ${
                    formData.password === formData.confirmPassword
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  {formData.password === formData.confirmPassword ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-xs font-medium text-green-700">
                        Passwords match
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <span className="text-xs font-medium text-red-700">
                        Passwords do not match
                      </span>
                    </>
                  )}
                </div>
              )}

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700">
                    Use a strong password with a mix of letters, numbers, and
                    special characters for better security.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isPending || !isPasswordValid}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Resetting Password...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Reset Password
                  </>
                )}
              </Button>
            </form>

            {/* Security Info */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-xs text-green-700">
                <span className="font-semibold">✓ Secure:</span> Your password
                is encrypted and secure.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-white/70">
            <button
              onClick={() => navigate("/login")}
              className="text-white font-semibold hover:text-white/80 transition-colors"
            >
              Back to Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
