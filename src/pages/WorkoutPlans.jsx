import React, { useState, useEffect } from "react";
import ProgressChart from "@/components/workout/ProgressChart";
import WorkoutCalendar from "@/components/workout/WorkoutCalendar";

import { User } from "@/entities/User";
import { WorkoutPlan } from "@/entities/WorkoutPlan";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Dumbbell,
  Calendar,
  Clock,
  Target,
  Plus,
  Play,
  Pause,
  CheckCircle,
  User as UserIcon,
  BarChart3,
} from "lucide-react";

import WorkoutPlanForm from "../components/workout/WorkoutPlanForm";
import WorkoutPlanDetails from "../components/workout/WorkoutPlanDetails";

export default function WorkoutPlans() {
  const [currentUser, setCurrentUser] = useState(null);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWorkoutPlans();
  }, []);

  const loadWorkoutPlans = async () => {
    try {
      const me = await User.me();
      setCurrentUser(me);

      const plans = await WorkoutPlan.filter(
        me.user_type === "personal_trainer"
          ? { trainer_id: me.id }
          : { student_id: me.id },
        "-created_date"
      );

      setWorkoutPlans(plans);
    } catch (error) {
      console.error("Erro ao carregar planos de treino:", error);
    }
    setIsLoading(false);
  };

  const handleCreatePlan = async (planData) => {
    try {
      await WorkoutPlan.create({
        ...planData,
        trainer_id: currentUser.id,
      });
      setShowCreateForm(false);
      loadWorkoutPlans();
    } catch (error) {
      console.error("Erro ao criar plano:", error);
    }
  };

  const updatePlanStatus = async (planId, newStatus) => {
    try {
      const plan = workoutPlans.find((p) => p.id === planId);
      await WorkoutPlan.update(planId, { ...plan, status: newStatus });
      loadWorkoutPlans();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "paused":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <Play className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "paused":
        return <Pause className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Ativo";
      case "completed":
        return "Concluído";
      case "paused":
        return "Pausado";
      default:
        return "Rascunho";
    }
  };

  const filterPlansByStatus = (status) => {
    if (status === "all") return workoutPlans;
    return workoutPlans.filter((plan) => plan.status === status);
  };

  const isPersonalTrainer = currentUser?.user_type === "personal_trainer";

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Dados mockados para exemplo visual
  const workoutProgress = [
    { week: "Semana 1", completed: 5 },
    { week: "Semana 2", completed: 7 },
    { week: "Semana 3", completed: 4 },
  ];

  const workoutDates = workoutPlans
    .filter((plan) => plan.status === "active" || plan.status === "completed")
    .flatMap((plan) => plan.dates?.map((date) => ({ date })) || []);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">
            {isPersonalTrainer ? "Planos de Treino" : "Meus Treinos"}
          </h1>
          <p className="text-gray-600">
            {isPersonalTrainer
              ? "Gerencie os treinos dos seus alunos"
              : "Acompanhe seu progresso e evolução"}
          </p>
        </div>

        {isPersonalTrainer && (
          <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 gap-2">
                <Plus className="w-4 h-4" />
                Criar Novo Plano
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Criar Novo Plano de Treino</DialogTitle>
              </DialogHeader>
              <WorkoutPlanForm onSubmit={handleCreatePlan} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="floating-card bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">Total</p>
                <p className="text-2xl font-bold text-blue-900">
                  {workoutPlans.length}
                </p>
              </div>
              <Dumbbell className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="floating-card bg-gradient-to-br from-emerald-50 to-emerald-100 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600 mb-1">
                  Ativos
                </p>
                <p className="text-2xl font-bold text-emerald-900">
                  {workoutPlans.filter((p) => p.status === "active").length}
                </p>
              </div>
              <Play className="w-8 h-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="floating-card bg-gradient-to-br from-amber-50 to-amber-100 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600 mb-1">
                  Pausados
                </p>
                <p className="text-2xl font-bold text-amber-900">
                  {workoutPlans.filter((p) => p.status === "paused").length}
                </p>
              </div>
              <Pause className="w-8 h-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="floating-card bg-gradient-to-br from-purple-50 to-purple-100 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 mb-1">
                  Concluídos
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {workoutPlans.filter((p) => p.status === "completed").length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para filtrar por status */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-white border shadow-sm">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="active">Ativos</TabsTrigger>
          <TabsTrigger value="paused">Pausados</TabsTrigger>
          <TabsTrigger value="completed">Concluídos</TabsTrigger>
          <TabsTrigger value="draft">Rascunhos</TabsTrigger>
        </TabsList>

        {["all", "active", "paused", "completed", "draft"].map((status) => (
          <TabsContent key={status} value={status} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterPlansByStatus(status).map((plan) => (
                <Card
                  key={plan.id}
                  className="floating-card border-0 shadow-lg overflow-hidden group"
                >
                  <div className="h-2 bg-gradient-to-r from-blue-500 to-emerald-500"></div>

                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">
                          {plan.title}
                        </CardTitle>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {plan.description || "Sem descrição"}
                        </p>
                      </div>
                      <Badge className={`${getStatusColor(plan.status)} gap-1`}>
                        {getStatusIcon(plan.status)}
                        {getStatusText(plan.status)}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        {plan.duration_weeks || 4} semanas
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Target className="w-4 h-4 mr-2" />
                        {plan.exercises?.length || 0} exercícios
                      </div>
                    </div>

                    {plan.start_date && (
                      <div className="text-sm text-gray-600">
                        <strong>Início:</strong>{" "}
                        {new Date(plan.start_date).toLocaleDateString("pt-BR")}
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setSelectedPlan(plan)}
                          >
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Ver Detalhes
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{plan.title}</DialogTitle>
                          </DialogHeader>
                          <WorkoutPlanDetails plan={plan} />
                        </DialogContent>
                      </Dialog>

                      {isPersonalTrainer && (
                        <div className="flex gap-1">
                          {plan.status === "active" && (
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() =>
                                updatePlanStatus(plan.id, "paused")
                              }
                              className="shrink-0"
                            >
                              <Pause className="w-4 h-4" />
                            </Button>
                          )}
                          {plan.status === "paused" && (
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() =>
                                updatePlanStatus(plan.id, "active")
                              }
                              className="shrink-0"
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                          )}
                          {plan.status !== "completed" && (
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() =>
                                updatePlanStatus(plan.id, "completed")
                              }
                              className="shrink-0"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filterPlansByStatus(status).length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Dumbbell className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhum plano encontrado
                </h3>
                <p className="text-gray-500 mb-4">
                  {status === "all"
                    ? "Você ainda não tem planos de treino"
                    : `Não há planos com status "${getStatusText(status)}"`}
                </p>
                {isPersonalTrainer && status === "all" && (
                  <Button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeiro Plano
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
