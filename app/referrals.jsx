import { Ionicons } from "@expo/vector-icons";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useAuthStore } from "../store/authstore";
import { colors } from "../constants/colors";
import { useState, useEffect } from "react";
import Toast from "react-native-toast-message";

export default function Referrals() {
  const { user, getUserRefs } = useAuthStore();
  const [refs, setRefs] = useState([]);
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { redeemTokens } = useAuthStore();

  useEffect(() => {
    getRefList();
  }, []);

  const getRefList = async () => {
    const data = await getUserRefs();
    console.log(data);
    if (data.success) {
      setRefs(data.list);
    }
  };

  const handleSave = async () => {
    if (!phone || !amount || phone.length < 11) {
      Toast.show({ type: "error", text1: "Provide valid phone and token amount" });
      return;
    }
  
    setLoading(true);
  
    const result = await redeemTokens(phone, amount);
    setLoading(false);
  
    if (result.success) {
      Toast.show({ type: "success", text1: "Token request sent" });
      setModalVisible(false);
    } else {
      Toast.show({ type: "error", text1: result.message });
    }
  };


  const referralStats = {
    rewardsEarned: user.total_tokens,
  };

  const referralCode = user.reference_id;
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Referral Summary</Text>
      <Text style={styles.inviteText}>Invite Your Friends</Text>
      <Text style={styles.subText}>
        invite your friends to join and earn...
      </Text>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Rewards Earned</Text>
          <Text style={styles.statValue}>{referralStats.rewardsEarned}</Text>
        </View>
        <View>
          <TouchableOpacity
            style={styles.statBox}
            onPress={() => {
              setPhone("");
              setAmount("");
              setModalVisible(true);
            }}
          >
            <Text style={styles.statLabel}>Redeem Tokens</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.linkContainer}>
        <Text style={styles.linkLabel}>Referral Code</Text>
        <TouchableOpacity style={styles.linkBox}>
          <Text style={styles.linkText}>{referralCode}</Text>
          <Ionicons name="copy-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.recentHeader}>Recent Referrals</Text>
      {refs.length === 0 ? (
        <Text style={{ textAlign: "center", paddingTop: 10 }}>
          No referrals yet.
        </Text>
      ) : (
        refs.map((r, index) => (
          <View key={index} style={styles.referralItem}>
            <Text style={styles.referralName}>{r.username}</Text>
            <Text style={styles.referralJoined}>
              {new Date(r.created_at.Time).toLocaleDateString()}
            </Text>
          </View>
        ))
      )}

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
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: colors.primary,
              }}
            >
              Convert tokens to airtime
            </Text>
            <Text style={{ color: colors.primary, paddingBottom: 10 }}>
              If you provide an incorrect phone number, your tokens will be
              lost.
            </Text>

            <TextInput
              placeholder="Phone Number"
              value={phone}
              onChangeText={setPhone}
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 10,
                borderRadius: 5,
                marginBottom: 15,
              }}
            />
            <TextInput
              placeholder="Amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="number"
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
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  Redeem
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    paddingTop: 80,
    color: colors.primary,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: colors.primary,
  },
  image: { width: 100, height: 100, alignSelf: "center", marginBottom: 10 },
  inviteText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.primary,
  },
  subText: {
    fontSize: 14,
    textAlign: "center",
    color: colors.primary,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statBox: {
    backgroundColor: colors.secondary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  statLabel: { fontSize: 14, color: "#fff", fontWeight: "bold" },
  statValue: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  linkContainer: { marginBottom: 20 },
  linkLabel: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  linkBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
  },
  linkText: { fontSize: 14, color: "white" },
  recentHeader: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  referralItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  referralName: { fontSize: 20 },
  referralJoined: { fontSize: 14, color: "#666", paddingTop: 5 },
});
