export interface Comment {
  id: string;
  user: string;
  text: string;
}

export interface Post {
  id: string;
  user: string;
  image?: string;
  text: string;
  likes: number;
  comments: Comment[];
}

export const mockPosts: Post[] = [
  {
    id: "1",
    user: "Alice",
    text: "Just adopted a new puppy! 🐶",
    image: "https://place-puppy.com/300x300",
    likes: 5,
    comments: [
      { id: "c1", user: "Bob", text: "So cute!" },
      { id: "c2", user: "Charlie", text: "Congrats!" },
    ],
  },
  {
    id: "2",
    user: "Bob",
    text: "Walked 3 dogs today, exhausting but fun!",
    likes: 3,
    comments: [{ id: "c3", user: "Alice", text: "You are amazing!" }],
  },
  {
    id: "3",
    user: "Charlie",
    text: "Does anyone know a good pet boarding in Cebu?",
    likes: 2,
    comments: [{ id: "c4", user: "Alice", text: "I recommend Cozy Paws!" }],
  },
];
