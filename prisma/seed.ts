// Idempotent seed for Carta Digital Tauras. Run with the database env loaded,
// e.g. `set -a; source .env.local; set +a; pnpm db:seed`.
//
// It seeds one admin (from ADMIN_EMAIL + ADMIN_PASSWORD_HASH — never a plaintext
// password), the three real Tauras brands with their real WhatsApp numbers, a
// sample of categories, dishes/cocktails with variants and feature badges, and a
// couple of promotions. Upserts keep re-runs safe.

import { getDb } from "../src/lib/db";

const db = getDb();

interface SeedVariant {
  labelEs: string;
  labelEn?: string;
  price: number;
}

interface SeedItem {
  slug: string;
  nameEs: string;
  nameEn?: string;
  descEs?: string;
  descEn?: string;
  price?: number;
  available?: boolean;
  features?: ("premium_meat" | "cocktail" | "recommended")[];
  variants?: SeedVariant[];
}

interface SeedCategory {
  slug: string;
  nameEs: string;
  nameEn?: string;
  items: SeedItem[];
}

interface SeedBrand {
  slug: string;
  name: string;
  tagline: string;
  whatsappPhone: string;
  address: string;
  categories: SeedCategory[];
}

const BRANDS: SeedBrand[] = [
  {
    slug: "steakhouse",
    name: "TAURAS Steakhouse",
    tagline: "Parrilla premium y cortes importados",
    whatsappPhone: "573135398147",
    address: "El Poblado, Medellín",
    categories: [
      {
        slug: "parrilla",
        nameEs: "Parrilla importada",
        nameEn: "Imported grill",
        items: [
          {
            slug: "brisket",
            nameEs: "Brisket",
            descEs:
              "Swift Black Angus certificado, ahumado más de 12 horas, con papa y aros de cebolla.",
            available: true,
            features: ["premium_meat", "recommended"],
            variants: [
              { labelEs: "225 g", price: 95000 },
              { labelEs: "450 g", price: 163000 },
            ],
          },
          {
            slug: "rib-eye",
            nameEs: "Rib Eye 400 g",
            descEs:
              "Corte Swift Black Angus de alto marmoleo, con chimichurri de la casa.",
            price: 206000,
            available: true,
            features: ["premium_meat", "recommended"],
          },
        ],
      },
      {
        slug: "colombiano",
        nameEs: "Cocina colombiana",
        nameEn: "Colombian kitchen",
        items: [
          {
            slug: "bandeja-paisa",
            nameEs: "Bandeja Paisa",
            descEs:
              "Arroz, chicharrón, chorizo, aguacate, arepa, maduro y huevo frito.",
            price: 59000,
            available: true,
            features: ["recommended"],
          },
        ],
      },
    ],
  },
  {
    slug: "bar-lounge",
    name: "TAURAS Bar & Lounge",
    tagline: "Coctelería de autor",
    whatsappPhone: "573135398147",
    address: "El Poblado (piso 2), Medellín",
    categories: [
      {
        slug: "autor",
        nameEs: "Cócteles de autor",
        nameEn: "Signature cocktails",
        items: [
          {
            slug: "tauras",
            nameEs: "Tauras",
            descEs:
              "Whisky Chivas 12, fat wash en mantequilla e infusión de almendra tostada.",
            price: 53000,
            available: true,
            features: ["cocktail", "recommended"],
          },
          {
            slug: "crazy-horse",
            nameEs: "Crazy Horse",
            descEs: "Mezcal Ojo de Tigre, miel de rocoto y limón fresco.",
            price: 53000,
            available: true,
            features: ["cocktail"],
          },
        ],
      },
    ],
  },
  {
    slug: "tex-mex",
    name: "TAURAS Tex Mex",
    tagline: "Tacos, burgers y margaritas",
    whatsappPhone: "573117050330",
    address: "Las Palmas, Mall Indiana, Medellín",
    categories: [
      {
        slug: "tacos",
        nameEs: "Tacos",
        nameEn: "Tacos",
        items: [
          {
            slug: "tacos-brisket",
            nameEs: "Tacos Brisket x3",
            descEs:
              "Tortilla de maíz, brisket ahumado, pico de gallo, sour cream y guacamole.",
            price: 32000,
            available: true,
            features: ["recommended"],
          },
        ],
      },
    ],
  },
];

interface SeedPromotion {
  brandSlug: string;
  titleEs: string;
  descEs: string;
  price?: number;
}

const PROMOTIONS: SeedPromotion[] = [
  {
    brandSlug: "steakhouse",
    titleEs: "Martes de parrilla",
    descEs: "20% en cortes premium seleccionados, solo los martes.",
  },
  {
    brandSlug: "bar-lounge",
    titleEs: "Happy hour 2x1",
    descEs: "2x1 en cócteles de autor de 5 a 7 pm.",
  },
];

async function seedAdmin(): Promise<void> {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!email || !passwordHash) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD_HASH must be set to seed the admin.",
    );
  }

  // On update, only refresh the password hash. Never touch isActive here: a
  // deactivated/revoked admin must stay revoked, not be silently re-enabled by
  // a re-seed.
  await db.admin.upsert({
    where: { email },
    update: { passwordHash },
    create: {
      email,
      passwordHash,
      name: "Tauras Admin",
      role: "SUPER_ADMIN",
    },
  });
  console.log(`Seeded admin ${email}`);
}

async function seedCatalog(): Promise<void> {
  for (const [brandIndex, brand] of BRANDS.entries()) {
    const brandRow = await db.brand.upsert({
      where: { slug: brand.slug },
      update: {
        name: brand.name,
        tagline: brand.tagline,
        whatsappPhone: brand.whatsappPhone,
        address: brand.address,
        isActive: true,
        sortOrder: brandIndex,
      },
      create: {
        slug: brand.slug,
        name: brand.name,
        tagline: brand.tagline,
        whatsappPhone: brand.whatsappPhone,
        address: brand.address,
        sortOrder: brandIndex,
      },
    });

    for (const [categoryIndex, category] of brand.categories.entries()) {
      const categoryRow = await db.category.upsert({
        where: {
          brandId_slug: { brandId: brandRow.id, slug: category.slug },
        },
        update: {
          nameEs: category.nameEs,
          nameEn: category.nameEn ?? null,
          sortOrder: categoryIndex,
        },
        create: {
          brandId: brandRow.id,
          slug: category.slug,
          nameEs: category.nameEs,
          nameEn: category.nameEn ?? null,
          sortOrder: categoryIndex,
        },
      });

      for (const [itemIndex, item] of category.items.entries()) {
        // MenuItem has no natural unique key, so match on (category, slugish
        // nameEs) by clearing and recreating this category's items per run.
        const existing = await db.menuItem.findFirst({
          where: { categoryId: categoryRow.id, nameEs: item.nameEs },
        });
        if (existing) {
          await db.menuItemVariant.deleteMany({ where: { itemId: existing.id } });
          await db.menuItem.delete({ where: { id: existing.id } });
        }

        await db.menuItem.create({
          data: {
            categoryId: categoryRow.id,
            nameEs: item.nameEs,
            nameEn: item.nameEn ?? null,
            descEs: item.descEs ?? null,
            descEn: item.descEn ?? null,
            price: item.price ?? null,
            available: item.available ?? true,
            features: item.features ?? [],
            sortOrder: itemIndex,
            variants: item.variants
              ? {
                  create: item.variants.map((variant, variantIndex) => ({
                    labelEs: variant.labelEs,
                    labelEn: variant.labelEn ?? null,
                    price: variant.price,
                    sortOrder: variantIndex,
                  })),
                }
              : undefined,
          },
        });
      }
    }
    console.log(`Seeded brand ${brand.name}`);
  }

  for (const [index, promo] of PROMOTIONS.entries()) {
    const brandRow = await db.brand.findUnique({
      where: { slug: promo.brandSlug },
    });
    if (!brandRow) continue;

    const existing = await db.promotion.findFirst({
      where: { brandId: brandRow.id, titleEs: promo.titleEs },
    });
    if (existing) {
      await db.promotion.update({
        where: { id: existing.id },
        data: { descEs: promo.descEs, price: promo.price ?? null, sortOrder: index },
      });
    } else {
      await db.promotion.create({
        data: {
          brandId: brandRow.id,
          titleEs: promo.titleEs,
          descEs: promo.descEs,
          price: promo.price ?? null,
          sortOrder: index,
        },
      });
    }
  }
  console.log(`Seeded ${PROMOTIONS.length} promotions`);
}

async function main(): Promise<void> {
  await seedAdmin();
  await seedCatalog();
}

main()
  .then(() => {
    console.log("Seed complete.");
  })
  .catch((error: unknown) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  });
