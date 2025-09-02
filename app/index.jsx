import { useRouter, useSegments } from 'expo-router';
import { useEffect } from "react";

import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "../store/authstore";

export default function Index() {
  const router = useRouter();

  const { user, } = useAuthStore();
 

  return (
    <ImageBackground
      source={require("../assets/images/overlay-bg.png")} 
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 20 }}>
        {/* You can optionally add a logo image again or leave it out if it's already in the background */}
        <View style={{ height: 300, width: 200, marginTop: 50 }}>
          {/* Optional: reuse logo in a smaller size if needed */}
        </View>

        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: '900', color: "white" }}>
            Get rewards while you save!
          </Text>
          <Text style={{ textAlign: 'center', marginTop: 10, color: "white" }}>
            Earn and convert TOKENS from your savings, referrals and completed cycles!
          </Text>
        </View>

        <View style={{ width: '100%', marginTop: 90 }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#F47C20',
              paddingVertical: 14,
              borderRadius: 8,
              marginBottom: 12,
              alignItems: 'center',
            }}
            onPress={() => router.push('/(auth)/signup')}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              paddingVertical: 14,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#F47C20',
              alignItems: 'center',
            }}
            onPress={() => router.push('/(auth)')}
          >
            <Text style={{ color: '#F47C20', fontWeight: 'bold', fontSize: 16 }}>Login</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={{
              backgroundColor: 'white',
              paddingVertical: 14,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#F47C20',
              alignItems: 'center',
            }}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={{ color: '#004E5D', fontWeight: 'bold', fontSize: 16 }}>Home</Text>
          </TouchableOpacity>*/}
        </View>
      </View>
    </ImageBackground>
  );
}
