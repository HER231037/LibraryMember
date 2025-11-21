const express = require("express");
const app = express();
// verwende environment Port, oder 3000
const port = process.env.PORT || 3000;
app.use(express.json());

const LibraryMember = [
  {id: 1,   name: "Lukas",      member_id: "MEM001"},
  {id: 2,   name: "Patrick",    member_id: "MEM002"},
  {id: 3,   name: "Daniel",     member_id: "MEM003"},
  {id: 4,   name: "Sophie",     member_id: "MEM004"},
  {id: 5,   name: "Nikola",     member_id: "MEM005"},
  {id: 6,   name: "Mladen",     member_id: "MEM006"},
  {id: 7,   name: "Alexander",  member_id: "MEM007"},
  {id: 8,   name: "Lisa",       member_id: "MEM008"},
  {id: 9,   name: "Markus",     member_id: "MEM009"},
  {id: 10,  name: "Brian",      member_id: "MEM010"},
];

//Simple Route erstellen:
app.get("/", (req, res) => {
  res.send("Hello, express from Express!");
});

//Get für weiteren Pfad erstellt.
app.get("/LibraryMember", (req, res) => {
  res.json(LibraryMember);
});

//Bekomme bestimmten Member:
app.get("/LibraryMember/:id", (req, res) => {
  //Hole dir die ID aus dem Pfad und wandle die ID in einen INT Wert um
  const id = parseInt(req.params.id);
  //Gehe das Array durch und vergleiche ob eine ID aus der Liste mit der
  //uebergebenen Liste ueberinstimmt
  const member = LibraryMember.find(m => m.id === id);

  if(!member) {
    return res.status(404).json({error: "LibraryMember not found!"});
    }
    res.json(member);
});
//hinzufuegen
app.post("/LibraryMember", (req, res) => {
  //hole die Daten aus dem Body und weise sie den Variablen name und member_id zu
  const { name, member_id } = req.body;
  //wenn kein name oder member_id übergeben wurde, gib eine Fehlermeldung zurück
  if(!name || !member_id){
    return res.status(400).json({error: "Name und Member_ID erforderlich!"});
  }
  //kontrolliere, ob schon Members vorhanden sind
  //wenn nein, dann übergebe 1 an newID
  //wenn ja, dann hole die ID vom letzten Eintrag der Liste und addiere 1
  const newID = LibraryMember.length ? LibraryMember[LibraryMember.length -1].id + 1 : 1;
  //erstelle eine neues Member mit id, name und member_id
  const newMember = {id: newID, name, member_id};
  //füge das neu erstelle Mitglied der Liste hinzu
  LibraryMember.push(newMember);
  //antworte mit status 200 und dem neuen Mitglied
  res.status(200).json(newMember);
});
//Ganzes Objekt ändern
app.put("/LibraryMember/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { name, member_id } = req.body;

  if(!name || !member_id){
    return res.status(400).json({error: "Name und Member_ID erforderlich!"});
  }
  //suche objekt mit selber ID wie übergeben und gib der Variable pos die indexnr
    const pos = LibraryMember.findIndex(m => m.id === id);
    //wenn keine übereinstimmung stattgefunden hat, dann hat pos -1
    if(pos === -1){
      return res.status(404).json({error: "LibraryMember nicht gefunden!"})
    }
  
    LibraryMember[pos] = {id, name, member_id};
    res.json(LibraryMember[pos]);
});

//bestimmten Wert in Objekt ändern
app.patch("/LibraryMember/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { name, member_id } = req.body;

  const member = LibraryMember.find(m => m.id === id);
  if(!member){
    return res.status(404).json({error: "LibraryMember nicht gefunden!"});
  }

  if(name !== undefined) member.name = name;
  if(member_id !== undefined) member.member_id = member_id;

  res.json(member);
});

//Server starten:
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});