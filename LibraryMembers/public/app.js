let editingId = null;
//sobald das HTML geladen wurde, wird dieses JS ausgeführt.
async function fetchLibraryMember() {
    //Zugriff auf das Element mit der ID "Status" im DOM
    const statusEL = document.getElementById("status");
    //Zugriff auf das tbody der Table mit der ID "member-table"
    const tbody = document.querySelector("#member-table tbody");

    try {
        //hier wird der Text überschrieben
        statusEL.textContent = "Load data...";

        //fetch(): Der Browser schickt eine Anfrage an diese URL
        //und gibt die Antwort zurück
        //wait: warte, bis der Browser dir die Daten geliefert hat
        //bevor es mit dem Code weitergeht
        const res = await fetch("/LibraryMember");
        //res.ok ist true, wenn statuscode 200-299
        //bei 404 oder 500 -> false , dann wird der error gecatcht.
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        //Antwort vom Server wird in JS-Objekte umgewandelt.
        const members = await res.json();
        //tabelle wird zuerst geleert, um etwaige alte Daten zu entfernen
        tbody.innerHTML = "";

        for (const m of members) {
            //erstellt eine neue Zeile
            const tr = document.createElement("tr");
            tr.className = "member";
            //erstellt neue Spalten
            const tdId = document.createElement("td");
            //holt sich die id vom Objekt
            tdId.textContent = m.id;

            const tdName = document.createElement("td");
            tdName.textContent = m.name;

            const tdMember_id = document.createElement("td");
            tdMember_id.textContent = m.member_id;

            const tdActions = document.createElement("td");
            //beim Abrufen der Website ist die editingId immer 0, daher wird else ausgeführt.
            if (editingId === m.id) {
                // If wird ausgeführt, wenn ein Eintrag bearbetet wird
                //hier werden zwei neue Eingabefelder pro Zeile erstellt.
                const nameInput = document.createElement("input");
                nameInput.type = "text";
                //in die Zeile wird automatisch der aktuelle Text eingetragen.
                nameInput.value = m.name;
                nameInput.className = "input-sm";

                const member_IdInput = document.createElement("input");
                member_IdInput.type = "text";
                member_IdInput.value = m.member_id;
                member_IdInput.className = "input-sm";
                //die erstellten Eingabefelder werden nun hinzugefügt
                tdName.appendChild(nameInput);
                tdMember_id.appendChild(member_IdInput);
                //neue Buttons werden erstellt
                const saveBtn = document.createElement("button");
                saveBtn.textContent = "Speichern";
                saveBtn.className = "save-btn";
                //wenn auf den Button gedrückt wird, dann wird der Code ausgeführt
                saveBtn.onclick = async () => {
                    //Kontrolle, ob in beiden Feldern etwas eingetragen ist.
                    if (!nameInput.value.trim() || !member_IdInput.value.trim()) {
                        document.getElementById("status").textContent = "Name und Member_ID erforderlich.";
                        return;
                    }
                    //Starte die Methode und warte auf ein promise/antwort
                    //hier werden die daten nochmals getrimmt und so übergeben.
                    await updateMember(m.id, {name: nameInput.value.trim(), member_id: member_IdInput.value.trim()});
                    //die editingID wird wieder auf 0 gesetzt, damit alle Zeilen wieder normal angezeigt werden
                    editingId = null;
                    //Funktion wird für die nächste Zeile erneut ausgeführt
                    await fetchLibraryMember();
                };
                //Abbrechen Button wird erstellt.
                const cancelBtn = document.createElement("button");
                cancelBtn.textContent = "Abbrechen";
                cancelBtn.className = "cancel-btn";
                cancelBtn.onclick = async () => {
                    editingId = null;
                    await fetchLibraryMember();
                };
                //Buttons werden hinzugefügt.
                tdActions.append(saveBtn, " ", cancelBtn);
            } else {
                // "Normale"-Ansicht der Zeilen wird erstellt.
                tdName.textContent = m.name;
                tdMember_id.textContent = m.member_id;

                const editBtn = document.createElement("button");
                editBtn.textContent = "Bearbeiten";
                editBtn.className = "edit-btn";
                editBtn.onclick = () => {
                    editingId = m.id;
                    fetchLibraryMember();
                };
                const delBtn = document.createElement("button");
                delBtn.textContent = "Delete";
                delBtn.className = "delete-btn";
                delBtn.onclick = async () => {
                    //popup mit bestätigung poppt auf.
                    if (!confirm(`Remove LibraryMember ${m.name}?`)) return;
                    await deleteMember(m.id);
                    await fetchLibraryMember();
                };
                 //Buttons werden hinzugefügt
                const label = document.createElement("label");
                const checkBox = document.createElement("input");
                checkBox.type = "checkbox";
                //Checkbox holt sich die Members ID
                checkBox.dataset.id = m.id;

                const spanBox = document.createElement("span");
                spanBox.className = "check";

                label.appendChild(checkBox);
                label.appendChild(spanBox);
                tdActions.append(editBtn, " ", delBtn, " ", label);
            }
            //Fügt die Zellen in die Zeile hinzu
            tr.append(tdId, tdName, tdMember_id, tdActions);
            //Fügt die Zeile in die Tabelle hinzu
            tbody.appendChild(tr);
        }
        //Status-Text wird aktualisiert. Die Länge des Arrays wird hergeholt
        statusEL.textContent = `Loaded: ${members.length} LibraryMembers`;
    }
    catch (err) {
        //Fehler werden in der Konsole angezeigt
        console.error(err);
        //Dementsprechende Meldung sieht der Nutzer
        statusEL.textContent = "Error while loading the data.";
    }
}
//Wurde die Seite vollständig geladen, dann wird das JS ausgeführt
//und die Tabelle erstellt und befüllt.
window.addEventListener("DOMContentLoaded", fetchLibraryMember);

//button ist fix im html gecoded, führt diese funktion aus
async function addClick() {
    const nameInput = document.getElementById("member-name");
    const name = nameInput.value.trim();
    const idInput = document.getElementById("member-id");
    const member_id = idInput.value.trim();
    const button = document.getElementById("add-btn");
    const statusEl = document.getElementById("status");

    if (!name || !member_id) {
        statusEl.textContent = "Name and id required.";
        return;
    }

    button.disabled = true;
    await addMember(name, member_id);
    button.disabled = false;

    nameInput.value = "";
    idInput.value = "";
    nameInput.focus();
}


async function addMember(name, member_id) {
    const statusEl = document.getElementById("status");
    try {
        const res = await fetch("/LibraryMember", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, member_id }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        await fetchLibraryMember();
        statusEl.textContent = "LibraryMember added.";
    } catch (err) {
        console.error(err);
        statusEl.textContent = `Error while added a LibraryMember: ${err.message}`;
    }
}

async function deleteMember(id) {
    const statusEl = document.getElementById("status");
    try {
        const res = await fetch(`/LibraryMember/${id}`, { method: "DELETE" });
        if (res.status === 204) {
            statusEl.textContent = `LibraryMember ${id} removed.`;
        } else {
            const msg = await res.json().catch(() => ({}));
            throw new Error(msg.error || `HTTP ${res.status}`);
        }
    } catch (err) {
        console.error(err);
        statusEl.textContent = `Error while removing: ${err.message}`;
    }
}

async function updateMember(id, member_id) {
    const statusEl = document.getElementById("status");
    try {
        const res = await fetch(`/LibraryMember/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(member_id),
        });
        if (!res.ok) {
            const msg = await res.json().catch(() => ({}));
            throw new Error(msg.error || `HTTP ${res.status}`);
        }
        statusEl.textContent = `LibraryMember ${id} aktualisiert.`;
    } catch (err) {
        console.error(err);
        statusEl.textContent = `Fehler beim Aktualisieren: ${err.message}`;
    }
}

let state = 0;

function toggleIcons() {
    const b1 = document.getElementById("book1");
    const b2 = document.getElementById("book2");

    if (state === 0) {
        b1.style.display = "none";
        b2.style.display = "inline";
        state = 1;
    } else {
        b1.style.display = "inline";
        b2.style.display = "none";
        state = 0;
    }
}
setInterval(toggleIcons, 1000);

async function delMembers() {
    if (!confirm(`Remove LibraryMembers?`)) return;

    let anz = 0;
    const checked = document.querySelectorAll('input[type="checkbox"]:checked');

    for (const cb of checked) {
        const id = cb.dataset.id;
        await deleteMember(id);
        anz++;
    }

    confirm(`${anz} Members gelöscht`);
    await fetchLibraryMember(); 
}

