import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import User from "@/entities/User";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Dumbbell, User as UserIcon, ArrowRight } from "lucide-react";

export default function Onboarding() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);

  const handleSelectRole = async (role) => {
    setLoading(role);
    try {
      if (role === "student") {
        await User.updateMyUserData({ user_type: "student" });
        navigate("/profile");
      } else if (role === "personal_trainer") {
        // Não atualizamos o tipo ainda, isso será feito no formulário de cadastro do personal
        navigate("/register-trainer");
      }
    } catch (error) {
      console.error("Erro ao selecionar o perfil:", error);
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl flex items-center justify-center">
          <Dumbbell className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
          Bem-vindo ao FitConnect!
        </h1>
        <p className="text-gray-600 text-lg mb-10">
          Para começar, conte-nos um pouco sobre você.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="floating-card p-8 text-center border-0 shadow-lg">
            <CardContent className="p-0">
              <UserIcon className="w-16 h-16 mx-auto mb-6 text-blue-500" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Sou Aluno
              </h2>
              <p className="text-gray-500 mb-6">
                Quero encontrar personal trainers e atingir meus objetivos.
              </p>
              <Button
                variant="outline"
                className="w-full"
                disabled={loading === "student"}
                onClick={() => handleSelectRole("student")}
              >
                {loading === "student"
                  ? "Carregando..."
                  : "Continuar como Aluno"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="floating-card p-8 text-center border-0 shadow-lg">
            <CardContent className="p-0">
              <Dumbbell className="w-16 h-16 mx-auto mb-6 text-emerald-500" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Sou Personal
              </h2>
              <p className="text-gray-500 mb-6">
                Quero encontrar alunos e gerenciar minha carreira.
              </p>
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white"
                disabled={loading === "personal_trainer"}
                onClick={() => handleSelectRole("personal_trainer")}
              >
                {loading === "personal_trainer"
                  ? "Carregando..."
                  : "Continuar como Personal"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}