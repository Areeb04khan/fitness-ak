// Meal rotations, hydration, and weather config remain static — the chatbot
// edits the training split, not the family recipe rotation.

export type Meal = {
  name: string;
  ingredients: string[];
  prepTonight: string[];
  recipe: string;
};

export const DINNER_ROTATION: Meal[] = [
  {
    name: "Rajma Chawal",
    ingredients: ["1 cup rajma (kidney beans)", "1 onion", "2 tomatoes", "Ginger-garlic paste", "Basmati rice", "Ghee, cumin, garam masala"],
    prepTonight: ["Soak rajma overnight in 4 cups water", "Chop onion & tomatoes, cover in fridge"],
    recipe: "Pressure cook soaked rajma 20 min. Sauté onion in ghee till golden, add ginger-garlic, tomatoes, spices; simmer 10 min. Combine with rajma, simmer 15 min. Serve over basmati.",
  },
  {
    name: "Palak Paneer with Roti",
    ingredients: ["2 bunches spinach", "250g paneer", "1 onion", "Cream", "Green chili", "Whole wheat atta"],
    prepTonight: ["Wash and blanch spinach 2 min, ice bath, refrigerate", "Cube paneer"],
    recipe: "Blend blanched spinach with green chili. Sauté onion + ginger-garlic, add spinach purée, simmer 10 min, add paneer + cream. Serve with hot roti.",
  },
  {
    name: "Chicken Curry & Jeera Rice",
    ingredients: ["500g chicken", "2 onions", "3 tomatoes", "Yogurt", "Whole spices", "Basmati rice"],
    prepTonight: ["Marinate chicken with yogurt, salt, turmeric, red chili"],
    recipe: "Brown onions in oil 15 min. Add ginger-garlic, tomatoes, spices. Add chicken, cook covered 25 min. Finish with garam masala & coriander.",
  },
  {
    name: "Dal Tadka + Rice",
    ingredients: ["1 cup toor dal", "1 tomato", "Garlic", "Cumin, mustard seeds, hing", "Ghee"],
    prepTonight: ["Pick and rinse dal, soak 30 min before bed"],
    recipe: "Pressure cook dal with turmeric, salt, chopped tomato — 3 whistles. Tadka: hot ghee + cumin + garlic + red chili + hing. Pour over dal.",
  },
  {
    name: "Aloo Gobi with Paratha",
    ingredients: ["2 potatoes", "1 cauliflower", "1 tomato", "Ginger", "Cumin, turmeric, coriander powder", "Atta"],
    prepTonight: ["Cut cauliflower florets and potato cubes, refrigerate"],
    recipe: "Heat oil, cumin, ginger. Add potatoes, cook 8 min. Add cauliflower and spices, cover 15 min. Finish with fresh coriander.",
  },
  {
    name: "Chole Bhature",
    ingredients: ["1 cup chickpeas", "1 onion", "2 tomatoes", "Chole masala", "Maida for bhature"],
    prepTonight: ["Soak chickpeas overnight", "Make bhature dough with yogurt + baking soda, rest overnight"],
    recipe: "Pressure cook chickpeas with tea bag for color. Sauté onion + tomato + chole masala, add chickpeas, simmer 20 min. Roll bhature and deep fry.",
  },
  {
    name: "Vegetable Khichdi + Kadhi",
    ingredients: ["1/2 cup rice", "1/2 cup moong dal", "Mixed veg", "Yogurt", "Besan", "Curry leaves"],
    prepTonight: ["Chop vegetables, refrigerate"],
    recipe: "Pressure cook rice, dal, veg with turmeric — 3 whistles. Kadhi: whisk yogurt + besan + water, simmer, temper with curry leaves + mustard.",
  },
];

export const BREAKFAST_ROTATION = [
  "Poha with peanuts & lemon",
  "Vegetable upma",
  "Besan cheela with mint chutney",
  "Aloo paratha with curd",
  "Idli sambar",
  "Masala oats",
  "Sooji uttapam",
];

export const LUNCH_ROTATION = [
  "Chapati + mixed veg sabzi + dal + curd",
  "Vegetable pulao + raita",
  "Rajma + rice + salad",
  "Paneer bhurji + roti + salad",
  "Curd rice + pickle + papad",
  "Sambar rice + poriyal",
  "Dal khichdi + ghee + papad",
];

export const HYDRATION_TARGET_ML = 3000;
export const HOT_DAY_TEMP_C = 30;

export const WEATHER_LOCATION = {
  name: "Delhi",
  latitude: 28.6139,
  longitude: 77.209,
};

export const NUTRITION_TARGETS = {
  calories: 2400,
  protein_g: 160,
  carbs_g: 260,
  fat_g: 75,
};

export const PROGRAM_START_DATE = "2026-07-13";

export const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function todayLocal(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function dayIndexOf(date: Date): number {
  return (date.getDay() + 6) % 7;
}

export function getWeekNumber(date: Date): number {
  const start = new Date(PROGRAM_START_DATE + "T00:00:00");
  const diff = Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, Math.floor(diff / 7) + 1);
}

export function formatLongDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function getMealsForDate(date: Date) {
  const day = dayIndexOf(date);
  return {
    breakfast: BREAKFAST_ROTATION[day],
    lunch: LUNCH_ROTATION[day],
    dinner: DINNER_ROTATION[day],
  };
}
