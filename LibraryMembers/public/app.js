let editingId = null;
async function fetchLibraryMember() {
    const statusEL = document.getElementById("status");
    const tbody = document.querySelector("#member-table tbody");

    try {
        statusEL.textContent = "Load data...";

        const res = await fetch("/LibraryMember");

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        const members = await res.json();
        members.sort((a, b) => a.id - b.id);

        tbody.innerHTML = "";

        for (const m of members) {
            const tr = document.createElement("tr");
            tr.className = "member";

            const tdId = document.createElement("td");

            tdId.textContent = m.id;

            const tdName = document.createElement("td");
            tdName.textContent = m.name;

            const tdMember_id = document.createElement("td");
            tdMember_id.textContent = m.member_id;

            const tdemail = document.createElement("td");
            tdemail.textContent = m.email;

            const tdActions = document.createElement("td");

            if (editingId === m.id) {
                const nameInput = document.createElement("input");
                nameInput.type = "text";
                nameInput.value = m.name;
                nameInput.className = "input-sm";

                const member_IdInput = document.createElement("input");
                member_IdInput.type = "text";
                member_IdInput.value = m.member_id;
                member_IdInput.className = "input-sm";
                
                const member_emailInput = document.createElement("input");
                member_emailInput.type = "text";
                member_emailInput.value = m.email;
                member_emailInput.className = "input-sm";

                tdName.appendChild(nameInput);
                tdMember_id.appendChild(member_IdInput);
                tdemail.appendChild(member_emailInput);
                
                const saveBtn = document.createElement("button");
                saveBtn.textContent = "Speichern";
                saveBtn.className = "save-btn";
                saveBtn.onclick = async () => {
                    if (!nameInput.value.trim() || !member_IdInput.value.trim() || !member_emailInput.value.trim()) {
                        document.getElementById("status").textContent = "Name, Member_ID und E-Mail erforderlich.";
                        return;
                    }
                    await updateMember(m.id, {name: nameInput.value.trim(), member_id: member_IdInput.value.trim(), email: member_emailInput.value.trim()});
                    editingId = null;
                    await fetchLibraryMember();
                };
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
                tdemail.textContent = m.email;

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
            tr.append(tdId, tdName, tdMember_id, tdemail, tdActions);
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

function redirectIfUnauthorized(res) {
    if (res.status === 401 || res.status === 403) {
        window.location.href = "/login.html";
        return true;
    }
    return false;
}

//button ist fix im html gecoded, führt diese funktion aus
async function addClick() {
    const nameInput = document.getElementById("member-name");
    const name = nameInput.value.trim();

    const idInput = document.getElementById("member-id");
    const member_id = idInput.value.trim();

    const emailInput = document.getElementById("member-email");
    const email = emailInput.value.trim();

    const button = document.getElementById("add-btn");
    const statusEl = document.getElementById("status");

    if (!name || !member_id || !email) {
        statusEl.textContent = "Name, id and email required.";
        return;
    }

    button.disabled = true;
    await addMember(name, member_id, email);
    button.disabled = false;

    nameInput.value = "";
    idInput.value = "";
    emailInput.value = "";
    nameInput.focus();
}

async function addMember(name, member_id, email) {
    const statusEl = document.getElementById("status");
    try {
        const res = await fetch("/LibraryMember", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, member_id, email }),
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
        
        if (redirectIfUnauthorized(res)) return;

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

async function updateMember(id, member_id, email) {
    const statusEl = document.getElementById("status");
    try {
        const res = await fetch(`/LibraryMember/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(member_id),
        });

        if (redirectIfUnauthorized(res)) return;
        
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

