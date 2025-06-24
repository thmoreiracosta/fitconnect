import React, { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Label from "@/components/ui/label";
import Textarea from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Dumbbell } from "lucide-react";

export default function WorkoutPlanForm({ onSubmit, initialData = null }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    duration_weeks: initialData?.duration_weeks || 4,
    student_id: initialData?.student_id || "",
    exercises: initialData?.exercises || [
      {
        name: "",
        muscle_group: "",
        sets: 3,
        reps: "12",
        rest_time: "60s",
        notes: "",
        video_url: ""
      }
    ]
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExerciseChange = (index, field, value) => {
    const newExercises = [...formData.exercises];
    newExercises[index] = {
      ...newExercises[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      exercises: newExercises
    }));
  };

  const addExercise = () => {
    setFormData(prev => ({
      ...prev,
      exercises: [...prev.exercises, {
        name: "",
        muscle_group: "",
        sets: 3,
        reps: "12",
        rest_time: "60s",
        notes: "",
        video_url: ""
      }]
    }));
  };

  const removeExercise = (index) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Dumbbell className="w-5 h-5 mr-2 text-blue-600" />
            Informações do Plano
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título do Plano</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Ex: Treino de Hipertrofia - Iniciante"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duração (semanas)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="52"
                value={formData.duration_weeks}
                onChange={(e) => handleInputChange('duration_weeks', parseInt(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="student_id">ID do Aluno</Label>
            <Input
              id="student_id"
              value={formData.student_id}
              onChange={(e) => handleInputChange('student_id', e.target.value)}
              placeholder="Digite o ID do aluno"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descreva os objetivos e características deste plano..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Exercícios */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Exercícios</CardTitle>
            <Button type="button" onClick={addExercise} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Exercício
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {formData.exercises.map((exercise, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">Exercício {index + 1}</h4>
                {formData.exercises.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExercise(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome do Exercício</Label>
                  <Input
                    value={exercise.name}
                    onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                    placeholder="Ex: Supino reto"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Grupo Muscular</Label>
                  <Input
                    value={exercise.muscle_group}
                    onChange={(e) => handleExerciseChange(index, 'muscle_group', e.target.value)}
                    placeholder="Ex: Peito"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Séries</Label>
                  <Input
                    type="number"
                    min="1"
                    value={exercise.sets}
                    onChange={(e) => handleExerciseChange(index, 'sets', parseInt(e.target.value))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Repetições</Label>
                  <Input
                    value={exercise.reps}
                    onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                    placeholder="Ex: 8-12 ou 15"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tempo de Descanso</Label>
                  <Input
                    value={exercise.rest_time}
                    onChange={(e) => handleExerciseChange(index, 'rest_time', e.target.value)}
                    placeholder="Ex: 60s ou 1-2min"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Vídeo URL (opcional)</Label>
                  <Input
                    value={exercise.video_url}
                    onChange={(e) => handleExerciseChange(index, 'video_url', e.target.value)}
                    placeholder="https://youtube.com/..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea
                  value={exercise.notes}
                  onChange={(e) => handleExerciseChange(index, 'notes', e.target.value)}
                  placeholder="Dicas de execução, cuidados especiais..."
                  rows={2}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="submit" className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700">
          {initialData ? 'Atualizar Plano' : 'Criar Plano'}
        </Button>
      </div>
    </form>
  );
}