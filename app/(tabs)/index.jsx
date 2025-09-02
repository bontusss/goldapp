import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import styles from "../../assets/styles/default.style";
import Header from "../../components/header";
import PlanCard from "../../components/plancard";
import PortfolioCard from "../../components/portfolio-card";
import SavingsHistory from "../../components/savings-history";
import { useAuthStore } from "../../store/authstore";
import { colors } from "../../constants/colors";

export default function HomePage() {
  const router = useRouter();
  const {
    user,
    getInvestmentPlans,
    createInvestment,
    getUserSavingsTransactions,
    getUserSavingsBalance,
  } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [plans, setPlans] = useState([]);
  const [balance, setBalance] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const isLoading = refreshing || plans.length === 0;

  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [isSaveButtonVisible, setIsSaveButtonVisible] = useState(true);
  const [isWithdrawButtonVisible, setIsWithdrawButtonVisible] = useState(true);

  const toggleSaveButton = () => {
    setIsSaveButtonVisible(!isSaveButtonVisible);
  };

  const toggleWithdrawButton = () => {
    setIsWithdrawButtonVisible(!isWithdrawButtonVisible);
  };

  useEffect(() => {
    loadData();
    fetchBalance();
  }, []);

  const loadData = async () => {
    await loadTransactions();
    await loadPlans();
  };

  const loadTransactions = async () => {
    setTransactionsLoading(true);
    const result = await getUserSavingsTransactions();
    if (result.success) {
      setTransactions(result.transactions);
    }
    setTransactionsLoading(false);
  };

  const loadPlans = async () => {
    const result = await getInvestmentPlans();
    if (result.success) {
      setPlans(result.plans);
    }
  };

  const fetchBalance = async () => {
    try {
      const result = await getUserSavingsBalance();
      console.log("👉 balance result:", result);

      if (result?.success && typeof result.data === "number") {
        setBalance(result.data);
        console.log("✅ set balance to:", result.data);
      } else {
        console.warn("⚠️ Invalid result:", result);
      }
    } catch (err) {
      console.error("❌ Error fetching balance:", err);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    await fetchBalance();
    setRefreshing(false);
  }, []);

  function capitalize(str) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const handlePlanPress = (plan) => {
    setSelectedPlan(plan);
    setAmount("");
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    if (loading) return; // Prevent double submit
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      Toast.show({ type: "error", text1: "Please enter a valid amount" });
      return;
    }
    setLoading(true);
    const result = await createInvestment(selectedPlan.id, amount);
    setLoading(false);
    if (result.success) {
      Toast.show({
        type: "success",
        text1: "Investment created successfully!",
      });
      router.push("(tabs)/investment");
      setModalVisible(false);
      setAmount("");
    } else {
      Toast.show({
        type: "error",
        text1: result.error || "Failed to create investment",
      });
    }
  };

  // Combine all content into FlatList's header and footer
  return (
    <>
      <FlatList
        data={isLoading ? [1, 2, 3] : plans}
        keyExtractor={(item, idx) =>
          isLoading ? idx.toString() : item.id?.toString() || idx.toString()
        }
        horizontal={false}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <>
            <Header
              text="Welcome,"
              name={capitalize(user.username.trim()) + "."}
            />
            <PortfolioCard
              amount={balance}
              isSaveButtonVisible={isSaveButtonVisible}
              isWithdrawButtonVisible={user.total_savings ? isWithdrawButtonVisible : !isWithdrawButtonVisible}
            />
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.sectionTitle}>Choose an Investment plan</Text>
              {/* <Text style={{ fontSize: 16, marginTop: 12, color: '#FE555D' }}>See All &gt;</Text> */}
            </View>
            <FlatList
              data={isLoading ? [1, 2, 3] : plans}
              keyExtractor={(item, idx) =>
                isLoading
                  ? idx.toString()
                  : item.id?.toString() || idx.toString()
              }
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.plansContainer}
              renderItem={({ item, index }) =>
                isLoading ? (
                  <PlanCard loading />
                ) : (
                  <Pressable onPress={() => handlePlanPress(item)}>
                    <PlanCard
                      key={item.id || index}
                      name={item.name}
                      returnRate={`${item.interest_rate}%`}
                      colors={["#FBBF24", "#FCD34D", "#FDE68A"]}
                      icon="💰"
                    />
                  </Pressable>
                )
              }
            />
            <View style={{ marginTop: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: "500" }}>
                Savings History
              </Text>
              <SavingsHistory
                transactions={transactions}
                loading={transactionsLoading}
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            </View>
          </>
        }
        // If you want to render more items below, use ListFooterComponent
        renderItem={null}
        ListEmptyComponent={null}
        contentContainerStyle={styles.container}
      />

      {/* Modal for Plan */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 24,
              width: "85%",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 19,
                fontWeight: "bold",
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              {`Create a ${selectedPlan?.name} Investment`}
            </Text>
            <TextInput
              placeholder="Enter amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                width: "100%",
                padding: 12,
                marginBottom: 20,
                fontSize: 16,
              }}
            />
            <TouchableOpacity
              style={{
                backgroundColor: colors.primary,
                borderRadius: 8,
                paddingVertical: 12,
                paddingHorizontal: 32,
                alignItems: "center",
                width: "100%",
                flexDirection: "row",
                justifyContent: "center",
              }}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text
                  style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}
                >
                  Invest
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
