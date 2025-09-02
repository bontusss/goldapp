import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Modal, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../../assets/styles/default.style';
import Header from '../../components/header';
import InvestmentDashboard from '../../components/invest-dash';
import { useAuthStore } from '../../store/authstore';
import Toast from 'react-native-toast-message';
import { colors } from '../../constants/colors';

const CARD_WIDTH = (Dimensions.get('window').width - 60) / 2;

export default function Investment() {
  const getUserInvestments = useAuthStore((state) => state.getUserInvestments);
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFabText, setShowFabText] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [accountName, setAccountName] = useState('');
  const [bankName, setBankName] = useState('');
  const [refCode, setRefCode] = useState('');
  const [amount, setAmount] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const { createInvestmentPaymentRequest } = useAuthStore()

  const handleCreateInvestment = () => {
    setModalVisible(true);
  };

  const handleModalSubmit = async () => {
  if (!accountName.trim() || !bankName.trim()  || !refCode.trim()) {
    Toast.show({
      type: 'error',
      text1: 'Please fill in all fields',
    });
    return;
  }
  setModalLoading(true);
  try {
    const result = await createInvestmentPaymentRequest(
      accountName,
      bankName,
      refCode,
      amount,
    );
    if (result.success) {
      Toast.show({
        type: 'success',
        text1: 'Investment request created successfully',
      });
      setModalVisible(false);
      setAccountName('');
      setBankName('');
      setRefCode('');
      setAmount('');
    } else {
      Toast.show({
        type: 'error',
        text1: result.message || 'Failed to create investment request',
      });
    }
  } catch (e) {
    Toast.show({
      type: 'error',
      text1: e.message || 'An error occurred',
    });
  } finally {
    setModalLoading(false);
  }
};

  const bankAccountNumber = "0908987767";
  const handleCopyAccount = async () => {
    await Clipboard.setStringAsync(bankAccountNumber);
  };

  const fetchInvestments = async () => {
    setLoading(true);
    const result = await getUserInvestments();
    console.log(result)
    if (result.success) {
      setInvestments(result.investments);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchInvestments();
    setRefreshing(false);
  }, []);


  return (
    <View style={[styles.container, { flex: 1, position: 'relative' }]}>
      <Header notificationCount={0} text={"Investment"} />
      <InvestmentDashboard />
      {loading ? (
        <View style={styless.loaderContainer}>
          <View style={styless.loaderShadow}>
            <ActivityIndicator size="large" color="#10B981" />
          </View>
        </View>
      ) : (
        <FlatList
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsHorizontalScrollIndicator={false}
          data={investments}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styless.container}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          renderItem={({ item }) => {
            const statusColorMap = {
              Pending: '#F59E0B',
              Active: '#10B981',
              Completed: '#3B82F6',
            };

            const planColorMap = {
              gold: '#FFD700',
              silver: '#C0C0C0',
              bronze: '#CD7F32',
              platinum: '#E5E4E2',
            };

            // fallback to status color if plan_name is not recognized
            const planKey = item.plan_name?.toLowerCase();
            const borderColor = planColorMap[planKey] || (statusColorMap[item.status] || '#D1D5DB');

            return (
              <View style={[styless.card, { borderColor, borderWidth: 1 }]}>
                <View style={styless.cardHeader}>
                  <Ionicons name="calendar-outline" size={20} color={borderColor} />
                  <Text style={styless.planName}>{item.plan_name}</Text>
                </View>
                <View style={[styless.badge, { backgroundColor: borderColor + '20' }]}>
                  <Text style={[styless.badgeText, { color: borderColor }]}>{item.status}</Text>
                </View>

                <View style={styless.row}>
                  <Text style={styless.label}>Interest Rate:</Text>
                  <Text style={styless.value}>{item.interest_rate}%</Text>
                </View>
                <View style={styless.row}>
                  <Text style={styless.label}>Amount:</Text>
                  <Text style={styless.value}>₦{item.amount.toLocaleString()}</Text>
                </View>
                {/* <View style={styless.row}>
                  <Text style={styless.label}>Interest Earned:</Text>
                  <Text style={[styless.value, { color: '#10B981' }]}>
                    ₦{item.interest_earned?.toLocaleString() || '0'}
                  </Text>
                </View>*/}
                <View style={styless.row}>
                  <Text style={styless.label}>Ref Code:</Text>
                  <Text style={{ color: '#10B981', fontSize: 9 }}>
                    {item.reference_id}
                  </Text>
                </View>
                <View style={styless.divider} />
                <View style={styless.row}>
                  <Text style={styless.label}>Start Date:</Text>
                  <Text style={styless.value}>
                    { new Date(item.created_at).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styless.row}>
                  <Text style={styless.label}>End Date:</Text>
                  <Text style={styless.value}>
                    {item.end_date?.Time ? new Date(item.end_date.Time).toLocaleDateString() : ''}
                  </Text>
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <Text style={styless.emptyText}>No investments found.</Text>
          }
        />
      )}

      <TouchableOpacity
        style={styless.fab}
        activeOpacity={0.8}
        onPress={handleCreateInvestment}
      >
        <Ionicons name="add" size={24} color="#fff" />
        {showFabText && (
          <Text style={styless.fabText}>Create Investment Request</Text>
        )}
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.4)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            backgroundColor: '#fff',
            borderRadius: 16,
            padding: 24,
            width: '85%',
            alignItems: 'center'
          }}>
            <Text style={{ fontSize: 19, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' }}>
              Create Investment Request
            </Text>
            <Text style={{ paddingBottom: 18 }}>To start saving, make a transfer to
              <Text style={styles.account}>UBA Bank
              </Text> with account number <Text style={styles.account}>0908987767 </Text>
              and account name
              <Text style={styles.account}> Gold Savings </Text>
              and fill the form below with your details.
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 10 }}>
              <Text style={{ color: '#10B981', fontWeight: 'bold', marginRight: 4 }}>Copy Account Number</Text>
              <TouchableOpacity onPress={handleCopyAccount}>
                <Ionicons name="copy-outline" size={20} color="#10B981" />
              </TouchableOpacity>
            </View>
            <TextInput
              placeholder="Account Name"
              value={accountName}
              onChangeText={setAccountName}
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 8,
                width: '100%',
                padding: 12,
                marginBottom: 12,
                fontSize: 16
              }}
            />
            <TextInput
              placeholder="Bank Name"
              value={bankName}
              onChangeText={setBankName}
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 8,
                width: '100%',
                padding: 12,
                marginBottom: 12,
                fontSize: 16
              }}
            />
            <TextInput
              placeholder="Amount"
              value={amount}
              onChangeText={setAmount}
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 8,
                width: '100%',
                padding: 12,
                marginBottom: 12,
                fontSize: 16
              }}
            />
            <TextInput
              placeholder="Ref Code"
              value={refCode}
              onChangeText={setRefCode}
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 8,
                width: '100%',
                padding: 12,
                marginBottom: 20,
                fontSize: 16
              }}
            />
            <TouchableOpacity
              style={{
                backgroundColor: '#10B981',
                borderRadius: 8,
                paddingVertical: 12,
                paddingHorizontal: 32,
                alignItems: 'center',
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'center'
              }}
              onPress={handleModalSubmit}
              disabled={modalLoading}
            >
              {modalLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
                  Submit
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styless = StyleSheet.create({
  container: {
    paddingTop: 30,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginBottom: 8,
  },
  planName: {
    fontWeight: 'bold',
    fontSize: 15,
    flex: 1,
    marginLeft: 6,
    color: '#111',
  },
  badge: {
    alignSelf: 'flex-start', // Only as wide as its content
    paddingVertical: 2,
    paddingHorizontal: 8, // More horizontal padding for a pill look
    borderRadius: 8,
    marginBottom: 6,
    marginTop: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
    width: '100%',
    alignSelf: 'center',
    opacity: 0.7,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  label: {
    fontSize: 12,
    color: '#555',
    marginBottom: 2,
  },
  value: {
    fontWeight: '600',
    fontSize: 12,
    color: '#222',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  loaderShadow: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 40,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
  },
  fabText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 15,
  },
  account: {
    "color": "green",
    fontWeight: 'bold',
  }
});
