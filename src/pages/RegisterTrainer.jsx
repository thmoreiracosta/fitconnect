import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@/entities/User";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Award, Briefcase, DollarSign, Calendar, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function RegisterTrainer() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cref: "",
    specialties: "",
    experience_years: "",
    hourly_rate: "",
    bio: ""
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.cref) {
      setError("O número do CREF é obrigatório.");
      return;
    }
    setError(null);
    setIsSaving(true);

    try {
      const userDataToUpdate = {
        user_type: 'personal_trainer',
        personal_info: {
          cref: formData.cref,
          specialties: formData.specialties.split(',').map(s => s.trim()).filter(Boolean),
          experience_years: formData.experience_years ? parseInt(formData.experience_years) : 0,
          hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : 0,
          bio: formData.bio
        }
      };

      await User.updateMyUserData(userDataToUpdate);
      navigate(createPageUrl("Dashboard"));
    } catch (err) {
      console.error("Erro ao cadastrar personal trainer:", err);
      setError("Ocorreu um erro ao salvar seu cadastro. Tente novamente.");
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl floating-card border-0 shadow-lg">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl flex items-center justify-center">
            <Award className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold gradient-text">Cadastro de Personal Trainer</CardTitle>
          <p className="text-gray-500">Complete seu perfil para encontrar alunos.</p>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Erro!</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="cref" className="flex items-center">
                <Briefcase className="w-4 h-4 mr-2" />
                CREF (Conselho Regional de Educação Física)
              </Label>
              <Input
                id="cref"
                value={formData.cref}
                onChange={(e) => handleInputChange('cref', e.target.value)}
                placeholder="Ex: 123456-G/SP"
                required
              />
              <p className="text-xs text-gray-500">Seu perfil passará por um processo de verificação.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialties">Especialidades (separadas por vírgula)</Label>
              <Input
                id="specialties"
                value={formData.specialties}
                onChange={(e) => handleInputChange('specialties', e.target.value)}
                placeholder="Ex: Musculação, Emagrecimento, Funcional"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="experience_years" className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Anos de Experiência
                </Label>
                <Input
                  id="experience_years"
                  type="number"
                  min="0"
                  value={formData.experience_years}
                  onChange={(e) => handleInputChange('experience_years', e.target.value)}
                  placeholder="Ex: 5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hourly_rate" className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Valor por Hora (R$)
                </Label>
                <Input
                  id="hourly_rate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.hourly_rate}
                  onChange={(e) => handleInputChange('hourly_rate', e.target.value)}
                  placeholder="Ex: 120.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biografia</Label>
              <Textarea
                id="bio"
                rows={4}
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Fale sobre sua metodologia, sua paixão pelo esporte e como você pode ajudar seus alunos."
              />
            </div>

            <Button
              type="submit"
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white text-lg py-3"
            >
              {isSaving ? 'Salvando...' : 'Finalizar Cadastro'}
              <CheckCircle className="w-5 h-5 ml-2" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}