import React, { useState, useEffect } from "react";
import { X, CreditCard, Shield, AlertCircle } from "lucide-react";
import { 
  createGuestPaymentOrder, 
  verifyPayment, 
  loadRazorpayScript
} from "../../api/paymentService";

// Declare Razorpay global
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  studentData: {
    id: number;
    full_name: string;
    email: string;
  };
  amount: number;
}

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  onPaymentSuccess, 
  studentData, 
  amount 
}: PaymentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadRazorpayScript().then(setRazorpayLoaded);
    }
  }, [isOpen]);

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      setError("Payment system is loading. Please try again.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Create order using guest endpoint
      const order = await createGuestPaymentOrder({
        amount: amount,
        currency: "INR"
      }, studentData.email, studentData.full_name);

      // Razorpay options
      const options = {
        key: "rzp_test_S6saCTUVL3j21k", // Your actual Razorpay key ID
        amount: order.amount,
        currency: order.currency,
        name: "SchoolMS",
        description: "Student Registration Fee",
        order_id: order.id,
        handler: async (response: any) => {
          try {
            // Verify payment
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              student_id: studentData.id
            });

            onPaymentSuccess();
          } catch (error) {
            console.error("Payment verification failed:", error);
            setError("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: studentData.full_name,
          email: studentData.email
        },
        theme: {
          color: "#3B82F6"
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
          }
        }
      };

      // Initialize Razorpay payment directly
      if (window.Razorpay) {
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        throw new Error("Razorpay SDK not loaded");
      }

    } catch (error: any) {
      console.error("Payment initiation failed:", error);
      setError(error?.response?.data?.detail || "Failed to initiate payment. Please try again.");
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 rounded-full p-2">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Registration Payment</h3>
                <p className="text-blue-100 text-sm">Complete your registration</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
              disabled={isLoading}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Payment Details */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-600">Registration Fee</span>
              <span className="text-2xl font-bold text-gray-900">₹{amount}</span>
            </div>
            <div className="text-sm text-gray-500">
              <p>Student: {studentData.full_name}</p>
              <p>Email: {studentData.email}</p>
            </div>
          </div>

          {/* Security Info */}
          <div className="flex items-center space-x-2 mb-6 text-sm text-gray-600">
            <Shield className="w-4 h-4 text-green-500" />
            <span>Secured by Razorpay • 256-bit SSL encryption</span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={isLoading || !razorpayLoaded}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                <span>Pay ₹{amount}</span>
              </>
            )}
          </button>

          {/* Payment Methods */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 mb-2">Accepted payment methods</p>
            <div className="flex justify-center space-x-4 text-xs text-gray-400">
              <span>Credit Card</span>
              <span>•</span>
              <span>Debit Card</span>
              <span>•</span>
              <span>UPI</span>
              <span>•</span>
              <span>Net Banking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}