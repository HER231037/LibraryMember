const express = require("express");
const app = express();
// verwende environment Port, oder 3000
const port = process.env.PORT || 3000;

const LibraryMembers = [
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
app.get("/LibraryMembers", (req, res) => {
  res.json(LibraryMembers);
});

//Get bestimmten Member:
app.get("/LibraryMembers/:id", (req, res) => {
  //Hole dir die ID aus dem Pfad und wandle die ID in einen INT Wert um
  const id = parseInt(req.params.id);
  //Gehe das Array durch und vergleiche ob eine ID aus der Liste mit der
  //uebergebenen Liste ueberinstimmt
  const member = LibraryMembers.find(m => m.id === id);

  if(!member) {
    return res.status(404).json({error: "LibraryMember not found!"});
    }
    res.json(member);
});

//Server starten:
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});