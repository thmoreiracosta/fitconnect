
import React, { useState, useEffect } from "react";
import { Gym } from "@/entities/Gym";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Search,
  Star,
  Phone,
  Globe,
  Clock,
  Wifi,
  Car,
  Dumbbell,
  Users
} from "lucide-react";

export default function Gyms() {
  const [currentUser, setCurrentUser] = useState(null);
  const [gyms, setGyms] = useState([]);
  const [filteredGyms, setFilteredGyms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGyms();
  }, []);

  useEffect(() => {
    filterGyms();
  }, [gyms, searchTerm, selectedCity]);

  const loadGyms = async () => {
    try {
      const me = await User.me();
      setCurrentUser(me);

      const allGyms = await Gym.list('-rating', 50);
      setGyms(allGyms);
      
      // Extrair cidades únicas
      const uniqueCities = [...new Set(allGyms.map(gym => gym.location?.city).filter(Boolean))].sort();
      setCities(uniqueCities);
      
      // Definir cidade padrão com base no usuário logado
      if (me?.location?.city && uniqueCities.includes(me.location.city)) {
        setSelectedCity(me.location.city);
      } else if (uniqueCities.length > 0) {
        // Fallback to first city if user location not available or not in list
        // Or keep "all" as default if no specific city should be pre-selected
        // For now, it will remain "all" if user city is not found or not set
      }

    } catch (error) {
      console.error("Erro ao carregar academias:", error);
    }
    setIsLoading(false);
  };

  const filterGyms = () => {
    let filtered = gyms;

    if (searchTerm) {
      filtered = filtered.filter(gym =>
        gym.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gym.address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCity !== "all") {
      filtered = filtered.filter(gym => gym.location?.city === selectedCity);
    }

    setFilteredGyms(filtered);
  };

  const getAmenityIcon = (amenity) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('wifi')) return <Wifi className="w-4 h-4" />;
    if (amenityLower.includes('estacionamento')) return <Car className="w-4 h-4" />;
    if (amenityLower.includes('musculação')) return <Dumbbell className="w-4 h-4" />;
    if (amenityLower.includes('grupo')) return <Users className="w-4 h-4" />;
    return <Badge className="w-4 h-4" />;
  };

  const formatOperatingHours = (hours) => {
    if (!hours) return 'Horários não informados';
    const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long' }).toLowerCase();
    const todaySchedule = hours[today];
    return todaySchedule || 'Fechado hoje';
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
          Academias Próximas
        </h1>
        <p className="text-gray-600 text-lg">
          Descubra as melhores academias num raio de 25km
        </p>
      </div>

      {/* Filtro de Busca */}
      <Card className="floating-card border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar academias por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-md border-0 bg-gray-50 focus:bg-white transition-colors"
              />
            </div>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="h-12 text-md border-0 bg-gray-50">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-gray-400" />
                  <SelectValue placeholder="Selecione uma cidade" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as cidades</SelectItem>
                {cities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Academias */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-3xl h-80"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredGyms.map((gym) => (
            <Card key={gym.id} className="floating-card border-0 shadow-lg overflow-hidden">
              {/* Imagens da Academia */}
              <div className="relative h-48 bg-gradient-to-br from-blue-500 to-emerald-500">
                {gym.images && gym.images.length > 0 ? (
                  <img
                    src={gym.images[0]}
                    alt={gym.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Dumbbell className="w-16 h-16 text-white/70" />
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/90 text-gray-900 flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-current" />
                    {gym.rating?.toFixed(1) || '5.0'}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6 space-y-4">
                {/* Nome e Localização */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{gym.name}</h3>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">{gym.address}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm">{formatOperatingHours(gym.operating_hours)}</span>
                  </div>
                </div>

                {/* Comodidades */}
                {gym.amenities && gym.amenities.length > 0 && (
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Comodidades:</h5>
                    <div className="flex flex-wrap gap-2">
                      {gym.amenities.slice(0, 4).map((amenity, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1 text-xs">
                          {getAmenityIcon(amenity)}
                          {amenity}
                        </Badge>
                      ))}
                      {gym.amenities.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{gym.amenities.length - 4} mais
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Planos de Mensalidade */}
                {gym.membership_plans && gym.membership_plans.length > 0 && (
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Planos:</h5>
                    <div className="space-y-2">
                      {gym.membership_plans.slice(0, 2).map((plan, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{plan.name}</p>
                            <p className="text-xs text-gray-500">{plan.duration}</p>
                          </div>
                          <p className="font-bold text-emerald-600">
                            R$ {plan.price?.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Avaliações */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-amber-400 fill-current mr-1" />
                    <span className="font-semibold text-gray-900">
                      {gym.rating?.toFixed(1) || '5.0'}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      ({gym.total_reviews || 0} avaliações)
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    ~2.5km de distância
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700">
                    <MapPin className="w-4 h-4 mr-2" />
                    Ver no Mapa
                  </Button>
                  {gym.phone && (
                    <Button variant="outline" size="icon">
                      <Phone className="w-4 h-4" />
                    </Button>
                  )}
                  {gym.website && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={gym.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredGyms.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhuma academia encontrada
          </h3>
          <p className="text-gray-500">
            Tente buscar por outros termos ou verifique sua localização
          </p>
        </div>
      )}
    </div>
  );
}
