import React, { useState, useEffect } from "react";
import { LAUNCH_PLAN_CONFIGS, PlanTier } from "@thinkly/shared";
import { billingService } from "../../shared/services/billingService";
import { Button } from "../ui/Button";
import toast from "react-hot-toast";

interface UpgradeModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  reason?: string;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
  reason: propReason,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [reason, setReason] = useState(propReason || "Unlock unlimited study spaces and AI generations with Thinkly PRO.");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleUpgradeModal = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.reason) {
        setReason(customEvent.detail.reason);
      }
      setInternalIsOpen(true);
    };

    window.addEventListener("thinkly:upgrade-modal", handleUpgradeModal);
    return () => {
      window.removeEventListener("thinkly:upgrade-modal", handleUpgradeModal);
    };
  }, []);

  const isOpen = propIsOpen !== undefined ? propIsOpen : internalIsOpen;
  const handleClose = () => {
    setInternalIsOpen(false);
    if (propOnClose) propOnClose();
  };

  if (!isOpen) return null;

  const freeConfig = LAUNCH_PLAN_CONFIGS[PlanTier.FREE];
  const proConfig = LAUNCH_PLAN_CONFIGS[PlanTier.PRO];

  const handleUpgradeClick = async () => {
    try {
      setIsLoading(true);
      const data = await billingService.initializeCheckout(PlanTier.PRO);
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        toast.error("Failed to generate Paystack checkout link.");
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || "Checkout initialization failed";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-2xl p-6 sm:p-8 bg-background border border-border rounded-3xl shadow-2xl relative overflow-hidden">
        <button
          onClick={handleClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary p-2 text-2xl font-bold"
        >
          &times;
        </button>

        <div className="text-center mb-6">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-400 mb-2">
            Thinkly PRO
          </span>
          <h2 className="text-3xl font-extrabold">Supercharge Your Learning</h2>
          <p className="text-sm text-text-secondary mt-1">{reason}</p>
        </div>

        {/* Pricing Cards Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Free Tier Card */}
          <div className="p-5 rounded-2xl border border-border bg-white/40 dark:bg-black/40 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold">{freeConfig.name}</h3>
              <p className="text-2xl font-black mt-2">Free</p>
              <p className="text-xs text-text-secondary mb-4">{freeConfig.description}</p>
              <ul className="space-y-2 text-xs text-text-secondary">
                <li className="flex items-center gap-2">✓ Up to {freeConfig.limits.maxActiveSpaces} Active Study Spaces</li>
                <li className="flex items-center gap-2">✓ Up to {freeConfig.limits.maxDailyAIActions} AI Generations/day</li>
                <li className="flex items-center gap-2">✓ Standard TTS Voices</li>
              </ul>
            </div>
          </div>

          {/* PRO Tier Card */}
          <div className="p-5 rounded-2xl border-2 border-primary-500 bg-primary-50/30 dark:bg-primary-950/20 relative flex flex-col justify-between shadow-lg">
            <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary-500 text-white uppercase tracking-wider">
              Recommended
            </span>
            <div>
              <h3 className="text-lg font-bold text-primary-600 dark:text-primary-400">{proConfig.name}</h3>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-black">₦{proConfig.priceNGN.toLocaleString()}</span>
                <span className="text-xs text-text-secondary">/ month (or ${proConfig.priceUSD})</span>
              </div>
              <p className="text-xs text-text-secondary mb-4">{proConfig.description}</p>
              <ul className="space-y-2 text-xs font-medium text-text-primary">
                <li className="flex items-center gap-2 text-primary-600 dark:text-primary-400">✨ <strong>Unlimited</strong> Study Spaces</li>
                <li className="flex items-center gap-2 text-primary-600 dark:text-primary-400">✨ <strong>Unlimited</strong> AI Generations</li>
                <li className="flex items-center gap-2 text-primary-600 dark:text-primary-400">✨ Priority Audio TTS & Higher Upload Limits</li>
              </ul>
            </div>

            <Button
              onClick={handleUpgradeClick}
              loading={isLoading}
              disabled={isLoading}
              variant="primary"
              className="w-full mt-6 py-3 font-bold text-sm shadow-md"
            >
              Upgrade to PRO via Paystack
            </Button>
          </div>
        </div>

        <p className="text-[11px] text-center text-text-secondary">
          Secure payment processing powered by Paystack. Cancel or change plan anytime.
        </p>
      </div>
    </div>
  );
};
