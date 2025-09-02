import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export default function withdraw() {
  const [amount, setAmount] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [bankName, setBankName] = useState('')
  const [planRef, setPlanref] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 80 }}>
      <View style={{ alignItems: 'center' }}>
        <Text style={{
          fontSize: 20,
          color: '#004E5D',
          fontWeight: '900'
        }}>Create Withdrawal Request</Text>
      </View>
      <View style={{ backgroundColor: '#E9FAFDB2', marginTop: 50 }}>

      </View>

      {/* form */}
      <View style={[styles.form, { marginTop: 40 }]}>
        {/* Amount */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Amount</Text>
          <View style={styles.inputContainer}>
            <Icon name="user" size={20} color="#888" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="150,000"
              value={amount}
              onChangeText={setAmount}
            />
          </View>
        </View>

        {/* Account Number */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Account Number</Text>
          <View style={styles.inputContainer}>
            <Icon name="phone" size={20} color="#888" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your account number"
              value={accountNumber}
              onChangeText={setAccountNumber}
            />
          </View>
        </View>

        {/* Bank Name */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Bank Name</Text>
          <View style={styles.inputContainer}>
            <Icon name="mail" size={20} color="#888" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your bank name"
              value={bankName}
              onChangeText={setBankName}
            />
          </View>
        </View>

        {/* Plan ref */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Plan Ref ID</Text>
          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color="#888" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter the plan ref ID"
              value={planRef}
              onChangeText={setPlanref}
            // todo: check if planRef exists and belongs to user
            />
          </View>

          <View style={{ width: '100%', marginTop: 40 }}>
            {/* Sign Up Button */}
            <TouchableOpacity
              style={{
                backgroundColor: '#F47C20',
                paddingVertical: 14,
                borderRadius: 8,
                marginBottom: 12,
                alignItems: 'center',
              }}
              onPress={() => console.log("funds added")}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Confirm</Text>
              )}
            </TouchableOpacity>
          </View>

        </View>
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