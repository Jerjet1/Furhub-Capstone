import { useAuth } from '@/context/AuthProvider';
import ChatScreen from '../../components/Chatscreen';

export default function ChatRoute() {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  return <ChatScreen currentUser={currentUser} />;
}
