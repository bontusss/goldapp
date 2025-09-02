import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useAuthStore } from "../../store/authstore";
import { capitalizeFirstLetter } from "../../constants/constant";
import Toast from "react-native-toast-message";
import * as Linking from 'expo-linking';

export default function ProfileScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState(0)
  const { user, updateUser, getUserTokenBalance } = useAuthStore();
  
  useEffect(() => {
    setEmail(user.email);
    setUsername(user.username);
    fetchToken()
  }, []);
  
  const fetchToken = async () => {
    try {
      const result = await getUserTokenBalance();
      console.log("👉 balance result:", result);

      if (result?.success && typeof result.data === "number") {
        setTokens(result.data);
        console.log("✅ set balance to:", result.data);
      } else {
        console.warn("⚠️ Invalid result:", result);
      }
    } catch (err) {
      console.error("❌ Error fetching balance:", err);
    }
  };

  const handleSave = async () => {
    if (!username && !email) {
      Toast.show({
        type: "error",
        text1: "Provide username or email",
      });
      return;
    }
    setLoading(true);
    try {
      const result = await updateUser(email, username);
      
      if (result.success) {
        Toast.show({ type: "success", text1: "Profile updated" });
        setModalVisible(false);
      } else {
        Toast.show({ type: "error", text1: result.message || "An error occurred, try again." });
      }
    } catch (error) {
      Toast.show({ type: "error", text1: error.message || "An unexpected error occurred" });
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      icon: "help-circle-outline",
      label: "Help and Support",
      route: "https://wa.me/+2347065111247?text=Hello%20Support%20Team", // Replace with actual phone number
    },
    { icon: "people-outline", label: "Referrals", route: "/referrals" }, // Ensure this matches your route
  ];
  
  // Function to handle menu item clicks
  const handleMenuClick = async (route) => {
    try {
      // Check if the route is an external URL (mailto, https, etc.)
      if (route.startsWith('http') || route.startsWith('mailto')) {
        const supported = await Linking.canOpenURL(route);
        if (supported) {
          await Linking.openURL(route); // Open WhatsApp, email, or other external URL
        } else {
          console.log(`Cannot open URL: ${route}`);
          Toast.show({
            type: "error",
            text1: `Cannot open ${route}`,
          });
        }
      } else {
        // Handle internal navigation using expo-router
        router.push(route); // Navigate to the internal route
      }
    } catch (error) {
      console.error('Error opening URL:', error);
      Toast.show({
        type: "error",
        text1: "An error occurred",
      });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: "#2B771",
          paddingVertical: 40,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#004E5D",
            fontWeight: "bold",
            fontSize: 20,
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          Profile
        </Text>
        <Image
          source={{ uri: "https://abh.ai/random/100" }}
          style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 10 }}
        />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            {capitalizeFirstLetter(username)}
          </Text>
          <Pressable
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <MaterialIcons
              name="edit"
              size={18}
              color="black"
              style={{ marginLeft: 8 }}
            />
          </Pressable>
        </View>
        <Text style={{ color: "#555" }}>{email}</Text>
        <Text style={{ fontSize: 17 }}>Tokens: {tokens}</Text>
      </View>

      {/* Menu Items */}
      <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleMenuClick(item.route)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingVertical: 15,
              borderBottomWidth: index < menuItems.length - 1 ? 1 : 0,
              borderColor: "#eee",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name={item.icon}
                size={20}
                style={{ marginRight: 15 }}
              />
              <Text style={{ fontSize: 16 }}>{item.label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              margin: 20,
              borderRadius: 10,
              padding: 20,
              elevation: 5,
            }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20 }}
            >
              Edit Profile
            </Text>

            <TextInput
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 10,
                borderRadius: 5,
                marginBottom: 15,
              }}
            />
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 10,
                borderRadius: 5,
                marginBottom: 20,
              }}
            />

            <TouchableOpacity
              onPress={handleSave}
              style={{
                backgroundColor: "#F47C20",
                padding: 12,
                borderRadius: 5,
                alignItems: "center",
              }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  Save
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}