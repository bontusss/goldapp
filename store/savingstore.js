import { create } from 'zustand';

import AsyncStorage from '@react-native-async-storage/async-storage'; // Add this line
import { BASEURL } from '../constants/constant';


export const useSavingsStore = create((set) => ({
  plans: [],

  getPlans: async () => {
    console.log("getting plans");

    const token = await AsyncStorage.getItem('token') // fetch token from AsyncStorage
    console.log(token);

    if (!token) {
      return { message: "No token found" }
    }
    try {
      const res = await fetch(BASEURL + "plans", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      const data = await res.json()
      if (res.ok) {
        console.log(data);
        return data
      }
    } catch (error) {
      console.log(error);
      return { message: "error" }
    }
  }
}))