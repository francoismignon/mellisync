# 📚 **Tailwind CSS - Mini Cours**

Basé sur la doc officielle la plus récente, voici les **concepts essentiels** :

---

## **1. 🎯 Philosophie "Utility-First"**

**Ancien style (CSS classique) :**
```css
.nav-button {
  background: blue;
  padding: 1rem;
  border-radius: 0.5rem;
  color: white;
}
```

**Tailwind CSS :**
```html
<button class="bg-blue-600 p-4 rounded-lg text-white">
  Navigation
</button>
```

✅ **Avantages** : Pas de CSS custom, composants réutilisables, design cohérent

---

## **2. 📱 Responsive Design Mobile-First**

**Breakpoints par défaut :**
- `sm:` 640px+
- `md:` 768px+  
- `lg:` 1024px+
- `xl:` 1280px+
- `2xl:` 1536px+

**Exemple pratique :**
```html
<!-- Mobile d'abord, puis adaptations -->
<div class="text-center sm:text-left">
  <!-- Centré sur mobile, aligné à gauche sur 640px+ -->
</div>

<img class="w-16 md:w-32 lg:w-48">
  <!-- 64px → 128px → 192px selon écran -->
</img>
```

⚠️ **Erreur commune** : `sm:text-center` ne s'applique QUE sur 640px+, pas sur mobile !

---

## **3. 🎨 Classes Utilitaires Essentielles**

**Spacing (padding/margin) :**
```html
<div class="p-4 m-2">      <!-- padding: 1rem, margin: 0.5rem -->
<div class="px-6 py-4">    <!-- padding-x: 1.5rem, padding-y: 1rem -->
<div class="mt-8">         <!-- margin-top: 2rem -->
```

**Layout :**
```html
<div class="flex flex-col sm:flex-row">  <!-- Vertical mobile, horizontal desktop -->
<div class="grid grid-cols-2 lg:grid-cols-4">  <!-- 2 colonnes → 4 colonnes -->
```

**Couleurs :**
```html
<div class="bg-blue-600 text-white">     <!-- Fond bleu, texte blanc -->
<div class="hover:bg-blue-700">         <!-- Survol plus foncé -->
```

---

## **4. 🎭 États et Interactions**

```html
<button class="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 
               transition-colors duration-200">
  Bouton interactif
</button>

<!-- Focus pour accessibilité -->
<input class="border border-gray-300 focus:border-blue-500 focus:ring-2">
```

---

## **5. 🏗️ Container Queries (Moderne)**

```html
<div class="@container">
  <div class="flex flex-col @md:flex-row">
    <!-- Responsive selon la taille du PARENT, pas de l'écran -->
  </div>
</div>
```

---

## **6. 🎪 Exemple Complet Responsive**

```html
<div class="mx-auto max-w-sm space-y-4 rounded-xl bg-white p-8 
            shadow-lg sm:flex sm:items-center sm:space-y-0 sm:space-x-6">
  
  <img class="mx-auto h-24 w-24 rounded-full sm:mx-0 sm:shrink-0" 
       src="profile.jpg">
  
  <div class="text-center sm:text-left">
    <h2 class="text-lg font-semibold text-gray-900">Marie Dupont</h2>
    <p class="text-gray-500">Apicultrice</p>
    
    <button class="mt-4 rounded-full bg-blue-600 px-4 py-2 text-white
                   hover:bg-blue-700 active:bg-blue-800">
      Contacter
    </button>
  </div>
</div>
```

---

## **7. 📏 Système d'Espacement**

- `p-1` = 0.25rem (4px)
- `p-4` = 1rem (16px)  
- `p-8` = 2rem (32px)
- `p-px` = 1px
- `p-[13px]` = Valeur arbitraire

---

## **8. 🔧 Dark Mode**

```html
<div class="bg-white text-black dark:bg-gray-900 dark:text-white">
  Adapte selon préférence système
</div>
```

---

## **9. 🎨 Palette de Couleurs Courantes**

**Bleus (interface professionnelle) :**
- `bg-blue-50` - Très clair
- `bg-blue-600` - Standard
- `bg-blue-700` - Hover
- `bg-blue-900` - Très foncé

**Grays (textes et bordures) :**
- `text-gray-500` - Texte secondaire
- `text-gray-900` - Texte principal
- `border-gray-200` - Bordures claires
- `bg-gray-50` - Arrière-plans légers

---

## **10. 📐 Layout Flexbox Essentiels**

```html
<!-- Centrage horizontal/vertical -->
<div class="flex items-center justify-center">Centré</div>

<!-- Espace entre éléments -->
<div class="flex justify-between">
  <div>Gauche</div>
  <div>Droite</div>
</div>

<!-- Responsive flex direction -->
<div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
  <!-- Vertical mobile, horizontal desktop -->
</div>
```

---

## **11. 🎯 Grid System**

```html
<!-- Grid responsive -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

<!-- Grid avec spans -->
<div class="grid grid-cols-12 gap-4">
  <div class="col-span-12 md:col-span-8">Contenu principal</div>
  <div class="col-span-12 md:col-span-4">Sidebar</div>
</div>
```

---

## **12. 🎨 Ombres et Effets**

```html
<!-- Ombres -->
<div class="shadow-sm">Légère</div>
<div class="shadow-md">Moyenne</div>
<div class="shadow-lg">Forte</div>
<div class="shadow-xl">Très forte</div>

<!-- Transitions -->
<div class="transition-all duration-300 ease-in-out">
<div class="transform hover:scale-105">Zoom au survol</div>
```

---

## **✨ Bonnes Pratiques pour MelliSync**

1. **Mobile-first** : Toujours commencer par mobile
2. **Composants** : Créer des composants React réutilisables  
3. **Cohérence** : Utiliser les classes Tailwind plutôt que du CSS custom
4. **Performance** : Tailwind purge automatiquement les classes non-utilisées

**Pour votre navigation :**
```tsx
<nav className="flex flex-col sm:flex-row sm:items-center p-4 bg-white border-b">
  <h1 className="text-xl font-bold mb-4 sm:mb-0">MelliSync</h1>
  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6">
    {/* Liens de navigation */}
  </div>
</nav>
```

---

## **13. 🐝 Suggestions pour Navigation Apicole**

```tsx
// Couleurs thématiques miel/nature
<nav className="bg-amber-50 border-b border-amber-200">
  <div className="flex items-center justify-between p-4">
    <h1 className="text-2xl font-bold text-amber-900">🐝 MelliSync</h1>
    <div className="hidden md:flex space-x-6">
      <Link className="text-amber-700 hover:text-amber-900">Dashboard</Link>
      <Link className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700">
        Nouvelle Visite
      </Link>
    </div>
  </div>
</nav>
```

Cette approche respecte parfaitement vos contraintes mobile-first et UX terrain ! 🐝