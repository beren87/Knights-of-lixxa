export type Bonus = {
  title: string;
  description: string;
  iconType: 'harvest' | 'activity' | 'combat';
};

export type Faction = {
  id: string;
  name: string;
  color: string; // Utilisé pour les bordures et effets visuels
  description: string;
  bonuses: Bonus[];
};

export const factions: Faction[] = [
  {
    id: 'bordill',
    name: 'Bordill',
    color: 'cyan',
    description:
      "Terre maritime baignée d'un automne éternel, Bordill prospère par ses ports florissants et sa redoutable cavalerie.",
    bonuses: [
      {
        title: 'Haras du Littoral',
        description: "Coût de l'écurie réduit de 10%",
        iconType: 'harvest',
      },
      {
        title: 'Maîtres des Filets',
        description: 'Vitesse de pêche +5%',
        iconType: 'activity',
      },
      {
        title: "Élan de l'Océan",
        description: 'Vitesse du Destrier en Tournois de Joute augmentée de 3%',
        iconType: 'combat',
      },
    ],
  },
  {
    id: 'veurn',
    name: 'Veurn',
    color: 'emerald',
    description:
      'Ancien joyau tombé en ruine, la Veurn est un royaume sauvage de forêts denses et de montagnes embrumées, terre rêvée des traqueurs.',
    bonuses: [
      {
        title: "Haches de l'Aube",
        description: 'Vitesse de récolte de bois +10%',
        iconType: 'harvest',
      },
      {
        title: 'Fureur Sylvestre',
        description: 'Attaque des animaux chassés -5%',
        iconType: 'activity',
      },
      {
        title: 'Pisteurs de Brume',
        description: "Récompense de pièces d'or en campagne +3%",
        iconType: 'combat',
      },
    ],
  },
  {
    id: 'valny',
    name: 'Valny',
    color: 'stone',
    description:
      "Protégé par des titans de roche, Valny est un royaume d'altitude où les vents froids forgent le caractère inébranlable de ses bâtisseurs.",
    bonuses: [
      {
        title: 'Carrières Titanesques',
        description: 'Vitesse de récolte de pierre +10%',
        iconType: 'harvest',
      },
      {
        title: "Greniers d'Altitude",
        description: 'Coût des vivres dans la Garnison -5%',
        iconType: 'activity',
      },
      {
        title: 'Bénédiction des Vents',
        description: "Soins des porteurs d'étendard en campagne +3%",
        iconType: 'combat',
      },
    ],
  },
  {
    id: 'le_loc',
    name: 'Le Loc',
    color: 'purple',
    description:
      "Dans les vallées pluvieuses du Sud, les habitants du Loc conservent d'antiques traditions, misant sur l'érudition et la résilience.",
    bonuses: [
      {
        title: 'Sagesse Ancestrale',
        description: 'Coût de la recherche académique -10%',
        iconType: 'harvest',
      },
      {
        title: 'Étoffes Traditionnelles',
        description: 'Coût réduit chez le Chasublier -5%',
        iconType: 'activity',
      },
      {
        title: 'Acier sous la Pluie',
        description: 'PV des armes au Béhourd +3%',
        iconType: 'combat',
      },
    ],
  },
  {
    id: 'makhins',
    name: 'Makhins',
    color: 'yellow',
    description:
      "Terre de lumière, le Makhins est le berceau d'une élite dorée, où la précision et l'opulence sont érigées en lois absolues.",
    bonuses: [
      {
        title: 'Silos Sécurisés',
        description: 'Pillage de vivres dans le Grenier -10%',
        iconType: 'harvest',
      },
      {
        title: 'Taxes Impériales',
        description: 'Rente journalière +5%',
        iconType: 'activity',
      },
      {
        title: "Coup d'Œil de l'Élu",
        description: 'Précision en Tournois de Joute +3%',
        iconType: 'combat',
      },
    ],
  },
  {
    id: 'dromgobir',
    name: 'Dromgobir',
    color: 'red',
    description:
      "Isolés sur leurs sommets gelés, les redoutables nains de Dromgobir vivent pour le fracas de l'acier et l'honneur du combat.",
    bonuses: [
      {
        title: 'Enclumes du Froid',
        description: "Vitesse de fabrication d'armure +10%",
        iconType: 'harvest',
      },
      {
        title: 'Chopes Débordantes',
        description: "Récompense d'or au Banquet +5%",
        iconType: 'activity',
      },
      {
        title: 'Rage de la Montagne',
        description: 'Chance de coup critique au Béhourd +3%',
        iconType: 'combat',
      },
    ],
  },
];
