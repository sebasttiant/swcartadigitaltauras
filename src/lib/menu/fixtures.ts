import type { MenuLocation } from "@/lib/menu/types";

/**
 * Curated Tauras menu content by brand, transcribed from Carta-2025.
 *
 * This is a premium showcase (featured/iconic items per brand), not the full
 * 90-item printed carta. It is the temporary data source until a Prisma/Postgres
 * catalog is introduced; that catalog must satisfy this same DTO contract.
 *
 * NOTE: whatsappPhone values are placeholders pending the real per-brand
 * numbers. Prices are in whole COP.
 */
export const TAURAS_LOCATIONS: MenuLocation[] = [
  {
    id: "steakhouse",
    name: { es: "Tauras Steakhouse", en: "Tauras Steakhouse" },
    whatsappPhone: "573001112233",
    available: true,
    categories: [
      {
        id: "parrilla",
        name: { es: "Parrilla importada", en: "Imported grill" },
        items: [
          {
            id: "brisket",
            name: { es: "Brisket", en: "Brisket" },
            description: {
              es: "Swift Black Angus certificado, ahumado más de 12 horas, con papa y aros de cebolla.",
              en: "Certified Swift Black Angus, smoked over 12 hours, with potato and onion rings.",
            },
            price: null,
            currency: "COP",
            available: true,
            features: ["premium_meat", "recommended"],
            variants: [
              { id: "225g", label: { es: "225 g", en: "225 g" }, price: 95000 },
              { id: "450g", label: { es: "450 g", en: "450 g" }, price: 163000 },
            ],
          },
          {
            id: "rib-eye",
            name: { es: "Rib Eye 400 g", en: "Ribeye 400 g" },
            description: {
              es: "Corte Swift Black Angus de alto marmoleo, textura suave y sabor intenso, con chimichurri de la casa.",
              en: "High-marbled Swift Black Angus cut, tender and intense, with house chimichurri.",
            },
            price: 206000,
            currency: "COP",
            available: true,
            features: ["premium_meat", "recommended"],
          },
          {
            id: "picanha",
            name: { es: "Picanha 350 g", en: "Picanha 350 g" },
            description: {
              es: "Swift Black Angus con capa de grasa natural que potencia su sabor, con ensalada y chimichurri.",
              en: "Swift Black Angus with a natural fat cap that boosts flavor, with salad and chimichurri.",
            },
            price: 169000,
            currency: "COP",
            available: true,
            features: ["premium_meat"],
          },
          {
            id: "entrana",
            name: { es: "Entraña 350 g", en: "Skirt steak 350 g" },
            description: {
              es: "Corte delgado, jugoso y de fibra delicada. Agotado por hoy.",
              en: "Thin, juicy cut with a delicate grain. Sold out for today.",
            },
            price: 183000,
            currency: "COP",
            available: false,
            features: ["premium_meat"],
          },
        ],
      },
      {
        id: "entradas",
        name: { es: "Entradas", en: "Starters" },
        items: [
          {
            id: "chorizo-ahumado",
            name: { es: "Chorizo Ahumado", en: "Smoked Chorizo" },
            description: {
              es: "Chorizo premium antioqueño ahumado, con chimichurri de la casa y papa rústica.",
              en: "Smoked premium Antioquian chorizo, with house chimichurri and rustic potato.",
            },
            price: 29000,
            currency: "COP",
            available: true,
          },
          {
            id: "tartar-salmon",
            name: { es: "Tartar de Salmón Ahumado", en: "Smoked Salmon Tartare" },
            description: {
              es: "Salmón ahumado con soya y aguacate, equilibrio perfecto, con tostadas de masa madre.",
              en: "Smoked salmon with soy and avocado, perfectly balanced, with sourdough toast.",
            },
            price: 41000,
            currency: "COP",
            available: true,
            features: ["recommended"],
          },
        ],
      },
      {
        id: "platos-fuertes",
        name: { es: "Platos fuertes", en: "Main dishes" },
        items: [
          {
            id: "asado-de-tira",
            name: { es: "Asado de Tira 300 g", en: "Short Rib 300 g" },
            description: {
              es: "Costilla marinada y cocida a fuego lento 8 horas, sobre puré suave y demi-glace.",
              en: "Rib marinated and slow-cooked for 8 hours, over soft purée and demi-glace.",
            },
            price: 82000,
            currency: "COP",
            available: true,
            features: ["recommended"],
          },
          {
            id: "filete-salmon",
            name: { es: "Filete de Salmón", en: "Salmon Fillet" },
            description: {
              es: "Salmón a la parrilla sobre puré de papa suave y vegetales salteados.",
              en: "Grilled salmon over soft mashed potato and sautéed vegetables.",
            },
            price: 76000,
            currency: "COP",
            available: true,
          },
        ],
      },
      {
        id: "colombiano",
        name: { es: "Cocina colombiana", en: "Colombian kitchen" },
        items: [
          {
            id: "bandeja-paisa",
            name: { es: "Bandeja Paisa", en: "Bandeja Paisa" },
            description: {
              es: "Plato típico antioqueño: arroz, chicharrón, chorizo, aguacate, arepa, maduro y huevo frito.",
              en: "Typical Antioquian dish: rice, chicharrón, chorizo, avocado, arepa, plantain and fried egg.",
            },
            price: 59000,
            currency: "COP",
            available: true,
            features: ["recommended"],
          },
          {
            id: "ajiaco",
            name: { es: "Ajiaco", en: "Ajiaco" },
            description: {
              es: "Sopa típica bogotana de papas y pollo, con arroz, aguacate, crema y alcaparras.",
              en: "Typical Bogotá soup of potatoes and chicken, with rice, avocado, cream and capers.",
            },
            price: 45000,
            currency: "COP",
            available: true,
          },
        ],
      },
    ],
  },
  {
    id: "bar-lounge",
    name: { es: "Tauras Bar & Lounge", en: "Tauras Bar & Lounge" },
    whatsappPhone: "573001112233",
    available: true,
    categories: [
      {
        id: "autor",
        name: { es: "Cócteles de autor", en: "Signature cocktails" },
        items: [
          {
            id: "tauras",
            name: { es: "Tauras", en: "Tauras" },
            description: {
              es: "Whisky Chivas 12, fat wash en mantequilla e infusión de almendra tostada, con licor de ciruela.",
              en: "Chivas 12 whisky, butter fat-wash and toasted-almond infusion, with plum liqueur.",
            },
            price: 53000,
            currency: "COP",
            available: true,
            features: ["cocktail", "recommended"],
          },
          {
            id: "crazy-horse",
            name: { es: "Crazy Horse", en: "Crazy Horse" },
            description: {
              es: "Mezcal Ojo de Tigre, miel de rocoto y limón fresco, con manzana deshidratada.",
              en: "Tiger's Eye mezcal, rocoto honey and fresh lemon, with dehydrated apple.",
            },
            price: 53000,
            currency: "COP",
            available: true,
            features: ["cocktail"],
          },
          {
            id: "rosa-sagrada",
            name: { es: "Rosa Sagrada", en: "Rosa Sagrada" },
            description: {
              es: "Vodka Absolut, óleo de uchuva, feijoa y limón, con notas de palo santo.",
              en: "Absolut vodka, cape gooseberry oil, feijoa and lemon, with palo santo notes.",
            },
            price: 53000,
            currency: "COP",
            available: true,
            features: ["cocktail"],
          },
          {
            id: "noche-de-encanto",
            name: { es: "Noche de Encanto", en: "Noche de Encanto" },
            description: {
              es: "Chivas 12 infusionado con jengibre y marshmallow, con espuma de lulo y marshmallow flameado.",
              en: "Chivas 12 infused with ginger and marshmallow, with lulo foam and a flamed marshmallow.",
            },
            price: 53000,
            currency: "COP",
            available: true,
            features: ["cocktail", "recommended"],
          },
        ],
      },
      {
        id: "clasicos",
        name: { es: "Cócteles clásicos", en: "Classic cocktails" },
        items: [
          {
            id: "negroni",
            name: { es: "Negroni", en: "Negroni" },
            description: {
              es: "Ginebra Beefeater London Dry, Campari y vermut rojo.",
              en: "Beefeater London Dry gin, Campari and sweet vermouth.",
            },
            price: 47000,
            currency: "COP",
            available: true,
            features: ["cocktail"],
          },
          {
            id: "old-fashioned",
            name: { es: "Old Fashioned", en: "Old Fashioned" },
            description: {
              es: "Whisky Chivas 12, gotas amargas y azúcar.",
              en: "Chivas 12 whisky, bitters and sugar.",
            },
            price: 46000,
            currency: "COP",
            available: true,
            features: ["cocktail"],
          },
          {
            id: "espresso-martini",
            name: { es: "Espresso Martini", en: "Espresso Martini" },
            description: {
              es: "Vodka Absolut, espresso y almíbar simple.",
              en: "Absolut vodka, espresso and simple syrup.",
            },
            price: 46000,
            currency: "COP",
            available: true,
            features: ["cocktail"],
          },
        ],
      },
    ],
  },
  {
    id: "tex-mex",
    name: { es: "Tauras Tex Mex", en: "Tauras Tex Mex" },
    whatsappPhone: "573001112233",
    available: true,
    categories: [
      {
        id: "tacos",
        name: { es: "Tacos", en: "Tacos" },
        items: [
          {
            id: "tacos-brisket",
            name: { es: "Tacos Brisket x3", en: "Brisket Tacos x3" },
            description: {
              es: "Tortilla de maíz, brisket ahumado, pico de gallo, sour cream y guacamole.",
              en: "Corn tortilla, smoked brisket, pico de gallo, sour cream and guacamole.",
            },
            price: 32000,
            currency: "COP",
            available: true,
            features: ["recommended"],
          },
          {
            id: "tacos-pulled-pork",
            name: { es: "Tacos Pulled Pork x3", en: "Pulled Pork Tacos x3" },
            description: {
              es: "Tortilla de maíz, pulled pork, pico de gallo, sour cream y guacamole.",
              en: "Corn tortilla, pulled pork, pico de gallo, sour cream and guacamole.",
            },
            price: 32000,
            currency: "COP",
            available: true,
          },
          {
            id: "taquiza-mex",
            name: { es: "Taquiza Tauras Mex x9", en: "Taquiza Tauras Mex x9" },
            description: {
              es: "Brisket, pollo ahumado y pulled pork, con pico de gallo, sour cream y guacamole.",
              en: "Brisket, smoked chicken and pulled pork, with pico de gallo, sour cream and guacamole.",
            },
            price: 89000,
            currency: "COP",
            available: true,
            features: ["recommended"],
          },
        ],
      },
      {
        id: "burgers",
        name: { es: "Burgers & sandwiches", en: "Burgers & sandwiches" },
        items: [
          {
            id: "cheese-burger",
            name: { es: "Cheese", en: "Cheese" },
            description: {
              es: "180 g de carne artesanal, pan brioche, queso americano, tocineta, tomate, pepinillos y cebolla.",
              en: "180 g artisanal beef, brioche bun, American cheese, bacon, tomato, pickles and onion.",
            },
            price: 51000,
            currency: "COP",
            available: true,
          },
          {
            id: "la-crujiente",
            name: { es: "La Crujiente", en: "La Crujiente" },
            description: {
              es: "Pechuga crocante rellena de queso, aros de cebolla y mermelada de pimentones, en pan brioche.",
              en: "Crispy cheese-stuffed chicken, onion rings and pepper jam, on a brioche bun.",
            },
            price: 49000,
            currency: "COP",
            available: true,
            features: ["recommended"],
          },
        ],
      },
      {
        id: "margaritas",
        name: { es: "Margaritas", en: "Margaritas" },
        items: [
          {
            id: "margarita-clasica",
            name: { es: "Margarita Clásica", en: "Classic Margarita" },
            description: {
              es: "90 ml de tequila Olmeca Silver, zumo de limón y almíbar simple.",
              en: "90 ml Olmeca Silver tequila, lemon juice and simple syrup.",
            },
            price: 55000,
            currency: "COP",
            available: true,
            features: ["cocktail"],
          },
          {
            id: "margarita-tamarindo",
            name: { es: "Margarita de Tamarindo", en: "Tamarind Margarita" },
            description: {
              es: "90 ml de tequila Olmeca Silver, zumo de limón y almíbar de tamarindo.",
              en: "90 ml Olmeca Silver tequila, lemon juice and tamarind syrup.",
            },
            price: 55000,
            currency: "COP",
            available: true,
            features: ["cocktail"],
          },
        ],
      },
    ],
  },
];

export function findLocation(id: string): MenuLocation | undefined {
  return TAURAS_LOCATIONS.find((location) => location.id === id);
}

export const DEFAULT_LOCATION_ID = "steakhouse";
