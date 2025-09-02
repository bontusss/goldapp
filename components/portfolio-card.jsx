import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";
import { colors } from "../constants/colors";

import { useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuthStore } from "../store/authstore";

export default function PortfolioCard({
  amount,
  text = "Your total savings portfolio",
  isSaveButtonVisible,
  isWithdrawButtonVisible,
}) {
  const [showAmount, setShowAmount] = useState(true);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [paymentSlideAnim] = useState(new Animated.Value(0));
  const [accountName, setAccountName] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const {
    createSavingsPaymentRequest,
    getUserSavingsTransactions,
    createSavingsWithdrawRequest,
  } = useAuthStore();
  const [submitting, setSubmitting] = useState(false);

  const amountStr = amount.toLocaleString();
  const digitCount = amount.toString().replace(/\D/g, "").length;
  const dynamicFontSize = digitCount > 7 ? 27 : 28;

  const openPaymentModal = () => {
    // setAccountNumber('');
    // setAccountName('');
    // setPaymentAmount('');
    setPaymentModalVisible(true);
    Animated.timing(paymentSlideAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const openWithdrawalModal = () => {
    // setAccountNumber('');
    // setAccountName('');
    // setPaymentAmount('');
    setWithdrawModalVisible(true);
    Animated.timing(paymentSlideAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const closePaymentModal = () => {
    Animated.timing(paymentSlideAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setPaymentModalVisible(false);
    });
  };

  const closeWithdrawalModal = () => {
    Animated.timing(paymentSlideAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setWithdrawModalVisible(false);
    });
  };

  const paymentTranslateY = paymentSlideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  const bankAccountNumber = "0908987767";
  const handleCopyAccount = async () => {
    await Clipboard.setStringAsync(bankAccountNumber);
    Toast.show({
      type: "success",
      text1: "Account number copied to clipboard",
    });
  };

  const handleAmountChange = (text) => {
    // Remove non-digit characters (like commas)
    const numericText = text.replace(/[^0-9]/g, "");
    const numericValue = parseInt(numericText || "0", 10);
    setPaymentAmount(numericValue);
  };

  const handleSubmit = async () => {
    if (!accountName || !bankName || !paymentAmount) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all fields.",
      });
      return;
    }
    setSubmitting(true);
    console.log("paymentAmount is " + paymentAmount);
    try {
      const result = await createSavingsPaymentRequest(
        accountName,
        bankName,
        paymentAmount,
      );
      if (result.success) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Payment request created!",
        });
        setSubmitting(false); // Stop spinner immediately
        closePaymentModal(); // Close modal right after
        // Optionally reset form fields here if needed
        getUserSavingsTransactions(); // Refresh transactions
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: result.message || "Failed to create payment request",
        });
        setSubmitting(false);
      }
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: e.message || "An error occurred",
      });
      setSubmitting(false);
    }
  };

  const handleSubmit2 = async () => {
    if (!accountName || !bankName || !paymentAmount || !accountNumber) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all fields.",
      });
      return;
    }
    if (accountNumber.length < 10) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Invalid account number.",
      });
      return;
    }
    setSubmitting(true);
    console.log("paymentAmount is " + paymentAmount);
    try {
      const result = await createSavingsWithdrawRequest(
        accountNumber,
        accountName,
        bankName,
        paymentAmount,
      );
      if (result.success) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Withdrawal request created!",
        });
        setSubmitting(false); // Stop spinner immediately
        closeWithdrawalModal(); // Close modal right after
        // Optionally reset form fields here if needed
        await getUserSavingsTransactions(); // Refresh transactions
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: result.message || "Failed to create weithdraw request",
        });
        setSubmitting(false);
      }
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: e.message || "An error occurred",
      });
      setSubmitting(false);
    }
  };
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.label}>{text}</Text>
            <TouchableOpacity
              onPress={() => setShowAmount((prev) => !prev)}
              style={{ marginLeft: 8 }}
            >
              <Ionicons
                name={showAmount ? "eye-outline" : "eye-off-outline"}
                size={18}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
          <Text style={[styles.amount, { fontSize: dynamicFontSize }]}>
            {showAmount ? `₦ ${amountStr}` : "xxxxx"}
          </Text>
        </View>
        {isSaveButtonVisible && (
          <TouchableOpacity style={styles.button} onPress={openPaymentModal}>
            <Text style={styles.buttonText}>Start Saving</Text>
          </TouchableOpacity>
        )}
      </View>
      <View>
        {isWithdrawButtonVisible && (
          <TouchableOpacity
            style={[styles.button, { marginTop: 10 }]}
            onPress={openWithdrawalModal}
          >
            <Text style={styles.buttonText}>Withdraw</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Only the second modal remains */}
      <Modal
        visible={paymentModalVisible}
        transparent
        animationType="none"
        onRequestClose={closePaymentModal}
      >
        <View style={modalStyles.overlay}>
          <Animated.View
            style={[
              modalStyles.bottomSheet,
              { transform: [{ translateY: paymentTranslateY }] },
            ]}
          >
            <Text style={modalStyles.planName}>Create Payment Request</Text>
            <Text style={{ paddingBottom: 18 }}>
              To start saving, make a transfer to
              <Text style={modalStyles.account}>UBA Bank</Text> with account
              number <Text style={modalStyles.account}>0908987767 </Text>
              and account name
              <Text style={modalStyles.account}> Gold Savings </Text>
              and fill the form below with your details.
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  color: colors.primary,
                  fontWeight: "bold",
                  marginRight: 4,
                }}
              >
                Copy Account Number
              </Text>
              <TouchableOpacity onPress={handleCopyAccount}>
                <Ionicons
                  name="copy-outline"
                  size={20}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>

            <View style={{ width: "100%" }}>
              <View style={modalStyles.formGroup}>
                <Text style={modalStyles.label}>Account Name</Text>
                <View style={modalStyles.inputContainer}>
                  <TextInput
                    style={modalStyles.input}
                    placeholder="Eugene Obilor"
                    value={accountName}
                    onChangeText={setAccountName}
                  />
                </View>
              </View>
              <View style={modalStyles.formGroup}>
                <Text style={modalStyles.label}>Bank Name</Text>
                <View style={modalStyles.inputContainer}>
                  <TextInput
                    style={modalStyles.input}
                    placeholder="Fidelity Bank"
                    value={bankName}
                    onChangeText={setBankName}
                  />
                </View>
              </View>
              <View style={modalStyles.formGroup}>
                <Text style={modalStyles.label}>Amount</Text>
                <View style={modalStyles.inputContainer}>
                  <TextInput
                    style={modalStyles.input}
                    placeholder="5,000"
                    value={paymentAmount ? paymentAmount.toLocaleString() : ""}
                    onChangeText={handleAmountChange}
                  />
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={modalStyles.button}
              onPress={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={modalStyles.buttonText}>Submit</Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      <Modal
        visible={withdrawModalVisible}
        transparent
        animationType="none"
        onRequestClose={closeWithdrawalModal}
      >
        <View style={modalStyles.overlay}>
          <Animated.View
            style={[
              modalStyles.bottomSheet,
              { transform: [{ translateY: paymentTranslateY }] },
            ]}
          >
            <Text style={modalStyles.planName}>Create Withdrawal Request</Text>
            <Text style={{ paddingBottom: 18 }}>
              Provide your account details below and admin will process your
              withdrawal request.
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
                marginBottom: 10,
              }}
            ></View>

            <View style={{ width: "100%" }}>
              <View style={modalStyles.formGroup}>
                <Text style={modalStyles.label}>Account Number</Text>
                <View style={modalStyles.inputContainer}>
                  <TextInput
                    style={modalStyles.input}
                    placeholder="0025678946"
                    value={accountNumber}
                    onChangeText={setAccountNumber}
                  />
                </View>
              </View>
              <View style={modalStyles.formGroup}>
                <Text style={modalStyles.label}>Account Name</Text>
                <View style={modalStyles.inputContainer}>
                  <TextInput
                    style={modalStyles.input}
                    placeholder="Eugene Obilor"
                    value={accountName}
                    onChangeText={setAccountName}
                  />
                </View>
              </View>
              <View style={modalStyles.formGroup}>
                <Text style={modalStyles.label}>Bank Name</Text>
                <View style={modalStyles.inputContainer}>
                  <TextInput
                    style={modalStyles.input}
                    placeholder="Fidelity Bank"
                    value={bankName}
                    onChangeText={setBankName}
                  />
                </View>
              </View>
              <View style={modalStyles.formGroup}>
                <Text style={modalStyles.label}>Amount</Text>
                <View style={modalStyles.inputContainer}>
                  <TextInput
                    style={modalStyles.input}
                    placeholder="5,000"
                    value={paymentAmount ? paymentAmount.toLocaleString() : ""}
                    onChangeText={handleAmountChange}
                  />
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={modalStyles.button}
              onPress={handleSubmit2}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={modalStyles.buttonText}>Submit</Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    color: "#fff",
    fontSize: 14,
  },
  amount: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: "flex-end",
    marginLeft: 16,
  },
  buttonText: {
    color: colors.primary,
    fontWeight: "600",
  },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  bottomSheet: {
    backgroundColor: "#fff",
    padding: 24,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    minHeight: 200,
  },
  planName: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 18,
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontSize: 14,
    color: "#004E5D",
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  button: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  account: {
    color: colors.primary,
    fontWeight: "bold",
  },
});
