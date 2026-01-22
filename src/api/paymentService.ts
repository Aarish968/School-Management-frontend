import api from "./api";

// ---------------------- ✅ Types ----------------------
export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt?: string;
  status: string;
}

export interface PaymentVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  student_id: number;
}

export interface PaymentResponse {
  id: number;
  student_id: number;
  amount: number;
  currency: string;
  status: string;
  gateway: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  transaction_id?: string;
  payment_type: string;
  description?: string;
  created_at: string;
  updated_at?: string;
  paid_at?: string;
}

export interface CreateOrderRequest {
  amount: number;
  currency: string;
  receipt?: string;
}

// ---------------------- ✅ Payment APIs ----------------------

export const createPaymentOrder = async (orderData: CreateOrderRequest): Promise<RazorpayOrder> => {
  const res = await api.post("/payment/create-order", orderData);
  return res.data;
};

export const createGuestPaymentOrder = async (
  orderData: CreateOrderRequest, 
  email: string, 
  full_name: string
): Promise<RazorpayOrder> => {
  const res = await api.post("/payment/create-guest-order", {
    ...orderData,
    email,
    full_name
  });
  return res.data;
};

export const verifyPayment = async (verificationData: PaymentVerification): Promise<any> => {
  const res = await api.post("/payment/verify-payment", verificationData);
  return res.data;
};

export const getMyPayments = async (): Promise<PaymentResponse[]> => {
  const res = await api.get("/payment/my-payments");
  return res.data;
};

export const getPaymentById = async (paymentId: number): Promise<PaymentResponse> => {
  const res = await api.get(`/payment/payment/${paymentId}`);
  return res.data;
};

// ---------------------- ✅ Razorpay Integration ----------------------

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};