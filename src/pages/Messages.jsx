import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Message } from "@/entities/Message";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Send,
  Search,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile
} from "lucide-react";

export default function Messages() {
  const [currentUser, setCurrentUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMessagesData();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadConversationMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const loadMessagesData = async () => {
    try {
      const me = await User.me();
      setCurrentUser(me);

      // Carregar conversas (simulado)
      const allMessages = await Message.list('-created_date', 100);
      const userMessages = allMessages.filter(msg => 
        msg.sender_id === me.id || msg.receiver_id === me.id
      );

      // Agrupar por conversas
      const conversationMap = new Map();
      
      for (const msg of userMessages) {
        const otherId = msg.sender_id === me.id ? msg.receiver_id : msg.sender_id;
        const conversationId = [me.id, otherId].sort().join('-');
        
        if (!conversationMap.has(conversationId)) {
          const otherUser = await User.filter({ id: otherId });
          conversationMap.set(conversationId, {
            id: conversationId,
            other_user: otherUser[0],
            last_message: msg,
            unread_count: 0
          });
        }
      }

      setConversations(Array.from(conversationMap.values()));
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error);
    }
    setIsLoading(false);
  };

  const loadConversationMessages = async (conversationId) => {
    try {
      const allMessages = await Message.list('-created_date', 50);
      const conversationMessages = allMessages.filter(msg => {
        const msgConversationId = [msg.sender_id, msg.receiver_id].sort().join('-');
        return msgConversationId === conversationId;
      });
      
      setMessages(conversationMessages.reverse());
    } catch (error) {
      console.error("Erro ao carregar mensagens da conversa:", error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      await Message.create({
        sender_id: currentUser.id,
        receiver_id: selectedConversation.other_user.id,
        conversation_id: selectedConversation.id,
        content: newMessage,
        message_type: "text"
      });

      setNewMessage("");
      loadConversationMessages(selectedConversation.id);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
            <div className="bg-gray-200 rounded-xl"></div>
            <div className="lg:col-span-2 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold gradient-text mb-2">Mensagens</h1>
        <p className="text-gray-600">Conecte-se com personal trainers e alunos</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Lista de Conversas */}
        <Card className="floating-card border-0 shadow-lg">
          <CardHeader className="pb-4 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <MessageCircle className="w-5 h-5 mr-2 text-blue-600" />
                Conversas
              </CardTitle>
              <Badge variant="secondary">
                {conversations.length}
              </Badge>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar conversas..."
                className="pl-9 border-0 bg-gray-50 focus:bg-white"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversation?.id === conversation.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={conversation.other_user?.profile_image} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white">
                        {conversation.other_user?.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {conversation.other_user?.full_name}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {formatTime(conversation.last_message?.created_date)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {conversation.last_message?.content || 'Sem mensagens'}
                      </p>
                    </div>
                    {conversation.unread_count > 0 && (
                      <Badge className="bg-blue-500 text-white text-xs">
                        {conversation.unread_count}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Área de Chat */}
        <div className="lg:col-span-2">
          {selectedConversation ? (
            <Card className="floating-card border-0 shadow-lg h-full flex flex-col">
              {/* Header do Chat */}
              <CardHeader className="pb-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={selectedConversation.other_user?.profile_image} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white">
                        {selectedConversation.other_user?.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {selectedConversation.other_user?.full_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {selectedConversation.other_user?.user_type === 'personal_trainer' 
                          ? 'Personal Trainer' 
                          : 'Aluno'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon">
                      <Phone className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Mensagens */}
              <CardContent className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender_id === currentUser.id ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-2xl ${
                          message.sender_id === currentUser.id
                            ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.sender_id === currentUser.id
                              ? 'text-blue-100'
                              : 'text-gray-500'
                          }`}
                        >
                          {formatTime(message.created_date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>

              {/* Input de Mensagem */}
              <div className="p-4 border-t">
                <form onSubmit={sendMessage} className="flex items-center space-x-2">
                  <Button type="button" variant="ghost" size="icon">
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Digite sua mensagem..."
                      className="pr-10 border-0 bg-gray-50 focus:bg-white"
                    />
                    <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0">
                      <Smile className="w-5 h-5" />
                    </Button>
                  </div>
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </Card>
          ) : (
            <Card className="floating-card border-0 shadow-lg h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-100 to-emerald-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Selecione uma conversa
                </h3>
                <p className="text-gray-500">
                  Escolha uma conversa para começar a trocar mensagens
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}