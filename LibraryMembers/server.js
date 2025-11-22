const express = require("express");
const app = express();
// verwende environment Port, oder 3000
const port = process.env.PORT || 3000;
app.use(express.json());

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

const LibraryMember = [
  { id: 1,  name: "Anna Leitner",       member_id: "AL-203A" },
  { id: 2,  name: "Jonas Berger",       member_id: "JB-517C" },
  { id: 3,  name: "Mara Köstler",       member_id: "MK-441B" },
  { id: 4,  name: "Lukas Ehrenfeld",    member_id: "LE-389D" },
  { id: 5,  name: "Clara Mittermayr",   member_id: "CM-120F" },
  { id: 6,  name: "Samuel Hartwig",     member_id: "SH-775E" },
  { id: 7,  name: "Nina Stadler",       member_id: "NS-632P" },
  { id: 8,  name: "Felix Kramer",       member_id: "FK-908M" },
  { id: 9,  name: "Katrin Blocher",     member_id: "KB-254R" },
  { id: 10, name: "Dominik Herzog",     member_id: "DH-781Q" },
];

//Simple Route erstellen:
app.get("/", (req, res) => {
  return res.send("Hello, express from Express!");
});

//Get für weiteren Pfad erstellt.
app.get("/LibraryMember", (req, res) => {
  return res.json(LibraryMember);
});

//Bekomme bestimmten Member:
app.get("/LibraryMember/:id", (req, res) => {
  //Hole dir die ID aus dem Pfad und wandle die ID in einen INT Wert um
  const id = parseInt(req.params.id);
  //Gehe das Array durch und vergleiche ob eine ID aus der Liste mit der
  //uebergebenen Liste ueberinstimmt
  const member = LibraryMember.find(m => m.id === id);

  if (!member) {
    return res.status(404).json({ error: "LibraryMember not found!" });
  }
  return res.json(member);
});
//hinzufuegen
app.post("/LibraryMember", (req, res) => {
  //hole die Daten aus dem Body und weise sie den Variablen name und member_id zu
  const { name, member_id } = req.body;
  //wenn kein name oder member_id übergeben wurde, gib eine Fehlermeldung zurück
  if (!name || !member_id) {
    return res.status(400).json({ error: "Name und Member_ID erforderlich!" });
  }
  //kontrolliere, ob schon Members vorhanden sind
  //wenn nein, dann übergebe 1 an newID
  //wenn ja, dann hole die ID vom letzten Eintrag der Liste und addiere 1
  const newID = LibraryMember.length ? LibraryMember[LibraryMember.length - 1].id + 1 : 1;
  //erstelle eine neues Member mit id, name und member_id
  const newMember = { id: newID, name, member_id };
  //füge das neu erstelle Mitglied der Liste hinzu
  LibraryMember.push(newMember);
  //antworte mit status 200 und dem neuen Mitglied
  return res.status(200).json(newMember);
});
//Ganzes Objekt ändern
app.put("/LibraryMember/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { name, member_id } = req.body;

  if (!name || !member_id) {
    return res.status(400).json({ error: "Name und Member_ID erforderlich!" });
  }
  //suche objekt mit selber ID wie übergeben und gib der Variable pos die indexnr
  const pos = LibraryMember.findIndex(m => m.id === id);
  //wenn keine übereinstimmung stattgefunden hat, dann hat pos -1
  if (pos === -1) {
    return res.status(404).json({ error: "LibraryMember nicht gefunden!" })
  }

  LibraryMember[pos] = { id, name, member_id };
  return res.json(LibraryMember[pos]);
});

//bestimmten Wert in Objekt ändern
app.patch("/LibraryMember/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { name, member_id } = req.body;
  //suche übereinstimmende ID
  const member = LibraryMember.find(m => m.id === id);
  if (!member) {
    return res.status(404).json({ error: "LibraryMember nicht gefunden!" });
  }
  //kontrolliere, welche Werte übergeben wurden und ändere diese
  if (name !== undefined) member.name = name;
  if (member_id !== undefined) member.member_id = member_id;

  return res.json(member);
});

//Objekt löschen
app.delete("/LibraryMember/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const pos = LibraryMember.findIndex(m => m.id === id);

  if (pos === -1) {
    return res.status(404).json({ error: "LibraryMember nicht gefunden!" });
  }

  LibraryMember.splice(pos, 1);
  return res.status(204).send();
});

//Server starten:
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});