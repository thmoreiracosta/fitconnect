import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  MapPin,
  Star,
  MessageCircle,
  Filter,
  Heart,
  Award,
  Clock,
  DollarSign
} from "lucide-react";

export default function Explore() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("all");
  const [filterDistance, setFilterDistance] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, filterSpecialty, filterDistance]);

  const loadUsers = async () => {
    try {
      const me = await User.me();
      setCurrentUser(me);

      const allUsers = await User.list('-created_date', 50);
      const otherUsers = allUsers.filter(user => 
        user.id !== me.id && 
        user.user_type !== me.user_type &&
        user.is_active
      );
      
      setUsers(otherUsers);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    }
    setIsLoading(false);
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.location?.city?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterSpecialty !== "all") {
      filtered = filtered.filter(user =>
        user.personal_info?.specialties?.includes(filterSpecialty) ||
        user.student_info?.fitness_goals?.includes(filterSpecialty)
      );
    }

    setFilteredUsers(filtered);
  };

  const getSpecialties = () => {
    const specialties = new Set();
    users.forEach(user => {
      if (user.personal_info?.specialties) {
        user.personal_info.specialties.forEach(spec => specialties.add(spec));
      }
      if (user.student_info?.fitness_goals) {
        user.student_info.fitness_goals.forEach(goal => specialties.add(goal));
      }
    });
    return Array.from(specialties);
  };

  const isPersonalTrainer = currentUser?.user_type === 'personal_trainer';

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
          Descubra {isPersonalTrainer ? 'Alunos' : 'Personal Trainers'}
        </h1>
        <p className="text-gray-600 text-lg">
          Encontre {isPersonalTrainer ? 'pessoas incríveis para treinar' : 'o personal ideal'} perto de você
        </p>
      </div>

      {/* Filtros */}
      <Card className="floating-card border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder={`Buscar ${isPersonalTrainer ? 'alunos' : 'personal trainers'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-0 bg-gray-50 focus:bg-white transition-colors"
              />
            </div>
            
            <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
              <SelectTrigger className="w-full md:w-48 border-0 bg-gray-50">
                <SelectValue placeholder="Especialidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as especialidades</SelectItem>
                {getSpecialties().map(specialty => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterDistance} onValueChange={setFilterDistance}>
              <SelectTrigger className="w-full md:w-40 border-0 bg-gray-50">
                <SelectValue placeholder="Distância" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Qualquer distância</SelectItem>
                <SelectItem value="5">Até 5km</SelectItem>
                <SelectItem value="10">Até 10km</SelectItem>
                <SelectItem value="25">Até 25km</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Lista de Usuários */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-3xl h-80"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="floating-card border-0 shadow-lg overflow-hidden group">
              <div className="relative">
                <div className="h-32 bg-gradient-to-br from-blue-500 to-emerald-500"></div>
                <Avatar className="absolute -bottom-8 left-6 w-16 h-16 border-4 border-white">
                  <AvatarImage src={user.profile_image} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white text-xl">
                    {user.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                {user.is_verified && (
                  <Badge className="absolute top-4 right-4 bg-emerald-500 text-white">
                    <Award className="w-3 h-3 mr-1" />
                    Verificado
                  </Badge>
                )}
              </div>

              <CardContent className="pt-12 p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {user.full_name}
                    </h3>
                    <div className="flex items-center text-gray-500 text-sm mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {user.location?.city || 'Localização não informada'}
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-amber-400 fill-current mr-1" />
                      <span className="text-sm font-medium text-gray-900">
                        {user.rating?.toFixed(1) || '5.0'}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">
                        ({user.total_reviews || 0} avaliações)
                      </span>
                    </div>
                  </div>

                  {/* Informações do Personal Trainer */}
                  {user.user_type === 'personal_trainer' && user.personal_info && (
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-2">Especialidades:</p>
                        <div className="flex flex-wrap gap-1">
                          {user.personal_info.specialties?.slice(0, 3).map(specialty => (
                            <Badge key={specialty} variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          {user.personal_info.experience_years || 0} anos
                        </div>
                        {user.personal_info.hourly_rate && (
                          <div className="flex items-center text-emerald-600 font-semibold">
                            <DollarSign className="w-4 h-4 mr-1" />
                            R$ {user.personal_info.hourly_rate}/h
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Informações do Aluno */}
                  {user.user_type === 'student' && user.student_info && (
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-2">Objetivos:</p>
                        <div className="flex flex-wrap gap-1">
                          {user.student_info.fitness_goals?.slice(0, 3).map(goal => (
                            <Badge key={goal} variant="secondary" className="text-xs bg-emerald-100 text-emerald-800">
                              {goal}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="text-sm">
                        <span className="text-gray-600">Nível: </span>
                        <span className="font-medium text-gray-900 capitalize">
                          {user.student_info.fitness_level || 'Iniciante'}
                        </span>
                      </div>
                    </div>
                  )}

                  {user.personal_info?.bio && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {user.personal_info.bio}
                    </p>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button className="flex-1 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Conversar
                    </Button>
                    <Button variant="outline" size="icon" className="shrink-0 hover:bg-red-50 hover:text-red-600 hover:border-red-200">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredUsers.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhum resultado encontrado
          </h3>
          <p className="text-gray-500">
            Tente ajustar os filtros ou buscar por outros termos
          </p>
        </div>
      )}
    </div>
  );
}