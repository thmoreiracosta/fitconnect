import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { WorkoutPlan } from "@/entities/WorkoutPlan";
import { Message } from "@/entities/Message";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  MapPin,
  Star,
  Users,
  Dumbbell,
  MessageCircle,
  TrendingUp,
  Calendar,
  Target,
  Award,
  Plus,
  ArrowRight
} from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [recentPlans, setRecentPlans] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      // Carregar usuários próximos (simulado - em produção usaria geolocalização)
      const users = await User.list('-created_date', 10);
      const filtered = users.filter(u => 
        u.id !== currentUser.id && 
        u.user_type !== currentUser.user_type &&
        u.is_active
      );
      setNearbyUsers(filtered.slice(0, 6));

      // Carregar planos de treino
      const plans = await WorkoutPlan.filter(
        currentUser.user_type === 'personal_trainer' 
          ? { trainer_id: currentUser.id }
          : { student_id: currentUser.id },
        '-created_date',
        5
      );
      setRecentPlans(plans);

      // Carregar mensagens não lidas
      const messages = await Message.filter(
        { receiver_id: currentUser.id, is_read: false },
        '-created_date'
      );
      setUnreadMessages(messages.length);

    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const isPersonalTrainer = user?.user_type === 'personal_trainer';

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header de Boas-vindas */}
      <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-3xl p-6 md:p-8 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {getGreeting()}, {user?.full_name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              {isPersonalTrainer 
                ? "Pronto para transformar vidas hoje?" 
                : "Vamos alcançar seus objetivos juntos!"}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16 border-4 border-white/30">
              <AvatarImage src={user?.profile_image} />
              <AvatarFallback className="bg-white/20 text-white text-xl">
                {user?.full_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            {user?.subscription?.plan === 'trial' && (
              <Badge className="bg-amber-500 text-white">
                Período de Teste
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="floating-card bg-gradient-to-br from-purple-50 to-blue-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {isPersonalTrainer ? 'Alunos Ativos' : 'Treinos Concluídos'}
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {recentPlans.filter(p => p.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                {isPersonalTrainer ? (
                  <Users className="w-6 h-6 text-white" />
                ) : (
                  <Target className="w-6 h-6 text-white" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="floating-card bg-gradient-to-br from-emerald-50 to-teal-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Mensagens</p>
                <p className="text-3xl font-bold text-gray-900">{unreadMessages}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="floating-card bg-gradient-to-br from-amber-50 to-orange-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Avaliação</p>
                <div className="flex items-center">
                  <p className="text-3xl font-bold text-gray-900 mr-2">
                    {user?.rating?.toFixed(1) || '5.0'}
                  </p>
                  <Star className="w-5 h-5 text-amber-500 fill-current" />
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seção Principal */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Usuários Próximos */}
        <div className="lg:col-span-2">
          <Card className="floating-card border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  {isPersonalTrainer ? 'Alunos Próximos' : 'Personal Trainers Próximos'}
                </CardTitle>
                <Link to={createPageUrl("Explore")}>
                  <Button variant="outline" size="sm" className="gap-2">
                    Ver Todos <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nearbyUsers.map((nearbyUser) => (
                  <div
                    key={nearbyUser.id}
                    className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={nearbyUser.profile_image} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white">
                          {nearbyUser.full_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {nearbyUser.full_name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {nearbyUser.location?.city || 'Localização não informada'}
                        </p>
                        <div className="flex items-center mt-1">
                          <Star className="w-4 h-4 text-amber-400 fill-current mr-1" />
                          <span className="text-sm text-gray-600">
                            {nearbyUser.rating?.toFixed(1) || '5.0'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Atividades Recentes */}
        <div>
          <Card className="floating-card border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold flex items-center">
                <Dumbbell className="w-5 h-5 mr-2 text-emerald-600" />
                Treinos Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPlans.slice(0, 4).map((plan) => (
                  <div key={plan.id} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{plan.title}</h4>
                      <p className="text-sm text-gray-500">
                        {plan.status === 'active' ? 'Em andamento' : 'Concluído'}
                      </p>
                    </div>
                    <Badge 
                      variant={plan.status === 'active' ? 'default' : 'secondary'}
                      className={plan.status === 'active' ? 'bg-emerald-100 text-emerald-800' : ''}
                    >
                      {plan.status === 'active' ? 'Ativo' : 'Finalizado'}
                    </Badge>
                  </div>
                ))}
                
                <Link to={createPageUrl("WorkoutPlans")}>
                  <Button variant="outline" className="w-full mt-4 gap-2">
                    <Plus className="w-4 h-4" />
                    {isPersonalTrainer ? 'Criar Novo Treino' : 'Ver Todos os Treinos'}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}