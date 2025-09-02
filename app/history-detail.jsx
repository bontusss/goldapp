import { View, Text } from 'react-native';
import React from 'react';

export default function historyDetail({ route }) {
  // Optional: Get item from route if navigation is being used
  const item = route?.params?.item || {
    label: 'Deposit',
    time: '12:30 PM',
    amount: 10000,
    date: 'May 15, 2025',
    status: 'Successful',
    from: 'External Account',
    to: 'Admin Account',
    icon: '⬇️'
  };

  return (
    <View style={{
      paddingHorizontal: 20,
      paddingTop: 50,
      flex: 1,
      backgroundColor: '#fff'
    }}>
      <Text style={{
        color: '#004E5D',
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 20,
        textAlign: 'center'
      }}>
        Transaction Details
      </Text>

      {/* Top Summary */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 30
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 22, marginRight: 10 }}>{item.icon}</Text>
          <View>
            <Text style={{ fontWeight: '600', fontSize: 16 }}>{item.label}</Text>
            <Text style={{ fontSize: 12, color: '#888' }}>{item.time}</Text>
          </View>
        </View>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.amount.toLocaleString()}</Text>
      </View>

      {/* Details */}
      <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 15, marginTop: 30 }}>Details</Text>
      <View style={{ borderTopWidth: 1, borderColor: '#eee' }}>
        {[
          { title: 'Date', value: item.date },
          { title: 'Status', value: item.status },
          { title: 'From', value: item.from },
          { title: 'To', value: item.to }
        ].map((detail, index) => (
          <View
            key={index}
            style={{
              paddingVertical: 15,
              borderBottomWidth: index < 3 ? 1 : 0,
              borderColor: '#eee',
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <Text style={{ color: '#aaa' }}>{detail.title}</Text>
            <Text style={{ fontWeight: '500' }}>{detail.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
