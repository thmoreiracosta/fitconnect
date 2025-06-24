import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Target,
  Play,
  User,
  Dumbbell,
  ExternalLink
} from "lucide-react";

export default function WorkoutPlanDetails({ plan }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'completed': return 'Concluído';
      case 'paused': return 'Pausado';
      default: return 'Rascunho';
    }
  };

  return (
    <div className="space-y-6">
      {/* Informações Principais */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">{plan.title}</CardTitle>
              <p className="text-gray-600">{plan.description}</p>
            </div>
            <Badge className={getStatusColor(plan.status)}>
              {getStatusText(plan.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Duração</p>
                <p className="font-semibold">{plan.duration_weeks} semanas</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Exercícios</p>
                <p className="font-semibold">{plan.exercises?.length || 0} exercícios</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Aluno</p>
                <p className="font-semibold">{plan.student_id}</p>
              </div>
            </div>
          </div>

          {(plan.start_date || plan.end_date) && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Cronograma</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {plan.start_date && (
                  <div>
                    <span className="text-gray-500">Início:</span>
                    <span className="ml-2 font-medium">
                      {new Date(plan.start_date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}
                {plan.end_date && (
                  <div>
                    <span className="text-gray-500">Fim:</span>
                    <span className="ml-2 font-medium">
                      {new Date(plan.end_date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de Exercícios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Dumbbell className="w-5 h-5 mr-2 text-emerald-600" />
            Exercícios ({plan.exercises?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {plan.exercises?.map((exercise, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{exercise.name}</h4>
                    <p className="text-sm text-gray-500">{exercise.muscle_group}</p>
                  </div>
                  {exercise.video_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={exercise.video_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Vídeo
                      </a>
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Séries</p>
                    <p className="font-semibold text-gray-900">{exercise.sets}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Repetições</p>
                    <p className="font-semibold text-gray-900">{exercise.reps}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Descanso</p>
                    <p className="font-semibold text-gray-900">{exercise.rest_time || '-'}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Vídeo</p>
                    <p className="font-semibold text-gray-900">
                      {exercise.video_url ? '✓' : '-'}
                    </p>
                  </div>
                </div>

                {exercise.notes && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h5 className="text-sm font-medium text-blue-900 mb-1">Observações:</h5>
                    <p className="text-sm text-blue-800">{exercise.notes}</p>
                  </div>
                )}
              </div>
            ))}

            {(!plan.exercises || plan.exercises.length === 0) && (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Dumbbell className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">Nenhum exercício adicionado ainda</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}