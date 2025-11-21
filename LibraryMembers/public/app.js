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
            //erstellt neue Spalten
            const tdId = document.createElement("td");
            //holt sich die id vom Objekt
            tdId.textContent = m.id;

            const tdName = document.createElement("td");
            tdName.textContent = m.name;

            const tdMember_id = document.createElement("td");
            tdMember_id.textContent = m.member_id;

            const delBtn = document.createElement("button");
            delBtn.textContent = "Delete";
            delBtn.className = "delete-btn";
            delBtn.onclick = async () => {
                if (!confirm(`Remove LibraryMember ${m.name}?`)) return;
                await deleteMember(m.id);
                await fetchLibraryMember();
            };

            //Fügt die Zellen in die Zeile hinzu
            tr.append(tdId, tdName, tdMember_id, delBtn);
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
            throw new Error(msg.error || `HTTP ${res.status}`);
        }
    } catch (err) {
        console.error(err);
        statusEl.textContent = `Error while removing: ${err.message}`;
    }
}