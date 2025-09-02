import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { colors } from '../constants/colors';

export default function PlanCard({ name, returnRate, colors, icon, loading = false }) {
  // Shimmer animation
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (loading) {
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
    }
  }, [loading]);

  if (loading) {
    const translateX = shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [-120, 120],
    });

    return (
      <View style={styles.card}>
        <View style={styles.skeletonBlock} />
        <View style={[styles.skeletonBlock, { width: 60, height: 16, marginTop: 8 }]} />
        <Animated.View
          style={[
            styles.shimmer,
            { transform: [{ translateX }] }
          ]}
        >
          <LinearGradient
            colors={['transparent', 'rgba(255,255,255,0.4)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.return}>{returnRate} return</Text>
      <Text style={styles.icon}>{icon}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 120,
    height: 160,
    borderRadius: 15,
    paddingLeft: 10,
    paddingTop: 10,
    marginRight: 5,
    justifyContent: 'space-between',
    backgroundColor: colors.secondary,
    overflow: 'hidden',
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 23,
  },
  return: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 0
  },
  icon: {
    fontSize: 140,
    alignSelf: 'flex-end',
    color: '#fff',
    paddingBottom: 0
  },
  skeletonBlock: {
    width: 80,
    height: 20,
    borderRadius: 6,
    backgroundColor: '#d1d5db',
    marginTop: 20,
    marginBottom: 10,
  },
  shimmer: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
  },
});