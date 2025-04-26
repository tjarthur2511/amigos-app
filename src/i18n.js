// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      home: "Home",
      profile: "Profile",
      amigos: "Amigos",
      grupos: "Grupos",
      admin: "Admin",
      post: "Post",
      commentPlaceholder: "Comment...",
      save: "Save",
      yourProfile: "Your Profile",
      yourPosts: "Your Posts",
      yourGrupos: "Your Grupos",
      syncing: "Syncing vibes… loading your amigos 🧠💬",
      feed: "Feed",
      live: "Live",
      suggestions: "Suggestions",
      addPhoto: "Add Profile Photo (URL)",
      photoURL: "Image URL",
      yourName: "Your name",
      shortBio: "Short bio",
      noPosts: "No posts yet.",
      untitledPost: "Untitled Post",
      noContent: "No content",
      noGrupos: "No grupos created yet.",
      settings: "Settings",
    },
  },
  es: {
    translation: {
      home: "Inicio",
      profile: "Perfil",
      amigos: "Amigos",
      grupos: "Grupos",
      admin: "Administrador",
      post: "Publicar",
      commentPlaceholder: "Comenta...",
      save: "Guardar",
      yourProfile: "Tu Perfil",
      yourPosts: "Tus Publicaciones",
      yourGrupos: "Tus Grupos",
      syncing: "Sincronizando energías… cargando tus amigos 🧠💬",
      feed: "Noticias",
      live: "En Vivo",
      suggestions: "Sugerencias",
      addPhoto: "Agregar foto de perfil (URL)",
      photoURL: "URL de la imagen",
      yourName: "Tu nombre",
      shortBio: "Biografía corta",
      noPosts: "Aún no hay publicaciones.",
      untitledPost: "Publicación sin título",
      noContent: "Sin contenido",
      noGrupos: "Aún no has creado grupos.",
      settings: "Configuraciones",
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    react: {
      useSuspense: true, // optional: fallback UI for loading
    },
  });

export default i18n;
