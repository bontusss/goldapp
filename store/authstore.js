import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const BASEURL = "https://www.goldco-op.com.ng/api/"
// const BASEURL = "https://dd95055431a7.ngrok-free.app/api/";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  hasCheckedAuth: false,

  register: async (username, email, phone, password) => {
    console.log(BASEURL + "register");

    set({ isLoading: true });
    try {
      const response = await fetch(BASEURL + "register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          phone,
          password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem("user", JSON.stringify(data.user.User));
        await AsyncStorage.setItem("token", data.user.Token);

        set({ user: data.user.User, token: data.user.Token, isLoading: false });
        return { success: true };
      } else {
        throw new Error(data.message || "Registration failed");
      }
    } catch (error) {
      set({ isLoading: false });
      console.error("Registration error:", error);
      return { success: false, message: error.error || "An error occurred" };
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await fetch(BASEURL + "login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const text = await response.text();
      console.log("Raw response:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("Server did not return valid JSON: " + text);
      }

      if (response.ok) {
        await AsyncStorage.setItem("user", JSON.stringify(data.user.User));
        await AsyncStorage.setItem("token", data.user.Token);

        set({ user: data.user.User, token: data.user.Token, isLoading: false });
        return { success: true };
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (error) {
      set({ isLoading: false });
      console.error("Login error:", error);
      return { success: false, message: error.message || "An error occurred" };
    }
  },
  verifyEmail: async (code) => {
    set({ isLoading: true });
    try {
      // Get user email from AsyncStorage
      const userString = await AsyncStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      const email = user?.email;

      if (!email) {
        set({ isLoading: false });
        return { success: false, message: "No user email found." };
      }

      const response = await fetch(BASEURL + "verify_email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();
      if (response.ok) {
        set({ isLoading: false });
        return { success: true };
      } else {
        throw new Error(data.message || "Verification failed");
      }
    } catch (error) {
      set({ isLoading: false });
      console.error("Verify email error:", error);
      return { success: false, message: error.message || "An error occurred" };
    }
  },
  checkAuth: async () => {
    try {
      const userString = await AsyncStorage.getItem("user");
      const token = await AsyncStorage.getItem("token");
      if (userString && token) {
        const user = JSON.parse(userString);
        set({ user, token, hasCheckedAuth: true }); // ✅ set flag here
      } else {
        set({ user: null, token: null, hasCheckedAuth: true }); // ✅ also set when unauthenticated
      }
    } catch (error) {
      console.error("Check auth error:", error);
      set({ hasCheckedAuth: true }); // avoid infinite loading
    }
  },
  logout: async () => {
    try {
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("token");
      set({ user: null, token: null });
    } catch (error) {
      console.error("Logout error:", error);
    }
  },
  getInvestmentPlans: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(BASEURL + "plans", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("Server did not return valid JSON: " + text);
      }

      if (response.ok) {
        return { success: true, plans: data.plans || data };
      } else {
        throw new Error(data.message || "Failed to fetch plans");
      }
    } catch (error) {
      console.error("Get investment plans error:", error);
      return { success: false, message: error.message || "An error occurred" };
    }
  },
  createSavingsPaymentRequest: async (accountName, bankName, amount) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(BASEURL + "savings/payment_request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        body: JSON.stringify({
          account_name: accountName,
          bank_name: bankName,
          amount: String(amount),
        }),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("Server did not return valid JSON: " + text);
      }

      if (response.ok) {
        return { success: true, paymentRequest: data };
      } else {
        throw new Error(data.message || "Failed to create payment request");
      }
    } catch (error) {
      console.error("Create payment request error:", error);
      return { success: false, message: error.message || "An error occurred" };
    }
  },
  getUserSavingsTransactions: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(BASEURL + "transactions/savings", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("Server did not return valid JSON: " + text);
      }

      if (response.ok) {
        // data should be an array of transactions
        return { success: true, transactions: data };
      } else {
        throw new Error(data.message || "Failed to fetch transactions");
      }
    } catch (error) {
      console.error("Get savings transactions error:", error);
      return { success: false, message: error.message || "An error occurred" };
    }
  },
  getUserInvestments: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(BASEURL + "investments", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      const text = await response.text();
      console.log("Raw response:", response.status, text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("Server did not return valid JSON: " + text);
      }

      if (response.ok) {
        console.log("Fetched investments:", data);

        return { success: true, investments: data };
      } else {
        throw new Error(data.message || "Failed to fetch investments");
      }
    } catch (error) {
      console.error("Get investments error:", error);
      return { success: false, message: error.message || "An error occurred" };
    }
  },
  createInvestment: async (planId, amount) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(BASEURL + "investment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        body: JSON.stringify({ plan_id: planId, amount }),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("Server did not return valid JSON: " + text);
      }

      if (response.ok) {
        return { success: true, investment: data };
      } else {
        throw new Error(data.message || "Failed to create investment");
      }
    } catch (error) {
      console.error("Create investment error:", error);
      return { success: false, message: error.message || "An error occurred" };
    }
  },
  createInvestmentPaymentRequest: async (
    accountName,
    bankName,
    refCode,
    amount,
  ) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(BASEURL + "investment/payment_request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        body: JSON.stringify({
          account_name: accountName,
          bank_name: bankName,
          ref_code: refCode,
          amount,
        }),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("Server did not return valid JSON: " + text);
      }

      if (response.ok) {
        return { success: true, paymentRequest: data };
      } else {
        throw new Error(data.message || "Failed to create payment request");
      }
    } catch (error) {
      console.error("Create payment request error:", error);
      return { success: false, message: error.message || "An error occurred" };
    }
  },
  getUserSavingsBalance: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(BASEURL + "user/savings_balance", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("Server did not return valid JSON: " + text);
      }

      if (response.ok) {
        console.log("data from func is " + data);
        return { success: true, data };
      } else {
        throw new Error(data.message || "Failed to fetch savings balance");
      }
    } catch (error) {
      console.error("Get savings balance error:", error);
      return { success: false, message: error.message || "An error occurred" };
    }
  },
  getUserinvestmentBalance: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(BASEURL + "user/investment_balance", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("Server did not return valid JSON: " + text);
      }

      if (response.ok) {
        console.log("data from func is " + data);
        return { success: true, data };
      } else {
        throw new Error(data.message || "Failed to fetch savings balance");
      }
    } catch (e) {
      console.error("Get savings balance error:", e);
      return { success: false, message: e.message || "An error occurred" };
    }
  },
  updateUser: async (email, username) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(BASEURL + "user/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        body: JSON.stringify({
          email,
          username,
        }),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("Server did not return valid JSON: " + text);
      }

      if (response.ok) {
        return { success: true };
      } else {
        throw new Error(data.message || "Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error.message);
      return { success: false, message: error.message || "An error occurred" };
    }
  },
  getUserRefs: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(BASEURL + "user/refs", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      const text = await response.text();
      console.log("Raw response:", response.status, text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("Server did not return valid JSON: " + e);
      }

      if (response.ok) {
        console.log("Fetched investments:", data);

        return { success: true, list: data };
      } else {
        throw new Error(data.message || "Failed to fetch investments");
      }
    } catch (error) {
      console.error("Get investments error:", error);
      return { success: false, message: error.message || "An error occurred" };
    }
  },
  createSavingsWithdrawRequest: async (
    accountNumber,
    accountName,
    bankName,
    amount,
  ) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(BASEURL + "savings/withdraw_request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        body: JSON.stringify({
          account_number: accountNumber,
          account_name: accountName,
          bank_name: bankName,
          amount: String(amount),
        }),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("Server did not return valid JSON: " + e.error);
      }

      if (response.ok) {
        return { success: true, paymentRequest: data };
      } else {
        throw new Error(data.message || "Failed to create withdraw request");
      }
    } catch (error) {
      console.error("Create withdraw request error:", error);
      return { success: false, message: error.message || "An error occurred" };
    }
  },
  redeemTokens: async (phone, amount) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(BASEURL + "redeem-tokens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        body: JSON.stringify({ phone, amount }),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        return {
          success: false,
          message: "Server did not return valid JSON: " + text,
        };
      }

      if (response.ok) {
        return { success: true };
      } else {
        return {
          success: false,
          message: data.error || "Failed to create payment request",
        };
      }
    } catch (error) {
      console.error("Create payment request error:", error);
      return { success: false, message: error.message || "An error occurred" };
    }
  },
  getUserTokenBalance: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(BASEURL + "user/token", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("Server did not return valid JSON: " + text);
      }

      if (response.ok) {
        console.log("data from func is " + data);
        return { success: true, data };
      } else {
        throw new Error(data.message || "Failed to token balance");
      }
    } catch (error) {
      console.error("Get token balance error:", error);
      return { success: false, message: error.message || "An error occurred" };
    }
  },
}));
