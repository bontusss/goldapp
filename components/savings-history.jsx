import { Ionicons } from '@expo/vector-icons'
import { useEffect, useRef } from 'react'
import { Animated, FlatList, StyleSheet, Text, View } from 'react-native'
import { RefreshControl } from 'react-native-web'

const getIconProps = (status) => {
  switch (status) {
    case 'approved':
      return { name: 'arrow-up', color: '#10B981' }
    case 'withdrawal':
      return { name: 'arrow-down', color: '#000' }
    case 'pending':
      return { name: 'time-outline', color: '#FBBF24' }
    case 'declined':
    case 'failed':
      return { name: 'close', color: 'grey' }
    default:
      return { name: 'help', color: 'black' }
  }
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toDateString();
}

// Shadow loader component
function TransactionLoader() {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 100],
  });

  return (
    <View style={loaderStyles.container}>
      <View style={loaderStyles.icon} />
      <View style={loaderStyles.textBlock} />
      <View style={loaderStyles.subTextBlock} />
      <Animated.View
        style={[
          loaderStyles.shimmer,
          { transform: [{ translateX }] }
        ]}
      />
    </View>
  );
}

const loaderStyles = StyleSheet.create({
  container: {
    height: 40,
    marginBottom: 20,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    position: 'relative',
  },
  icon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#d1d5db',
    marginRight: 10,
  },
  textBlock: {
    width: 80,
    height: 12,
    borderRadius: 4,
    backgroundColor: '#d1d5db',
    marginRight: 10,
  },
  subTextBlock: {
    width: 50,
    height: 10,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
    marginLeft: 'auto',
  },
  shimmer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.3)',
    width: 60,
    height: '100%',
    borderRadius: 8,
  },
});

export default function SavingsHistory({ transactions = [], loading = false, refreshing = false, onRefresh }) {
  // const { getUserSavingsTransactions } = useAuthStore();
  // const [transactions, setTransactions] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [refreshing, setRefreshing] = useState(false);

  // useEffect(() => {
  //   (async () => {
  //     setLoading(true);
  //     const result = await getUserSavingsTransactions();
  //     if (result.success) {
  //       setTransactions(result.transactions);
  //     }
  //     setLoading(false);
  //   })();
  // }, []);

  // const onRefresh = useCallback(async () => {
  //     setRefreshing(true);
  //     await getUserSavingsTransactions();
  //     setRefreshing(false);
  //   }, []);

  return (
    <View style={{ marginTop: 15, height: 300, marginBottom: 20 }}>
      <FlatList
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        data={loading ? [1, 2, 3, 4] : transactions}
        keyExtractor={(item, idx) => loading ? idx.toString() : item.id?.toString()}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !loading && (
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <Ionicons name="document-text-outline" size={36} color="#ccc" style={{ marginBottom: 8 }} />
              <Text style={{ color: 'grey' }}>No transactions yet.</Text>
            </View>
          )
        }
        renderItem={({ item }) => {
          if (loading) {
            return (
              <View>
                <TransactionLoader />
                <TransactionLoader />
                <TransactionLoader />
                <TransactionLoader />
              </View>
            );

          }
          const icon = getIconProps(item.status);
          return (
            <View style={{ marginBottom: 15 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name={icon.name} size={15} color={icon.color} style={{ marginRight: 6 }} />
                  <View>
                    <Text style={{ fontWeight: 'bold', color: icon.color, fontSize: 12 }}>
                      ₦ {Number(item.amount).toLocaleString()}
                    </Text>
                    <Text style={{ color: 'grey', fontSize: 10 }}>{item.status}</Text>
                  </View>
                </View>
                <Text style={{ color: 'grey', fontSize: 10 }}>
                  {formatDate(item.created_at?.Time)}
                </Text>
              </View>
              <View
                style={{
                  borderBottomColor: '#ccc',
                  borderBottomWidth: 1,
                  marginTop: 10,
                }}
              />
            </View>
          )
        }}
      />
    </View>
  )
}