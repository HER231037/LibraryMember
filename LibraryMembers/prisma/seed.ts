import { PrismaClient } from "../generated/client.ts";

const prisma = new PrismaClient();

const LibraryMember = [
  { id: -1,  name: "Anna Leitner",       member_id: "AL-203A" },
  { id: -2,  name: "Jonas Berger",       member_id: "JB-517C" },
  { id: -3,  name: "Mara Köstler",       member_id: "MK-441B" },
  { id: -4,  name: "Lukas Ehrenfeld",    member_id: "LE-389D" },
  { id: -5,  name: "Clara Mittermayr",   member_id: "CM-120F" },
  { id: -6,  name: "Samuel Hartwig",     member_id: "SH-775E" },
  { id: -7,  name: "Nina Stadler",       member_id: "NS-632P" },
  { id: -8,  name: "Felix Kramer",       member_id: "FK-908M" },
  { id: -9,  name: "Katrin Blocher",     member_id: "KB-254R" },
  { id: -10, name: "Dominik Herzog",     member_id: "DH-781Q" },
  { id: 1,  name: "Anna Müller",      member_id: "AM-203A" },
  { id: 2,  name: "Lukas Gruber",     member_id: "LG-517C" },
  { id: 3,  name: "Sophie Wagner",    member_id: "SW-441B" },
  { id: 4,  name: "Tobias Huber",     member_id: "TH-389D" },
  { id: 5,  name: "David Steiner",    member_id: "DS-120F" },
  { id: 6,  name: "Laura Bauer",      member_id: "LB-775E" },
  { id: 7,  name: "Michael Hofer",    member_id: "MH-632P" },
  { id: 8,  name: "Julia Moser",      member_id: "JM-908M" },
  { id: 9,  name: "Daniel Leitner",   member_id: "DL-254R" },
  { id: 10, name: "Sarah Pichler",    member_id: "SP-781Q" },
];


async function main() {
  console.log("Remove old testdata...");

  const result = await prisma.libraryMember.deleteMany({
    where: {
      id: { lt: 0 },
    },
  });
  console.log(`Deleted ${result.count} LibarayMembers with negative id`);

  console.log("Start seeding...");

  for (const member of LibraryMember) {
    await prisma.libraryMember.create({
      data: member,
    });
    console.log(`Created Librarymember with id: ${member.id}`);
  }

  console.log("Seeding finished.");
}

try {
    await main();
}
catch (e) {
    console.error(e);
    Deno.exit(1);
}
finally {
    await prisma.$disconnect();
}