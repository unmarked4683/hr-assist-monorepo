-- CreateTable
CREATE TABLE "DayOff" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "name" TEXT NOT NULL,
    "type_code" SMALLINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DayOff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DayOff_date_key" ON "DayOff"("date");

-- CreateIndex
CREATE INDEX "DayOff_date_idx" ON "DayOff"("date");

-- AddCheckConstraint
ALTER TABLE "DayOff" ADD CONSTRAINT "type_code_range" CHECK ("type_code" >= 0 AND "type_code" <= 255);

-- AddColumnComment
COMMENT ON COLUMN "DayOff"."type_code" IS '0: Statutory, 1: Company_Gift';
