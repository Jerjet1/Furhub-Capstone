import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Import your screens
import PostsList from "../community/PostList";
import AddPost from "../community/AddPost";
import PostDetail from "../community/PostDetail";
import PostUpdate from "../community/PostUpdate";

const Stack = createStackNavigator();

export default function CommunityNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#FFB347" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen
        name="PostsList"
        component={PostsList}
        options={{ title: "Community" }}
      />
      <Stack.Screen
        name="AddPost"
        component={AddPost}
        options={{ title: "Add Post" }}
      />
      <Stack.Screen
        name="PostDetail"
        component={PostDetail}
        options={{ title: "Post Detail" }}
      />
      <Stack.Screen
        name="PostUpdate"
        component={PostUpdate}
        options={{ title: "Update Post" }}
      />
    </Stack.Navigator>
  );
}
