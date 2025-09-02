import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import { colors } from '../../constants/colors'

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: '#888', tabBarStyle: { backgroundColor: '#fff', height: 60, paddingBottom: 5 } }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (<Ionicons name='home-outline' size={size} color={color} />),
        }}
      />

      <Tabs.Screen
        name="investment"
        options={{
          title: 'Investment',
          tabBarIcon: ({ color, size }) => (<Ionicons name='bag-outline' size={size} color={color} />),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (<Ionicons name='person-outline' size={size} color={color} />),
        }}
      />
    </Tabs>
  )
}