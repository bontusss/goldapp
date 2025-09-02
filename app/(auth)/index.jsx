import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useAuthStore } from '../../store/authstore';
import Toast from "react-native-toast-message";


export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { isLoading, login } = useAuthStore()
  const handleLogin = async () => {
    const result = await login(email, password);
    if (result.success) {
      router.push('/(tabs)');
    } else {
      Toast.show({type: "error", text1: "username or password mismatch"});
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Log In</Text>
        <Text style={styles.subtitle}>
          Log in to manage your savings and reach your goals!
        </Text>
      </View>

      <View style={styles.form}>
        {/* Email */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <Icon name="mail" size={20} color="#888" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>
        </View>

        {/* Password */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color="#888" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon
                name={showPassword ? 'eye' : 'eye-off'}
                size={20}
                color="#888"
                style={styles.toggleIcon}
              />
            </TouchableOpacity>
          </View>

          <View style={{ width: '100%', marginTop: 90 }}>
            {/* Sign Up Button */}
            <TouchableOpacity
              style={{
                backgroundColor: '#F47C20',
                paddingVertical: 14,
                borderRadius: 8,
                marginBottom: 12,
                alignItems: 'center',
              }}
              onPress={() => handleLogin()}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Login</Text>
              )}
            </TouchableOpacity>
          </View>
          <View style={{ width: '100%', alignItems: 'center', marginTop: 20 }}>
            <Text style={{ color: '#004E5D', fontSize: 16 }}>
              Dont have an account?
            </Text>
            <Text
              style={{ color: '#F47C20', fontWeight: 'bold' }}
              onPress={() => router.push('/(auth)/signup')}
            >
              Sign Up
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
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
  form: {
    width: '100%',
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontSize: 14,
    color: '#004E5D',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 8,
  },
  toggleIcon: {
    marginLeft: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
});
