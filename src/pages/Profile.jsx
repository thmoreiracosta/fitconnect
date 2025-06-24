
import React, { useState, useEffect } from "react";
import User from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Label from "@/components/ui/label";
import Textarea from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Badge from "@/components/ui/badge";
import Tabs from "@/components/ui/tabs";
import Select from "@/components/ui/Select";
import {
  User as UserIcon,
  Settings,
  Star,
  Award,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Edit3,
  Camera,
  Crown,
  Briefcase, // Added Briefcase icon
  LogOut
} from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      setEditData(currentUser);
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
    }
    setIsLoading(false);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent, field, value) => {
    setEditData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await User.updateMyUserData(editData);
      setUser(editData);
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
    }
    setIsSaving(false);
  };

  const handleLogout = async () => {
    try {
      await User.logout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const isPersonalTrainer = user?.user_type === 'personal_trainer';

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header do Perfil */}
      <Card className="floating-card border-0 shadow-lg overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-emerald-600"></div>
        <CardContent className="relative p-6">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            <div className="relative -mt-16">
              <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                <AvatarImage src={user?.profile_image} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white text-2xl">
                  {user?.full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <Button size="icon" className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full shadow-lg">
                <Camera className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{user?.full_name}</h1>
                {user?.is_verified && (
                  <Badge className="bg-emerald-500 text-white gap-1">
                    <Award className="w-3 h-3" />
                    Verificado
                  </Badge>
                )}
                {user?.subscription?.plan === 'premium' && (
                  <Badge className="bg-amber-500 text-white gap-1">
                    <Crown className="w-3 h-3" />
                    Premium
                  </Badge>
                )}
              </div>

              <p className="text-gray-600 capitalize">
                {user?.user_type?.replace('_', ' ')}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {user?.email}
                </div>
                {user?.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {user.phone}
                  </div>
                )}
                {user?.location?.city && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {user.location.city}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                  <span className="font-semibold">{user?.rating?.toFixed(1) || '5.0'}</span>
                  <span className="text-gray-500">({user?.total_reviews || 0} avaliações)</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-2">
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "outline" : "default"}
                className={isEditing ? "" : "bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                {isEditing ? 'Cancelar' : 'Editar Perfil'}
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conteúdo do Perfil */}
      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="bg-white border shadow-sm">
          <TabsTrigger value="personal">Informações Pessoais</TabsTrigger>
          <TabsTrigger value="professional">
            {isPersonalTrainer ? 'Perfil Profissional' : 'Objetivos Fitness'}
          </TabsTrigger>
          <TabsTrigger value="subscription">Assinatura</TabsTrigger>
        </TabsList>

        {/* Informações Pessoais */}
        <TabsContent value="personal">
          <Card className="floating-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserIcon className="w-5 h-5 mr-2 text-blue-600" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nome Completo</Label>
                  {isEditing ? (
                    <Input
                      id="full_name"
                      value={editData.full_name || ''}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{user?.full_name || 'Não informado'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={editData.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{user?.phone || 'Não informado'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birth_date">Data de Nascimento</Label>
                  {isEditing ? (
                    <Input
                      id="birth_date"
                      type="date"
                      value={editData.birth_date || ''}
                      onChange={(e) => handleInputChange('birth_date', e.target.value)}
                    />
                  ) : (
                    <p className="text-gray-900 py-2">
                      {user?.birth_date ? new Date(user.birth_date).toLocaleDateString('pt-BR') : 'Não informado'}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  {isEditing ? (
                    <Input
                      id="city"
                      value={editData.location?.city || ''}
                      onChange={(e) => handleNestedInputChange('location', 'city', e.target.value)}
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{user?.location?.city || 'Não informado'}</p>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-3 pt-6">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
                  >
                    {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Perfil Profissional */}
        <TabsContent value="professional">
          <Card className="floating-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-5 h-5 mr-2 text-emerald-600" />
                {isPersonalTrainer ? 'Perfil Profissional' : 'Objetivos Fitness'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {isPersonalTrainer ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="cref">CREF</Label>
                    {isEditing ? (
                      <Input
                        id="cref"
                        value={editData.personal_info?.cref || ''}
                        onChange={(e) => handleNestedInputChange('personal_info', 'cref', e.target.value)}
                        placeholder="Ex: 123456-G/SP"
                        required
                      />
                    ) : (
                      <p className="text-gray-900 py-2 flex items-center">
                        <Briefcase className="w-4 h-4 mr-2 text-gray-500"/>
                        {user?.personal_info?.cref || 'Não informado'}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Biografia</Label>
                    {isEditing ? (
                      <Textarea
                        id="bio"
                        rows={4}
                        value={editData.personal_info?.bio || ''}
                        onChange={(e) => handleNestedInputChange('personal_info', 'bio', e.target.value)}
                        placeholder="Conte sobre sua experiência e metodologia..."
                      />
                    ) : (
                      <p className="text-gray-900 py-2">
                        {user?.personal_info?.bio || 'Nenhuma biografia adicionada'}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="experience_years">Anos de Experiência</Label>
                      {isEditing ? (
                        <Input
                          id="experience_years"
                          type="number"
                          min="0"
                          value={editData.personal_info?.experience_years || ''}
                          onChange={(e) => handleNestedInputChange('personal_info', 'experience_years', parseInt(e.target.value))}
                        />
                      ) : (
                        <p className="text-gray-900 py-2">
                          {user?.personal_info?.experience_years || 0} anos
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hourly_rate">Valor por Hora (R$)</Label>
                      {isEditing ? (
                        <Input
                          id="hourly_rate"
                          type="number"
                          min="0"
                          step="0.01"
                          value={editData.personal_info?.hourly_rate || ''}
                          onChange={(e) => handleNestedInputChange('personal_info', 'hourly_rate', parseFloat(e.target.value))}
                        />
                      ) : (
                        <p className="text-gray-900 py-2">
                          R$ {user?.personal_info?.hourly_rate?.toFixed(2) || '0,00'}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Especialidades</Label>
                    <div className="flex flex-wrap gap-2">
                      {user?.personal_info?.specialties?.map((specialty, index) => (
                        <Badge key={index} variant="secondary">
                          {specialty}
                        </Badge>
                      )) || <p className="text-gray-500 py-2">Nenhuma especialidade adicionada</p>}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fitness_level">Nível de Condicionamento</Label>
                      {isEditing ? (
                        <Select
                          value={editData.student_info?.fitness_level || ''}
                          onValueChange={(value) => handleNestedInputChange('student_info', 'fitness_level', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione seu nível" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Iniciante</SelectItem>
                            <SelectItem value="intermediate">Intermediário</SelectItem>
                            <SelectItem value="advanced">Avançado</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-gray-900 py-2 capitalize">
                          {user?.student_info?.fitness_level || 'Não informado'}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="budget_range">Orçamento Mensal</Label>
                      {isEditing ? (
                        <Input
                          id="budget_range"
                          value={editData.student_info?.budget_range || ''}
                          onChange={(e) => handleNestedInputChange('student_info', 'budget_range', e.target.value)}
                          placeholder="Ex: R$ 200-400"
                        />
                      ) : (
                        <p className="text-gray-900 py-2">
                          {user?.student_info?.budget_range || 'Não informado'}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Objetivos Fitness</Label>
                    <div className="flex flex-wrap gap-2">
                      {user?.student_info?.fitness_goals?.map((goal, index) => (
                        <Badge key={index} variant="secondary" className="bg-emerald-100 text-emerald-800">
                          {goal}
                        </Badge>
                      )) || <p className="text-gray-500 py-2">Nenhum objetivo definido</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="health_conditions">Condições de Saúde</Label>
                    {isEditing ? (
                      <Textarea
                        id="health_conditions"
                        rows={3}
                        value={editData.student_info?.health_conditions || ''}
                        onChange={(e) => handleNestedInputChange('student_info', 'health_conditions', e.target.value)}
                        placeholder="Informe qualquer condição de saúde relevante..."
                      />
                    ) : (
                      <p className="text-gray-900 py-2">
                        {user?.student_info?.health_conditions || 'Nenhuma condição informada'}
                      </p>
                    )}
                  </div>
                </>
              )}

              {isEditing && (
                <div className="flex justify-end gap-3 pt-6">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
                  >
                    {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assinatura */}
        <TabsContent value="subscription">
          <Card className="floating-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Crown className="w-5 h-5 mr-2 text-amber-600" />
                Plano de Assinatura
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                <div>
                  <h3 className="font-semibold text-amber-900 capitalize">
                    Plano {user?.subscription?.plan || 'Trial'}
                  </h3>
                  <p className="text-sm text-amber-700">
                    Status: {user?.subscription?.status === 'active' ? 'Ativo' : 'Inativo'}
                  </p>
                  {user?.subscription?.end_date && (
                    <p className="text-sm text-amber-700">
                      Válido até: {new Date(user.subscription.end_date).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                  Gerenciar Plano
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-200 rounded-xl text-center">
                  <h4 className="font-semibold mb-2">Básico</h4>
                  <p className="text-2xl font-bold text-gray-900 mb-2">R$ 29,90</p>
                  <p className="text-sm text-gray-500">por mês</p>
                </div>
                
                <div className="p-4 border-2 border-blue-500 rounded-xl text-center bg-blue-50">
                  <h4 className="font-semibold mb-2 text-blue-900">Premium</h4>
                  <p className="text-2xl font-bold text-blue-900 mb-2">R$ 49,90</p>
                  <p className="text-sm text-blue-700">por mês</p>
                  <Badge className="mt-2 bg-blue-500">Recomendado</Badge>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-xl text-center">
                  <h4 className="font-semibold mb-2">Pro</h4>
                  <p className="text-2xl font-bold text-gray-900 mb-2">R$ 99,90</p>
                  <p className="text-sm text-gray-500">por mês</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}