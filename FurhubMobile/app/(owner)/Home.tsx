import { Link } from 'expo-router';
import { View, Text } from 'react-native';

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      {/* ...your existing UI... */}
      <View className="flex-row space-x-4">
        <Link
          href="/messages"
          asChild
        >
          <Text className="mt-4 px-4 py-3 bg-[#a3b84e] rounded-xl font-semibold">
            Chat
          </Text>
        </Link>
        
        {/* <Link
          href="/(owner)/Reviews"
          asChild
        >
          <Text className="mt-4 px-4 py-3 bg-[#f97316] rounded-xl font-semibold text-white">
            Reviews & Ratings
          </Text>
        </Link> */}
      </View>
    </View>
  );
}