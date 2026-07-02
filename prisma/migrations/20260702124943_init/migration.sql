-- CreateEnum
CREATE TYPE "MenuFeatureKind" AS ENUM ('premium_meat', 'cocktail', 'recommended');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'MENU_EDITOR');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'MENU_EDITOR',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sessionVersion" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoginAttempt" (
    "id" TEXT NOT NULL,
    "emailKey" TEXT NOT NULL,
    "ipKey" TEXT,
    "success" BOOLEAN NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoginAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tagline" TEXT,
    "whatsappPhone" TEXT NOT NULL,
    "address" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameEs" TEXT NOT NULL,
    "nameEn" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuItem" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "nameEs" TEXT NOT NULL,
    "nameEn" TEXT,
    "descEs" TEXT,
    "descEn" TEXT,
    "price" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'COP',
    "available" BOOLEAN NOT NULL DEFAULT true,
    "imageUrl" TEXT,
    "features" "MenuFeatureKind"[],
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuItemVariant" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "labelEs" TEXT NOT NULL,
    "labelEn" TEXT,
    "price" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "MenuItemVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuItemImage" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MenuItemImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Promotion" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "titleEs" TEXT NOT NULL,
    "titleEn" TEXT,
    "descEs" TEXT,
    "descEn" TEXT,
    "imageUrl" TEXT,
    "price" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE INDEX "LoginAttempt_emailKey_createdAt_idx" ON "LoginAttempt"("emailKey", "createdAt");

-- CreateIndex
CREATE INDEX "LoginAttempt_ipKey_createdAt_idx" ON "LoginAttempt"("ipKey", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_slug_key" ON "Brand"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Category_brandId_slug_key" ON "Category"("brandId", "slug");

-- CreateIndex
CREATE INDEX "MenuItem_categoryId_sortOrder_idx" ON "MenuItem"("categoryId", "sortOrder");

-- CreateIndex
CREATE INDEX "MenuItemVariant_itemId_sortOrder_idx" ON "MenuItemVariant"("itemId", "sortOrder");

-- CreateIndex
CREATE INDEX "MenuItemImage_itemId_sortOrder_idx" ON "MenuItemImage"("itemId", "sortOrder");

-- CreateIndex
CREATE INDEX "Promotion_brandId_active_idx" ON "Promotion"("brandId", "active");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItemVariant" ADD CONSTRAINT "MenuItemVariant_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "MenuItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItemImage" ADD CONSTRAINT "MenuItemImage_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "MenuItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Promotion" ADD CONSTRAINT "Promotion_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;
