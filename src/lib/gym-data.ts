// Business details for The Workout Zone Gym, Fatehpur (from the Google Maps listing).

export const GYM = {
  name: "The Workout Zone",
  legalName: "The Workout Zone Gym",
  contactName: "Sharib",
  phone: "89609 35036",
  phoneHref: "tel:+918960935036",
  whatsappUrl: "https://wa.me/918960935036",
  tagline: "Fatehpur's friendliest strength & cardio floor",
  addressLine: "Khaleel Nagar, Awas Vikas",
  city: "Fatehpur",
  region: "Uttar Pradesh",
  postalCode: "212601",
  country: "IN",
  fullAddress: "Khaleel Nagar, Awas Vikas, Fatehpur, Uttar Pradesh 212601, India",
  rating: 4.9,
  reviewCount: 29,
  latitude: 25.9304,
  longitude: 80.8003,
  mapsUrl: "https://maps.app.goo.gl/rJdHN5CQNkKtLjZd8",
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=" +
    encodeURIComponent("The Workout zone gym, Khaleel Nagar, Awas Vikas, Fatehpur, Uttar Pradesh 212601"),
  mapsEmbedUrl:
    "https://www.google.com/maps?q=" +
    encodeURIComponent("The Workout zone gym, Khaleel Nagar, Awas Vikas, Fatehpur, Uttar Pradesh 212601") +
    "&output=embed",
  landmark: "≈3 km from Bhitaura railway station",
} as const;

export const GYM_HOURS: Array<{ day: string; hours: string; closed?: boolean }> = [
  { day: "Monday", hours: "5:00 AM – 10:00 PM" },
  { day: "Tuesday", hours: "5:00 AM – 10:00 PM" },
  { day: "Wednesday", hours: "5:00 AM – 10:00 PM" },
  { day: "Thursday", hours: "5:00 AM – 10:00 PM" },
  { day: "Friday", hours: "5:00 AM – 10:00 PM" },
  { day: "Saturday", hours: "5:00 AM – 10:00 PM" },
  { day: "Sunday", hours: "Closed", closed: true },
];

export const FACILITIES = [
  {
    title: "Free weights",
    body: "Full dumbbell racks, Olympic barbells, benches and squat racks — everything you need for a real strength block.",
  },
  {
    title: "Cardio floor",
    body: "Treadmills, cycles and cross trainers with space to warm up properly before you lift.",
  },
  {
    title: "Machines & cables",
    body: "Lat pulldown, leg press, leg curl/extension, cable stations and a full pin-loaded circuit.",
  },
  {
    title: "Coaching on the floor",
    body: "Supportive, polite trainers who correct your form instead of leaving you to guess.",
  },
  {
    title: "Airy, well-kept space",
    body: "Bright, ventilated hall that stays comfortable through Fatehpur summers.",
  },
  {
    title: "Honest pricing",
    body: "Affordable monthly membership — same equipment, less money than the alternatives.",
  },
];

export const REVIEWS = [
  {
    name: "Mohd Miraan",
    text: "The best gym in Fatehpur — it has just about every machine for cardio and weight lifting, at an affordable fee. Trainers are very supportive and polite. Literally 5 star.",
  },
  {
    name: "Anupam Pandey",
    text: "Amazing and very friendly gym. The monthly fee was great too — you won't regret joining.",
  },
  {
    name: "Yassop",
    text: "Amazing deal for what they give us. Other gyms charge more for the same equipment and area — I prefer this one.",
  },
];

export const PLANS = [
  { name: "Monthly", note: "Full access · pay as you go", highlight: false },
  { name: "Quarterly", note: "3 months · best for a training block", highlight: true },
  { name: "Yearly", note: "Lowest per-month rate", highlight: false },
];
