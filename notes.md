# Liens entre JS, CSS et HTML

Il n'y a pas de classe “définie” .dark dans le code HTML.
Or, JavaScript peut l’ajouter dynamiquement à n’importe quel élément du DOM, et c’est précisément là que le pont entre le JS et le CSS se crée.

## Étape par étape: le lien CSS ⇄ JS

**1. En CSS:**

```CSS
body.dark {
  --bg-color: #0f172a;
  --text-color: #e5e7eb;
  /* ... */
}
```

Ici, les styles sont définient et s’appliqueront uniquement quand le <body> aura la classe dark.
Tant que le <body> ne contient pas cette classe, ces styles ne sont pas actifs.

**2. En HTML:**

```HTML
<body>
  ...
  <button id="theme-toggle">🌙</button>
</body>
```

Le <body> n’a pas la classe dark au départ, donc, seul le thème “clair” (défini dans :root { ... }) s’applique.

**3. En JavaScript:**

```JS
body.classList.toggle("dark");
```

Cette ligne dit à JavaScript: “Ajoute la classe dark au <body> si elle n’y est pas, ou enlève-la si elle y est déjà.”
Le navigateur met alors à jour le DOM (Document Object Model), et donc le HTML devient:

```HTML
<body class="dark">
  ...
</body>
```

**4. Le lien**

Le navigateur recalcule automatiquement le style CSS:

- il voit que body a maintenant la classe dark
- donc toutes les règles CSS qui ciblent body.dark { ... } deviennent actives

C’est le mécanisme de liaison implicite entre CSS et JS:

- le CSS écoute les états des classes dans le DOM
- et le JS modifie ces classes selon la logique définie

---

# Opérateurs JS

```JS
if (savedTheme === "dark" || (!savedTheme && prefersDark))
localStorage.setItem("theme", isDark ? "dark" : "light");
toggleButton.textContent = isDark ? "☀️" : "🌙";
```

<sub>code tiré de script.js, partie darkmode</sub>

## 3 opérateurs logiques et conditionnels: ===, ||, &&, et le ternaire?

**1. Ligne:**

```JS
if (savedTheme === "dark" || (!savedTheme && prefersDark))
```

Breakdown:

- savedTheme === "dark" -> vérifie si la variable savedTheme (récupérée depuis le localStorage) vaut exactement la chaîne "dark" -> si oui, application du mode sombre.
- || est l’opérateur logique “OR”, cela signifie: “si la première condition est vraie, ou, sinon, si la deuxième l’est, alors exécute le bloc.”
- (!savedTheme && prefersDark) -> !savedTheme veut dire “il n’y a pas de thème enregistré” (le ! inverse la valeur).
- && est l’opérateur logique “AND”, il vérifie que les deux conditions sont vraies en même temps.

Donc on lit pour `(!savedTheme && prefersDark)`: “si aucun thème n’est enregistré ET que le système préfère le mode sombre, alors active le dark mode.”

**2. Ligne:**

```JS
localStorage.setItem("theme", isDark ? "dark" : "light");
```

Breakdown:

- on a l’opérateur ternaire ? -> c’est une façon courte d’écrire un if...else en une seule ligne.
- structure -> condition **?** valeur_si_vrai **:** valeur_si_faux
- application -> isDark est la condition (vaut true si le body a la classe “dark”), si isDark est vrai → on enregistre "dark" sinon → on enregistre "light".

Donc localStorage.setItem("theme", isDark ? "dark" : "light"); équivaut à:

```JS
if (isDark) {
localStorage.setItem("theme", "dark");
} else {
localStorage.setItem("theme", "light");
}
```

**3. Ligne:**

```JS
toggleButton.textContent = isDark ? "☀️" : "🌙";
```

Breakdown:

- même logique, si isDark est vrai -> afficher le soleil ☀️ (mode sombre actif, clic = retour au clair)
- sinon -> afficher la lune 🌙 (mode clair actif, clic = passage au sombre)

Résumé des opérateurs utilisés
| Symbole | Nom | Sert à... | Exemple Signification |
| ------------------- | --- | ------------------------- | ------------------------------------------------------- |
| === | Strict equality | Comparer valeurs et types | x === "dark" vrai seulement si x est exactement "dark" |
| ! | NOT | Inverser une valeur booléenne | !savedTheme vrai si savedTheme est vide/faux |
| && | AND | Vérifie que deux conditions sont vraies | a && b vrai seulement si a ET b sont vrais |
| `||` | OR | Vérifie que au moins une est vraie | a || b vrai seulement si l'une des deux conditions est vrai |
| ? : | Ternary operator | Version courte d’un if...else | cond ? A : B retourne A si cond est vrai, sinon B |

## Opérateur ternaire

Le code suivant est:

```JS
if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
 body.classList.add("dark");
toggleButton.textContent = "☀️";
} else {
toggleButton.textContent = "🌙";
}
```

<sub>code tiré de script.js, partie darkmode</sub>

- lisible, clair
- chaque instruction est séparée, facilitant la maintenance
- idéal quand il y a plusieurs lignes à exécuter dans chaque branche

**Version ternaire possible**
On pourrais techniquement écrire:

```JS
(savedTheme === "dark" || (!savedTheme && prefersDark))
? (body.classList.add("dark"), toggleButton.textContent = "☀️")
: (toggleButton.textContent = "🌙");
```

Mais... c’est peu lisible et fragile:

- l’ordre d’exécution devient moins évident
- rarement utilisé dans du code de production
- complique le débogage et la compréhension

**Bon usage du ternaire**
Le ternaire est parfait pour une affectation simple, par ex:

```JS
toggleButton.textContent = isDark ? "☀️" : "🌙";
```

Il remplace un petit if/else d’une ligne, sans sacrifier la clarté.
