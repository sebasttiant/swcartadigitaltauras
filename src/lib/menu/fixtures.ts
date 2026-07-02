import type { MenuLocation } from "@/lib/menu/types";

/**
 * Initial fixture content for Tauras. This is the temporary data source until a
 * Prisma/Postgres catalog is introduced; it must satisfy the same DTO contract.
 */
export const TAURAS_LOCATIONS: MenuLocation[] = [
  {
    id: "poblado",
    name: { es: "Tauras El Poblado", en: "Tauras El Poblado" },
    whatsappPhone: "573001112233",
    available: true,
    categories: [
      {
        id: "carnes",
        name: { es: "Carnes", en: "Steaks" },
        items: [
          {
            id: "bife-de-chorizo",
            name: { es: "Bife de Chorizo", en: "Sirloin Steak" },
            description: {
              es: "Corte premium madurado, a la parrilla.",
              en: "Dry-aged premium cut, grilled over coals.",
            },
            price: null,
            currency: "COP",
            available: true,
            features: ["premium_meat", "recommended"],
            variants: [
              { id: "300g", label: { es: "300 g", en: "300 g" }, price: 62000 },
              { id: "500g", label: { es: "500 g", en: "500 g" }, price: 92000 },
            ],
            options: [
              {
                id: "chimichurri",
                label: { es: "Chimichurri extra", en: "Extra chimichurri" },
                priceDelta: 4000,
              },
            ],
          },
          {
            id: "ojo-de-bife",
            name: { es: "Ojo de Bife", en: "Ribeye" },
            description: {
              es: "Marmoleo intenso, sellado al punto.",
              en: "Rich marbling, seared to your point.",
            },
            price: 78000,
            currency: "COP",
            available: true,
            features: ["premium_meat"],
          },
          {
            id: "tomahawk",
            name: { es: "Tomahawk", en: "Tomahawk" },
            description: {
              es: "Corte para compartir. Agotado por hoy.",
              en: "Sharing cut. Sold out for today.",
            },
            price: 180000,
            currency: "COP",
            available: false,
            features: ["premium_meat"],
          },
        ],
      },
      {
        id: "cocteles",
        name: { es: "Cócteles", en: "Cocktails" },
        items: [
          {
            id: "negroni",
            name: { es: "Negroni", en: "Negroni" },
            description: {
              es: "Gin, Campari y vermut rojo.",
              en: "Gin, Campari and sweet vermouth.",
            },
            price: 28000,
            currency: "COP",
            available: true,
            features: ["cocktail", "recommended"],
          },
          {
            id: "gin-tonic",
            name: { es: "Gin Tonic de la casa", en: "House Gin & Tonic" },
            price: 26000,
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

export const DEFAULT_LOCATION_ID = "poblado";
