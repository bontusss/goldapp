// styles/create.styles.js
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  welcome: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  name: {
    color: '#000',
  },
  notificationWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    marginLeft: 16,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'red',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    zIndex: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },

});

export default styles;