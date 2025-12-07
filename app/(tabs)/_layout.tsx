import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import TabIconWithBadge from '@/components/ui/tabIconWithBadge';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useFavouriteStore } from '@/src/features/favouriteStore';
import { StyleSheet } from 'react-native';

type Props = {
  count: number;
  color: string;
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const favourites = useFavouriteStore((s) => s.favourites);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
       <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
        title: "Favourites",
        tabBarIcon: ({ color }) => (
           <TabIconWithBadge color={color} count={favourites.length} />
          ),
        }}
      />      
    </Tabs>
  );
}


const styles = StyleSheet.create({
  container: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    right: -6,
    top: -4,
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
});