// Liste noire d'insultes (FR / EN) - Tu pourras l'agrandir à volonté
const BLACKLIST_WORDS = [
  'merde',
  'connard',
  'salope',
  'encule',
  'chiasse',
  'pute',
  'con',
  'shit',
  'fuck',
  'bitch',
  'asshole',
  'dick',
  'bastard',
  'cunt',
  'sex',
];

// 1. Vérification du pseudo
export function validateUsername(username: string): {
  isValid: boolean;
  error?: string;
} {
  if (username.length > 12)
    return {
      isValid: false,
      error: 'Le pseudo doit faire 12 caractères maximum.',
    };
  if (username.length < 3)
    return {
      isValid: false,
      error: 'Le pseudo doit faire au moins 3 caractères.',
    };

  // Regex : Uniquement des lettres de A à Z (minuscules ou majuscules), pas d'espaces, pas de chiffres
  const lettersOnly = /^[a-zA-Z]+$/;
  if (!lettersOnly.test(username))
    return {
      isValid: false,
      error: 'Le pseudo ne doit contenir que des lettres.',
    };

  // Vérification de la liste noire
  const lowerUsername = username.toLowerCase();
  const hasBadWord = BLACKLIST_WORDS.some((badWord) =>
    lowerUsername.includes(badWord)
  );
  if (hasBadWord)
    return {
      isValid: false,
      error: 'Ce pseudo contient un mot interdit ou inapproprié.',
    };

  return { isValid: true };
}

// 2. Vérification de la robustesse du mot de passe
export function checkPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
  isValid: boolean;
} {
  if (!password)
    return { score: 0, label: 'Vide', color: 'bg-gray-600', isValid: false };

  const forbiddenPasswords = [
    '1234',
    '123456',
    '123456789',
    'azerty',
    'qwerty',
    'password',
    'motdepasse',
  ];
  if (forbiddenPasswords.includes(password.toLowerCase())) {
    return {
      score: 1,
      label: 'Interdit (Trop commun)',
      color: 'bg-red-600',
      isValid: false,
    };
  }

  if (password.length < 8) {
    return {
      score: 1,
      label: 'Trop court (Min 8 char)',
      color: 'bg-red-500',
      isValid: false,
    };
  }

  // Calcul du score de force
  let score = 1;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++; // Contient une majuscule
  if (/[0-9]/.test(password)) score++; // Contient un chiffre
  if (/[^A-Za-z0-9]/.test(password)) score++; // Contient un caractère spécial

  if (score <= 2)
    return { score, label: 'Faible', color: 'bg-orange-500', isValid: true };
  if (score <= 4)
    return { score, label: 'Moyen', color: 'bg-yellow-500', isValid: true };
  return { score, label: 'Excellent', color: 'bg-green-500', isValid: true };
}
