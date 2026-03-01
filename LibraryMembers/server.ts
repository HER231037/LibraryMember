import express, { Request, Response } from "express";
import process from "node:process";
import { fromFileUrl } from "@std/path";
import { dirname } from "@std/path";
import path from "node:path";
import { PrismaClient } from "./generated/client.ts";
import accounts from "./accounts.json" with { type: "json" };
import session from "express-session";
import { authMiddleware } from "./auth.ts";

const __dirname = dirname(fromFileUrl(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

//cookie
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET ||
      "your-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    name: "cookie_gt",
    cookie: {
      maxAge: 5 * 60 * 1000, // 5 minutes
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    },
  }),
);

const prisma = new PrismaClient();

const LibraryMember = await prisma.LibraryMember.findMany();

app.get("/", (_req: Request, res: Response) => {
  return res.redirect("/index.html");
});

app.get("/LibraryMember", async (req: Request, res: Response) => {
  const LibraryMember = await prisma.LibraryMember.findMany();
  return res.json(LibraryMember);
});

app.get("/LibraryMember/:id", async (req: Request, res: Response) => {

  const id = parseInt(req.params.id);

  const member = await prisma.LibraryMember.findUnique({
    where: { id }
  });

  if (!member) {
    return res.status(404).json({ error: "LibraryMember not found!" });
  }
  return res.json(member);
});

//login status
app.get("/loginstatus", (req: Request, res: Response) => {
  if (req.session.user) {
    return res.json({ loggedIn: true, user: req.session.user });
  }
  res.json({ loggedIn: false });
});

//login
app.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;

  const account = accounts.find(
    (acc) => acc.username === username && acc.password === password,
  );

  if (account) {
    req.session.user = { username: account.username };
    return res.redirect("/index.html");
  }
res.status(401).json({ error: "Invalid credentials" });
});

app.get("/safe", authMiddleware, (req: Request, res: Response) => {
  res.json({ message: "This is a safe route", user: req.session.user });
});

//hinzufuegen
app.post("/LibraryMember", async (req: Request, res: Response) => {
  const { name, member_id, email } = req.body;
  if (!name || !member_id || !email) {
    return res.status(400).json({ error: "Name, Member_ID und E-Mail erforderlich!" });
  }
  const newMember = await prisma.LibraryMember.create({
    data: { name, member_id, email }
  })
   res.status(200).json(newMember);
});

//Ganzes Objekt ändern
app.put("/LibraryMember/:id", authMiddleware, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { name, member_id, email } = req.body;

  if (!name || !member_id || !email) {
    return res.status(400).json({ error: "Name und Member_ID erforderlich!" });
  }
  //suche objekt mit selber ID wie übergeben und gib der Variable pos die indexnr
  try {
    const pos = await prisma.LibraryMember.update({
      where: { id },
      data: { name, member_id, email }
    });
  } catch {
    return res.status(404).json({ error: "LibraryMember nicht gefunden!" });
  }
});

//bestimmten Wert in Objekt ändern
app.patch("/LibraryMember/:id", authMiddleware, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { name, member_id, email } = req.body;
  //suche übereinstimmende ID
  const data: { name?: string; member_id?: string; email?: string } = {};

  if (name !== undefined) data.name = name;
  if (member_id !== undefined) data.member_id = member_id;
  if(email !== undefined) data.email = email;

  try {
    const updatedMember = await prisma.LibraryMember.update({
      where: { id },
      data
    });
    res.json(updatdeMember)
  } catch {
    return res.status(404).json({ error: "LibraryMember nicht gefunden!" });
  }

});

//Objekt löschen
app.delete("/LibraryMember/:id", authMiddleware, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    await prisma.LibraryMember.delete({
      where: { id }
    });
    return res.status(204).send();
  } catch {
    return res.status(404).json({ error: "LibraryMember nicht gefunden!" });
  }
});

//Server starten:
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});