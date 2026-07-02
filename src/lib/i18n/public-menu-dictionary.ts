import type { Language, MenuFeatureKind } from "@/lib/menu/types";

/** Copy used to compose the WhatsApp order hand-off message. */
export interface WhatsAppCopy {
  greeting: string;
  orderTitle: string;
  notesLabel: string;
  totalLabel: string;
  disclaimer: string;
}

/** All user-facing UI copy for the public menu, per language. */
export interface PublicMenuCopy {
  /** Human label of this language, shown on the switch. */
  languageName: string;
  /** Label that switches to the other language. */
  switchLabel: string;
  /** Short appetite-driving line under the location name in the hero. */
  heroTagline: string;
  featuredTitle: Record<MenuFeatureKind, string>;
  badge: Record<MenuFeatureKind, string>;
  unavailable: string;
  addToCart: string;
  emptyMenu: string;
  cartTitle: string;
  cartEmpty: string;
  totalLabel: string;
  sendWhatsApp: string;
  whatsapp: WhatsAppCopy;
}

export const publicMenuDictionary: Record<Language, PublicMenuCopy> = {
  es: {
    languageName: "Español",
    switchLabel: "English",
    heroTagline: "Parrilla premium, cócteles de autor y brasas al punto.",
    featuredTitle: {
      premium_meat: "Carnes premium",
      cocktail: "Cócteles de autor",
      recommended: "Recomendados",
    },
    badge: {
      premium_meat: "Premium",
      cocktail: "Cóctel",
      recommended: "Recomendado",
    },
    unavailable: "No disponible",
    addToCart: "Agregar",
    emptyMenu: "Pronto publicaremos el menú de esta sede.",
    cartTitle: "Tu pedido",
    cartEmpty: "Tu pedido está vacío.",
    totalLabel: "Total estimado",
    sendWhatsApp: "Enviar pedido por WhatsApp",
    whatsapp: {
      greeting: "Hola, quiero hacer un pedido en",
      orderTitle: "Pedido",
      notesLabel: "Notas",
      totalLabel: "Total estimado",
      disclaimer:
        "Este pedido es una estimación y debe confirmarse con el restaurante.",
    },
  },
  en: {
    languageName: "English",
    switchLabel: "Español",
    heroTagline: "Premium grill, signature cocktails, fire-kissed cuts.",
    featuredTitle: {
      premium_meat: "Premium cuts",
      cocktail: "Signature cocktails",
      recommended: "Recommended",
    },
    badge: {
      premium_meat: "Premium",
      cocktail: "Cocktail",
      recommended: "Recommended",
    },
    unavailable: "Unavailable",
    addToCart: "Add",
    emptyMenu: "This location's menu is coming soon.",
    cartTitle: "Your order",
    cartEmpty: "Your order is empty.",
    totalLabel: "Estimated total",
    sendWhatsApp: "Send order via WhatsApp",
    whatsapp: {
      greeting: "Hi, I'd like to place an order at",
      orderTitle: "Order",
      notesLabel: "Notes",
      totalLabel: "Estimated total",
      disclaimer:
        "This order is an estimate and must be confirmed with the restaurant.",
    },
  },
};
