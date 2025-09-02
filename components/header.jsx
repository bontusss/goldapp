import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../assets/styles/header.style';

export default function Header({ name, onNotificationPress, notificationCount = 0, text="Welcome," }) {
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>
        {text} <Text style={styles.name}>{name}</Text>
      </Text>
      <View style={styles.notificationWrapper}>
        <TouchableOpacity
          style={styles.notificationIcon}
          onPress={onNotificationPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="notifications-outline" size={28} color="#000" />
          {notificationCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {notificationCount > 9 ? '9+' : notificationCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     marginTop: 40,
//     marginBottom: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   welcome: {
//     fontSize: 26,
//     fontWeight: 'bold',
//   },
//   name: {
//     color: '#000',
//   },
//   notificationWrapper: {
//     position: 'relative',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   notificationIcon: {
//     marginLeft: 16,
//     position: 'relative',
//   },
//   badge: {
//     position: 'absolute',
//     top: -4,
//     right: -4,
//     backgroundColor: 'red',
//     borderRadius: 8,
//     minWidth: 16,
//     height: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 3,
//     zIndex: 2,
//   },
//   badgeText: {
//     color: '#fff',
//     fontSize: 10,
//     fontWeight: 'bold',
//   },
// });