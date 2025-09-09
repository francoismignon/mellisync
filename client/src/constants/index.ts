export const HIVE_TYPES = [
  { value: "DADANT", label: "Dadant" },
  { value: "LANGSTROTH", label: "Langstroth" },
  { value: "WARRE", label: "Warré" },
  { value: "KENYAN", label: "Kenyane" },
  { value: "VOIRNOT", label: "Voirnot" },
];

export const FRAME_COUNTS = [
  { value: "FRAME_8", label: "8 cadres" },
  { value: "FRAME_10", label: "10 cadres" },
  { value: "FRAME_12", label: "12 cadres" },
  { value: "FRAME_14", label: "14 cadres" },
];

export const HIVE_STATUS = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
];

export const HIVE_COLORS = [
  // Ligne 1 - tons chauds
  "#FF6B6B", "#FF8E53", "#FFB347", "#FFEAA7", "#F39C12", "#E67E22", "#D35400",
  // Ligne 2 - tons froids  
  "#74B9FF", "#45B7D1", "#00B894", "#4ECDC4", "#1DD1A1", "#00CEC9", "#6C5CE7",
  // Ligne 3 - tons naturels
  "#8B7355", "#A0522D", "#CD853F", "#DEB887", "#F5DEB3", "#D2B48C", "#BC9A6A",
  // Ligne 4 - tons vifs
  "#FF7675", "#FD79A8", "#FDCB6E", "#6C5CE7", "#A29BFE", "#DDA0DD", "#E17055",
  // Ligne 5 - neutres  
  "#636E72", "#2D3436", "#FFFFFF", "#F8F8FF", "#DCDDE1", "#B2BEC3", "#74B9FF"
];

// Générer les années de 1990 à 2030
export const HIVE_YEARS = Array.from({ length: 41 }, (_, i) => {
  const year = 1990 + i;
  return { value: year.toString(), label: year.toString() };
});

// Noms de fleurs pour les ruches
export const FLOWER_NAMES = [
  "Marguerite", "Lavande", "Rose", "Tulipe", "Violette", "Iris", "Jasmin", "Lys",
  "Pivoine", "Dahlia", "Jonquille", "Orchidée", "Mimosa", "Camélia", "Bégonia",
  "Fuchsia", "Géranium", "Hortensia", "Magnolia", "Azalée", "Rhododendron",
  "Glycine", "Clématite", "Capucine", "Pensée", "Myosotis", "Coquelicot",
  "Bleuet", "Tournesol", "Zinnia", "Cosmos", "Pétunia", "Impatiens", "Lobélia",
  "Balsamine", "Calendula", "Nigelle", "Delphinium", "Lupin", "Digitale",
  "Glaïeul", "Freesia", "Anthurium", "Hibiscus", "Gardénia", "Camélia", "Azalée"
];

// Noms de ruchers (lieux, nature, poétiques)
export const APIARY_NAMES = [
  "Les Coteaux", "Val Fleuri", "Mont des Abeilles", "Prairie Dorée", "Sous les Chênes",
  "Bord de Rivière", "Clairière", "Orée du Bois", "Miel Doré", "Nectar des Prés",
  "Butineuses Heureuses", "Ferme Saint-Martin", "Domaine des Tilleuls", "Clos des Acacias",
  "Haute Prairie", "Vallon Fleuri", "Colline aux Abeilles", "Jardin Secret", "Pré des Bourdons",
  "Source Claire", "Champ de Lavande", "Ruisseau Doré", "Bois des Merveilles", "Plateau Ensoleillé",
  "Verger Enchanté", "Plaine Fleurie", "Coteau des Miels", "Vallée Secrète", "Havre de Paix",
  "Terre Promise", "Refuge Doré", "Coin de Paradis", "Domaine Fleuri", "Clos Saint-Pierre",
  "Mas des Abeilles", "Ferme du Bonheur", "Jardin des Délices", "Prairie Enchantée",
  "Val de Miel", "Colline Dorée", "Bois Parfumé", "Champ des Rêves", "Rucher Royal"
];

export const TRANSHUMANCE_REASONS = [
  { value: "ACQUISITION", label: "Acquisition/Achat" },
  { value: "HONEY_FLOW", label: "Miellée" },
  { value: "WINTERING", label: "Hivernage" },
  { value: "POLLINATION", label: "Pollinisation" },
  { value: "TREATMENT", label: "Traitement" },
  { value: "MAINTENANCE", label: "Maintenance" },
  { value: "OTHER", label: "Autre" },
];
