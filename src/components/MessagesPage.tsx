import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Message, Conversation, User } from '@/lib/types';
import { generateMockUsers, getCurrentUser } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Send } from '@phosphor-icons/react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

export function MessagesPage() {
  const [users] = useKV<User[]>('users', generateMockUsers());
  const [currentUser] = useKV<User>('currentUser', getCurrentUser());
  const [conversations, setConversations] = useKV<Conversation[]>('conversations', []);
  const [messages, setMessages] = useKV<Message[]>('messages', []);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  // Create mock conversations if none exist
  const mockConversations: Conversation[] = users.slice(0, 3).map(user => ({
    id: `conv-${user.id}`,
    participants: [currentUser.id, user.id],
    lastMessage: {
      id: `msg-${Date.now()}-${user.id}`,
      senderId: user.id,
      receiverId: currentUser.id,
      text: `Hey! How are you doing?`,
      timestamp: Date.now() - Math.random() * 86400000,
      isRead: Math.random() > 0.5
    },
    unreadCount: Math.floor(Math.random() * 3)
  }));

  const activeConversations = conversations.length > 0 ? conversations : mockConversations;

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversation(conversationId);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const conversation = activeConversations.find(c => c.id === selectedConversation);
    if (!conversation) return;

    const otherParticipant = conversation.participants.find(p => p !== currentUser.id);
    if (!otherParticipant) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      receiverId: otherParticipant,
      text: newMessage,
      timestamp: Date.now(),
      isRead: false
    };

    setMessages(currentMessages => [...currentMessages, message]);
    setNewMessage('');
    toast.success('Message sent!');
  };

  const getConversationMessages = (conversationId: string) => {
    const conversation = activeConversations.find(c => c.id === conversationId);
    if (!conversation) return [];

    return messages.filter(msg => 
      conversation.participants.includes(msg.senderId) && 
      conversation.participants.includes(msg.receiverId)
    ).sort((a, b) => a.timestamp - b.timestamp);
  };

  const getOtherUser = (conversation: Conversation) => {
    const otherUserId = conversation.participants.find(p => p !== currentUser.id);
    return users.find(u => u.id === otherUserId);
  };

  if (selectedConversation) {
    const conversation = activeConversations.find(c => c.id === selectedConversation);
    const otherUser = conversation ? getOtherUser(conversation) : null;
    const conversationMessages = getConversationMessages(selectedConversation);

    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedConversation(null)}
          >
            <ArrowLeft size={20} />
          </Button>
          {otherUser && (
            <>
              <Avatar className="w-8 h-8">
                <AvatarImage src={otherUser.avatar} alt={otherUser.username} />
                <AvatarFallback>{otherUser.username[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{otherUser.username}</p>
                <p className="text-xs text-muted-foreground">Active now</p>
              </div>
            </>
          )}
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {conversationMessages.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Start the conversation!</p>
              </div>
            ) : (
              conversationMessages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-2xl ${
                      message.senderId === currentUser.id
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {formatDistanceToNow(new Date(message.timestamp))} ago
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send size={16} />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-semibold">Messages</h1>
      </div>

      <ScrollArea className="h-full">
        <div className="space-y-2 p-4">
          {activeConversations.map(conversation => {
            const otherUser = getOtherUser(conversation);
            if (!otherUser) return null;

            return (
              <Card key={conversation.id} className="p-0 border-0 shadow-none">
                <button
                  onClick={() => handleConversationSelect(conversation.id)}
                  className="w-full p-3 text-left hover:bg-muted/50 transition-colors rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={otherUser.avatar} alt={otherUser.username} />
                      <AvatarFallback>{otherUser.username[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm">{otherUser.username}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(conversation.lastMessage.timestamp))}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage.text}
                      </p>
                    </div>
                    
                    {conversation.unreadCount > 0 && (
                      <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-semibold">
                          {conversation.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}