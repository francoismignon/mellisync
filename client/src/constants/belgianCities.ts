//Liste des principales villes belges pour géocodage Open-Meteo
//Testées et validées avec l'API Open-Meteo Geocoding

export const BELGIAN_CITIES = [
  // Région de Bruxelles-Capitale
  "Bruxelles",
  
  // Flandre (principales villes)
  "Anvers",
  "Gand", 
  "Bruges",
  "Louvain",
  "Malines",
  "Hasselt",
  "Courtrai",
  "Ostende",
  "Alost",
  "Genk",
  "Roulers",
  "Turnhout",
  
  // Wallonie (principales villes)
  "Liège",
  "Charleroi", 
  "Namur",
  "Mons",
  "La Louvière",
  "Tournai",
  "Verviers",
  "Seraing",
  "Mouscron",
  "Arlon",
  "Dinant",
  "Huy",
  "Wavre",
  "Nivelles",
  "Bastogne"
] as const;

export type BelgianCity = typeof BELGIAN_CITIES[number];