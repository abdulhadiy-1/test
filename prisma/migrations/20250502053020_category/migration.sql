/*
  Warnings:

  - You are about to drop the column `colors` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `typeId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `Type` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_typeId_fkey";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "type" "Types" NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "colors",
DROP COLUMN "typeId",
ADD COLUMN     "type" "Types" NOT NULL;

-- DropTable
DROP TABLE "Type";

-- CreateTable
CREATE TABLE "_prdColor" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_prdColor_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_prdColor_B_index" ON "_prdColor"("B");

-- AddForeignKey
ALTER TABLE "_prdColor" ADD CONSTRAINT "_prdColor_A_fkey" FOREIGN KEY ("A") REFERENCES "Color"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_prdColor" ADD CONSTRAINT "_prdColor_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
