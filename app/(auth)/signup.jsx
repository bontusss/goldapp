import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/Feather";
import { useAuthStore } from "../../store/authstore";

export default function Signup() {
  const router = useRouter();

  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { refCode, setRefCode } = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { isLoading, register } = useAuthStore();
  const handleSignup = async () => {
    if (!userName || !email || !phone || !password || !password.length === 11) {
      Toast.show({
        type: "error",
        text1: "Registration error",
        text2: "Please fill in all fields",
      });
    } else if (password.length < 6 || userName < 2) {
      Toast.show({
        type: "error",
        text1: "Registration error",
        text2:
          "password length must be 6 or more and username must be 2 characters or more",
      });
    } else {
      try {
        const result = await register(userName, email, phone, password);
        if (result.success) {
          router.push("/(auth)/email_verify");
        } else {
          Toast.show({
            type: "error",
            text1: "Registration error",
            text2: "Incorrect input format",
          });
        }
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error.error || "An error occurred",
        });
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                Join a community of savers and start building your future!
              </Text>
            </View>

            <View style={styles.form}>
              {/* User Name */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Username*</Text>
                <View style={styles.inputContainer}>
                  <Icon
                    name="user"
                    size={20}
                    color="#888"
                    style={styles.icon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your username"
                    value={userName}
                    autoCapitalize="words"
                    onChangeText={setUserName}
                  />
                </View>
              </View>

              {/* Phone */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Phone*</Text>
                <View style={styles.inputContainer}>
                  <Icon
                    name="phone"
                    size={20}
                    color="#888"
                    style={styles.icon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your phone number"
                    value={phone}
                    onChangeText={setPhone}
                  />
                </View>
              </View>

              {/* Email */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Email*</Text>
                <View style={styles.inputContainer}>
                  <Icon
                    name="mail"
                    size={20}
                    color="#888"
                    style={styles.icon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              </View>

              {/* Password */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Password*</Text>
                <View style={styles.inputContainer}>
                  <Icon
                    name="lock"
                    size={20}
                    color="#888"
                    style={styles.icon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Icon
                      name={showPassword ? "eye" : "eye-off"}
                      size={20}
                      color="#888"
                      style={styles.toggleIcon}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Ref code */}
              <View>
                <Text style={{color: 'gray'}}>Provide a referral code if you have any.</Text>
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Referral Code</Text>
                <View style={styles.inputContainer}>
                  <Icon
                    name="code"
                    size={20}
                    color="#888"
                    style={styles.icon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter a Ref code"
                    value={refCode}
                    onChangeText={setRefCode}
                  />
                </View>
              </View>
              <View style={{ width: "100%", marginTop: 40 }}>
                {/* Sign Up Button */}
                <TouchableOpacity
                  style={{
                    backgroundColor: "#F47C20",
                    paddingVertical: 14,
                    borderRadius: 8,
                    marginBottom: 12,
                    alignItems: "center",
                  }}
                  onPress={() => handleSignup()}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: 16,
                      }}
                    >
                      Sign Up
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
              <View
                style={{ width: "100%", alignItems: "center", marginTop: 20 }}
              >
                <Text style={{ color: "#004E5D", fontSize: 16 }}>
                  Already have an account?
                </Text>
                <Text
                  style={{ color: "#F47C20", fontWeight: "bold" }}
                  onPress={() => router.push("/(auth)")}
                >
                  Log In
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "white",
    alignItems: "center",
    paddingTop: 40,
  },
  header: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#004E5D",
  },
  subtitle: {
    textAlign: "center",
    marginTop: 5,
    color: "#004E5D",
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
  icon: {
    marginRight: 8,
  },
  toggleIcon: {
    marginLeft: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
});
