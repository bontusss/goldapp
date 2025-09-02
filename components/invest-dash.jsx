import { Text, View } from 'react-native';
import { useAuthStore } from '../store/authstore';
import { useEffect, useState } from 'react';
import PortfolioCard from './portfolio-card';

export default function InvestmentDashboard({ totalBalance = 0, totalInterest = 0 }) {
  const { getUserinvestmentBalance } = useAuthStore()

  const[balance, setBalance] = useState(0)

  useEffect(() => {
    fetchBalance()
  })
  const fetchBalance = async () => {
    try {
      const result = await getUserinvestmentBalance();
      console.log("👉 balance result:", result);

      if (result?.success && typeof result.data === "number") {
        setBalance(result.data)
        console.log("✅ set balance to:", result.data);
      } else {
        console.warn("⚠️ Invalid result:", result);
      }
    } catch (err) {
      console.error("❌ Error fetching balance:", err);
    }
  };
  return (
    <View >
      <PortfolioCard amount={balance.toLocaleString()} text='Your total investment portfolio'/>
      {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ color: 'grey' }}>Total Balance</Text>
        <Text style={{ color: 'grey' }}>Total Interest</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text>
          <Text style={{ color: 'black' }}>₦</Text>
          <Text style={{ color: 'black', fontSize: '24' }}> {balance.toLocaleString()}</Text>
        </Text>
        <Text>
          <Text style={{ color: '#10B981' }}>₦</Text>
          <Text style={{ fontSize: 24, color: '#10B981', fontWeight: 'bold' }}> {totalInterest.toLocaleString()}</Text>
        </Text>
      </View> */}
    </View>
  )
}

