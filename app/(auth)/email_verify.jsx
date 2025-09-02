import { useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { Text, TextInput, TouchableOpacity, View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuthStore } from '../../store/authstore';
export default function EmailVerify() {

  const router = useRouter();
  const [codes, setCodes] = useState(['', '', '', '']);
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    const newCodes = [...codes];
    newCodes[index] = text;
    setCodes(newCodes);

    // Auto-focus next input if character entered
    if (text && index < 3) {
      inputs.current[index + 1].focus();
    }
  };

  const { isLoading, verifyEmail } = useAuthStore()
  const handleVerify = async () => {
    const code = codes.join('');
    if (code.length < 4) {
      alert('Please enter a valid 4-digit code');
      return;
    }
    const result = await verifyEmail(code);
    if (result.success) {
      router.push('/(tabs)'); // Navigate to signup or next step
    } else {
      alert('Verification failed. Please try again.');
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Email Verification</Text>
        <Text style={styles.subtitle}>
          Please check your email for a verification link to complete your registration.
        </Text>
      </View>
      {/* input boxes */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 40 }}>
        {codes.map((code, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputs.current[index] = ref)}
            style={{
              width: 50,
              height: 50,
              borderWidth: 1,
              borderRadius: 5,
              borderColor: '#ccc',
              textAlign: 'center',
              fontSize: 20,
              marginHorizontal: 5,
            }}
            keyboardType="numeric"
            maxLength={1}
            value={code}
            onChangeText={(text) => handleChange(text, index)}
          />
        ))}
      </View>
      <View>
        <Text style={{ marginTop: 20, textAlign: 'center', color: '#004E5D' }}>
          If you didn't receive the email, check your spam folder or{' '}
          <Text style={{ color: '#F47C20' }}>resend verification</Text>.
        </Text>
      </View>
      <View style={{ width: '100%', marginTop: 40 }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#F47C20',
            paddingVertical: 14,
            borderRadius: 8,
            marginBottom: 12,
            alignItems: 'center',
          }}
          onPress={() => handleVerify()}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Sign Up</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingTop: 80,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#004E5D',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 5,
    color: '#004E5D',
  },
});