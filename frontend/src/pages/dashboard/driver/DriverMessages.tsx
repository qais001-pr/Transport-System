import { useContext, useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import {
  MessageSquare,
  Send,
  Search,
  Phone,
  MoreVertical,
  Paperclip,
  Image,
  CheckCheck,
  Clock,
  AlertCircle,
  Star,
} from 'lucide-react';
import userContext from "../../../context/userContext";

export default function DriverMessages() {
  const [selectedChat, setSelectedChat] = useState(1);
  const [messageText, setMessageText] = useState('');
  const { user, logOut }: any = useContext(userContext);

  const conversations = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Parent',
      avatar: null,
      lastMessage: 'Thank you for the update!',
      time: '10 mins ago',
      unread: 0,
      online: true,
      children: ['Emma Johnson', 'Oliver Johnson'],
    },
    {
      id: 2,
      name: 'Emily Davis',
      role: 'Parent',
      avatar: null,
      lastMessage: 'What time will you arrive?',
      time: '1 hour ago',
      unread: 2,
      online: true,
      children: ['Sophia Davis'],
    },
    {
      id: 3,
      name: 'Michael Smith',
      role: 'Parent',
      avatar: null,
      lastMessage: 'Sounds good, see you tomorrow',
      time: '3 hours ago',
      unread: 0,
      online: false,
      children: ['Oliver Smith'],
    },
    {
      id: 4,
      name: 'Admin Support',
      role: 'Admin',
      avatar: null,
      lastMessage: 'Your documents have been verified',
      time: 'Yesterday',
      unread: 1,
      online: true,
      children: [],
    },
    {
      id: 5,
      name: 'David Wilson',
      role: 'Parent',
      avatar: null,
      lastMessage: 'Thanks for being on time!',
      time: '2 days ago',
      unread: 0,
      online: false,
      children: ['Liam Wilson'],
    },
  ];

  const messages = [
    {
      id: 1,
      sender: 'Sarah Johnson',
      isSelf: false,
      message: 'Hi John, will you be on time today?',
      time: '9:30 AM',
      status: 'read',
    },
    {
      id: 2,
      sender: 'You',
      isSelf: true,
      message: 'Good morning! Yes, I\'m running on schedule. Will be there at 7:35 AM as usual.',
      time: '9:32 AM',
      status: 'read',
    },
    {
      id: 3,
      sender: 'Sarah Johnson',
      isSelf: false,
      message: 'Perfect! Emma is ready.',
      time: '9:33 AM',
      status: 'read',
    },
    {
      id: 4,
      sender: 'You',
      isSelf: true,
      message: 'Great! See you soon.',
      time: '9:35 AM',
      status: 'read',
    },
    {
      id: 5,
      sender: 'Sarah Johnson',
      isSelf: false,
      message: 'Thank you for the update!',
      time: '9:40 AM',
      status: 'read',
    },
  ];

  const currentChat = conversations.find(c => c.id === selectedChat);

  return (
    <div className="flex min-h-screen bg-neutral-50">
     <Sidebar
        userRole={user?.role || "Guest"}
        userName={user?.full_name || "Zaman Ali"}
        userEmail={user?.email || "zaman.ali@example.com"}
        logOut={logOut}
      />

      <div className="flex-1">
        <Header title="Messages" subtitle="Communicate with parents and administrators" role={user?.role}
          profile={user?.profile_photo || ""} />

        <main className="p-6">
          <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
            {/* Conversations List */}
            <Card className="lg:col-span-1 flex flex-col">
              <CardHeader>
                <CardTitle>Conversations</CardTitle>
                <CardDescription>
                  {conversations.filter(c => c.unread > 0).length} unread
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden flex flex-col p-0">
                {/* Search */}
                <div className="px-6 pb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search conversations..."
                      className="w-full pl-10 pr-4 py-3 rounded-button border-2 border-neutral-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Conversation List */}
                <div className="flex-1 overflow-y-auto">
                  {conversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => setSelectedChat(conversation.id)}
                      className={`w-full p-4 flex items-start gap-3 hover:bg-neutral-50 transition-colors border-l-4 ${
                        selectedChat === conversation.id
                          ? 'border-primary bg-primary-50'
                          : 'border-transparent'
                      }`}
                    >
                      <div className="relative">
                        <Avatar name={conversation.name} size="lg" />
                        {conversation.online && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-neutral-900 truncate">
                            {conversation.name}
                          </h4>
                          <span className="text-xs text-neutral-500 flex-shrink-0 ml-2">
                            {conversation.time}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-neutral-600 truncate">
                            {conversation.lastMessage}
                          </p>
                          {conversation.unread > 0 && (
                            <Badge variant="primary" className="ml-2 flex-shrink-0">
                              {conversation.unread}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {conversation.role}
                          </Badge>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Chat Window */}
            <Card className="lg:col-span-2 flex flex-col">
              {currentChat ? (
                <>
                  {/* Chat Header */}
                  <CardHeader className="border-b border-neutral-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar name={currentChat.name} size="lg" />
                          {currentChat.online && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-neutral-900">{currentChat.name}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {currentChat.role}
                            </Badge>
                            {currentChat.online && (
                              <span className="text-xs text-green-600">Online</span>
                            )}
                          </div>
                          {currentChat.children.length > 0 && (
                            <p className="text-xs text-neutral-600 mt-1">
                              Parent of: {currentChat.children.join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Messages */}
                  <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isSelf ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] ${
                            message.isSelf
                              ? 'bg-primary text-white'
                              : 'bg-neutral-100 text-neutral-900'
                          } rounded-2xl px-4 py-3`}
                        >
                          {!message.isSelf && (
                            <p className="text-xs font-semibold mb-1 opacity-70">
                              {message.sender}
                            </p>
                          )}
                          <p className="text-sm">{message.message}</p>
                          <div className="flex items-center justify-end gap-1 mt-1">
                            <span className={`text-xs ${message.isSelf ? 'text-white/70' : 'text-neutral-500'}`}>
                              {message.time}
                            </span>
                            {message.isSelf && (
                              <CheckCheck className="w-4 h-4 text-white/70" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>

                  {/* Message Input */}
                  <div className="p-4 border-t border-neutral-200">
                    <div className="flex items-end gap-3">
                      <Button variant="ghost" size="sm">
                        <Paperclip className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Image className="w-5 h-5" />
                      </Button>
                      <div className="flex-1">
                        <textarea
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          placeholder="Type your message..."
                          className="w-full px-4 py-3 rounded-xl border-2 border-neutral-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 resize-none"
                          rows={2}
                        />
                      </div>
                      <Button variant="primary" size="lg" disabled={!messageText.trim()}>
                        <Send className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-neutral-600">
                      Choose a conversation from the list to start messaging
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <Card hover>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-neutral-900">
                      {conversations.filter(c => c.unread > 0).reduce((acc, c) => acc + c.unread, 0)}
                    </h3>
                    <p className="text-sm text-neutral-600">Unread Messages</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card hover>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary-50 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-neutral-900">
                      {conversations.filter(c => c.online).length}
                    </h3>
                    <p className="text-sm text-neutral-600">Online Now</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card hover>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-highlight-50 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-highlight" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-neutral-900">
                      {conversations.length}
                    </h3>
                    <p className="text-sm text-neutral-600">Total Conversations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tips */}
          <Card className="mt-6 bg-secondary-50 border-2 border-secondary">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">Communication Tips</h3>
                  <ul className="space-y-1 text-sm text-neutral-700">
                    <li>• Respond to parent messages within 24 hours</li>
                    <li>• Keep communication professional and friendly</li>
                    <li>• Notify parents immediately about any delays or issues</li>
                    <li>• Use the delay report feature for route delays</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
