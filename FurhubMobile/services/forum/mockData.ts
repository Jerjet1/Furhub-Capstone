// services/forum/mockData.ts
export interface Comment {
  id: string;
  user: string;
  text: string;
}

export interface Post {
  id: string;
  user: { name: string; avatar: string };
  content: string;
  image?: string;
  likes: number;
  comments: Comment[];
  timestamp: string;
}

// Sample mock posts
export const mockPosts: Post[] = [
  {
    id: "1",
    user: { name: "Alice", avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
    content: "Look at my cute puppy! 🐶",
    image: "https://placedog.net/500/300",
    likes: 5,
    comments: [
      { id: "c1", user: "Bob", text: "Aww so cute!" },
      { id: "c2", user: "Charlie", text: "I love it!" },
    ],
    timestamp: new Date().toLocaleString(),
  },
  {
    id: "2",
    user: { name: "Bob", avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
    content: "Anyone recommend a good dog walker in Cebu?",
    likes: 3,
    comments: [],
    timestamp: new Date().toLocaleString(),
  },
];

// Function to create a new post
export function createPost(user: { name: string; avatar: string }, content: string, image?: string): Post {
  return {
    id: Date.now().toString(),
    user,
    content,
    image,
    likes: 0,
    comments: [],
    timestamp: new Date().toLocaleString(),
  };
}
