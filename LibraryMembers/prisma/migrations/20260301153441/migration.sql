-- CreateTable
CREATE TABLE "LibraryMember" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "member_id" TEXT NOT NULL,

    CONSTRAINT "LibraryMember_pkey" PRIMARY KEY ("id")
);
