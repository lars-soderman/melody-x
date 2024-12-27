export const translations = {
  common: {
    loading: 'Laddar...',
    error: 'Ett fel uppstod',
    save: 'Spara',
    cancel: 'Avbryt',
    delete: 'Ta bort',
    back: 'Tillbaka',
    edit: 'Redigera',
    create: 'Skapa',
    loginToViewProjects: 'Logga in för att se dina melodikryss',
    noProjects: 'Du har inga melodikryss än',
  },
  auth: {
    signIn: 'Logga in',
    signingIn: 'Loggar in...',
    signOut: 'Logga ut',
    signingOut: 'Loggar ut...',
    signUp: 'Skapa konto',
    signInWithGoogle: 'Logga in med Google',
  },
  project: {
    new: 'Nytt melodikryss',
    name: 'Namn',
    myProjects: 'Mina melodikryss',
    localProjects: 'Lokala melodikryss',
    created: 'Skapad',
    creating: 'Skapar...',
    updating: 'Uppdaterar...',
    updated: 'Uppdaterad',
    public: 'Offentlig',
    private: 'Privat',
    delete: {
      confirm: 'Är du säker på att du vill ta bort detta melodikryss?',
      success: 'Melodikrysset har tagits bort',
    },
  },
  editor: {
    grid: {
      gridSize: 'Storlek',
      rows: 'Rader',
      cols: 'Kolumner',
      font: 'Typsnitt',
      reset: 'Återställ',
      export: 'Exportera',
      kryssplan: 'kryssplan',
    },
    hints: {
      title: 'Ledtrådar',
      add: 'Lägg till ledtråd',
      remove: 'Ta bort ledtråd',
      empty: 'Inga ledtrådar än',
    },
  },
} as const;

export type Translations = typeof translations;
