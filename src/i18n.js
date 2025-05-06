// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

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
      syncing: "Syncing vibes… loading your amigos",
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
      settings: "Settings"
    }
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
      syncing: "Sincronizando energías… cargando tus amigos",
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
      settings: "Configuración"
    }
  },
  fr: { translation: Object.fromEntries([
    "home","profile","amigos","grupos","admin","post","commentPlaceholder","save",
    "yourProfile","yourPosts","yourGrupos","syncing","feed","live","suggestions",
    "addPhoto","photoURL","yourName","shortBio","noPosts","untitledPost",
    "noContent","noGrupos","settings"
  ].map(key => [key, `[French] ${key}`])) },
  de: { translation: Object.fromEntries([
    "home","profile","amigos","grupos","admin","post","commentPlaceholder","save",
    "yourProfile","yourPosts","yourGrupos","syncing","feed","live","suggestions",
    "addPhoto","photoURL","yourName","shortBio","noPosts","untitledPost",
    "noContent","noGrupos","settings"
  ].map(key => [key, `[German] ${key}`])) },
  zh: { translation: Object.fromEntries([
    "home","profile","amigos","grupos","admin","post","commentPlaceholder","save",
    "yourProfile","yourPosts","yourGrupos","syncing","feed","live","suggestions",
    "addPhoto","photoURL","yourName","shortBio","noPosts","untitledPost",
    "noContent","noGrupos","settings"
  ].map(key => [key, `[Chinese] ${key}`])) },
  hi: { translation: Object.fromEntries([
    "home","profile","amigos","grupos","admin","post","commentPlaceholder","save",
    "yourProfile","yourPosts","yourGrupos","syncing","feed","live","suggestions",
    "addPhoto","photoURL","yourName","shortBio","noPosts","untitledPost",
    "noContent","noGrupos","settings"
  ].map(key => [key, `[Hindi] ${key}`])) },
  ar: { translation: Object.fromEntries([
    "home","profile","amigos","grupos","admin","post","commentPlaceholder","save",
    "yourProfile","yourPosts","yourGrupos","syncing","feed","live","suggestions",
    "addPhoto","photoURL","yourName","shortBio","noPosts","untitledPost",
    "noContent","noGrupos","settings"
  ].map(key => [key, `[Arabic] ${key}`])) },
  pt: { translation: Object.fromEntries([
    "home","profile","amigos","grupos","admin","post","commentPlaceholder","save",
    "yourProfile","yourPosts","yourGrupos","syncing","feed","live","suggestions",
    "addPhoto","photoURL","yourName","shortBio","noPosts","untitledPost",
    "noContent","noGrupos","settings"
  ].map(key => [key, `[Portuguese] ${key}`])) },
  ru: { translation: Object.fromEntries([
    "home","profile","amigos","grupos","admin","post","commentPlaceholder","save",
    "yourProfile","yourPosts","yourGrupos","syncing","feed","live","suggestions",
    "addPhoto","photoURL","yourName","shortBio","noPosts","untitledPost",
    "noContent","noGrupos","settings"
  ].map(key => [key, `[Russian] ${key}`])) },
  ja: { translation: Object.fromEntries([
    "home","profile","amigos","grupos","admin","post","commentPlaceholder","save",
    "yourProfile","yourPosts","yourGrupos","syncing","feed","live","suggestions",
    "addPhoto","photoURL","yourName","shortBio","noPosts","untitledPost",
    "noContent","noGrupos","settings"
  ].map(key => [key, `[Japanese] ${key}`])) },
  ko: { translation: Object.fromEntries([
    "home","profile","amigos","grupos","admin","post","commentPlaceholder","save",
    "yourProfile","yourPosts","yourGrupos","syncing","feed","live","suggestions",
    "addPhoto","photoURL","yourName","shortBio","noPosts","untitledPost",
    "noContent","noGrupos","settings"
  ].map(key => [key, `[Korean] ${key}`])) },
  tr: { translation: Object.fromEntries([
    "home","profile","amigos","grupos","admin","post","commentPlaceholder","save",
    "yourProfile","yourPosts","yourGrupos","syncing","feed","live","suggestions",
    "addPhoto","photoURL","yourName","shortBio","noPosts","untitledPost",
    "noContent","noGrupos","settings"
  ].map(key => [key, `[Turkish] ${key}`])) },
  ur: { translation: Object.fromEntries([
    "home","profile","amigos","grupos","admin","post","commentPlaceholder","save",
    "yourProfile","yourPosts","yourGrupos","syncing","feed","live","suggestions",
    "addPhoto","photoURL","yourName","shortBio","noPosts","untitledPost",
    "noContent","noGrupos","settings"
  ].map(key => [key, `[Urdu] ${key}`])) },
  bn: { translation: Object.fromEntries([
    "home","profile","amigos","grupos","admin","post","commentPlaceholder","save",
    "yourProfile","yourPosts","yourGrupos","syncing","feed","live","suggestions",
    "addPhoto","photoURL","yourName","shortBio","noPosts","untitledPost",
    "noContent","noGrupos","settings"
  ].map(key => [key, `[Bengali] ${key}`])) }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    react: { useSuspense: true },
  });

export default i18n;
