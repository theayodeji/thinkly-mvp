import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { authService } from "../../shared/services/authService";
import { Button } from "../../components/ui/Button";
import { toast } from "react-hot-toast";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [errorMessage, setErrorMessage] = useState("");
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("No verification token was provided in the link.");
      return;
    }

    const verify = async () => {
      try {
        await authService.verifyEmail(token);
        setStatus("success");
        toast.success("Email verified successfully!");
      } catch (err: any) {
        const msg = err.response?.data?.error || err.response?.data?.message || err.message || "Verification link is invalid or has expired.";
        setStatus("error");
        setErrorMessage(msg);
      }
    };

    verify();
  }, [token]);

  const handleResend = async () => {
    try {
      setIsResending(true);
      await authService.resendVerification();
      toast.success("A new verification link has been sent to your email!");
    } catch (err: any) {
      const msg = err.response?.data?.error || err.response?.data?.message || err.message || "Failed to resend verification email";
      toast.error(msg);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full h-screen min-h-[550px] p-8 md:p-2 flex items-center justify-center">
      <div className="md:w-1/2 w-full max-w-md flex flex-col justify-center items-center glass-panel p-8 rounded-2xl shadow-lg border border-white/20 dark:border-white/10 bg-white/30 dark:bg-black/30 backdrop-blur-md text-center">
        {status === "verifying" && (
          <div className="py-8 space-y-4">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <h1 className="text-xl font-bold">Verifying your email...</h1>
            <p className="text-sm text-text-secondary">Please wait while we confirm your email address.</p>
          </div>
        )}

        {status === "success" && (
          <div className="py-6 space-y-6">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto text-3xl">
              ✓
            </div>
            <div>
              <h1 className="text-2xl font-bold">Email Verified!</h1>
              <p className="text-sm text-text-secondary mt-2">
                Thank you for verifying your email address. You now have full access to Thinkly.
              </p>
            </div>
            <Button className="w-full py-2.5" onClick={() => navigate("/dashboard")}>
              Continue to Dashboard
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="py-6 space-y-6">
            <div className="w-16 h-16 bg-danger/10 text-danger rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              !
            </div>
            <div>
              <h1 className="text-2xl font-bold text-danger">Verification Failed</h1>
              <p className="text-sm text-text-secondary mt-2">{errorMessage}</p>
            </div>

            <div className="space-y-3 w-full">
              <Button className="w-full py-2.5" onClick={handleResend} loading={isResending}>
                Resend Verification Link
              </Button>
              <Link to="/auth/login" className="block text-sm text-primary-500 hover:underline">
                Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
