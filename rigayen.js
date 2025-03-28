document.addEventListener("DOMContentLoaded", () => {
    const addEntryBtn = document.getElementById("add-entry-btn");
    const entriesList = document.getElementById("entries-list");
    const entryModal = document.getElementById("entry-modal");
    const closeBtn = document.getElementById("close-btn");
    const saveBtn = document.getElementById("save-btn");
    const deleteBtn = document.getElementById("delete-btn");
    const entryDate = document.getElementById("entry-date");
    const diaryText = document.getElementById("diary-text");
    const emojiContainer = document.querySelector(".emoji-picker");
    let selectedEmoji = null;
    let editingEntry = null;
    
    // function to load all saved diary entries from local storage and display them
    function loadEntries() {
        entriesList.innerHTML = "";
        let entries = JSON.parse(localStorage.getItem("diaryEntries")) || [];
        
        entries.sort((a, b) => new Date(b.date) - new Date(a.date));
        entries.forEach((entry, index) => {
            const entryDiv = document.createElement("div");
            entryDiv.classList.add("entry-item");
            entryDiv.innerHTML = `<strong>${entry.date}</strong> ${entry.emoji ? entry.emoji : ''} ${entry.text.substring(0, 30)}...`;
            
            entryDiv.addEventListener("click", () => {
                const originalIndex = JSON.parse(localStorage.getItem("diaryEntries")).findIndex(e => e.date === entry.date && e.text === entry.text);
                openEntry(originalIndex);
            });

            entriesList.appendChild(entryDiv);
        });
    }
    
    // function to open an entry for viewing/editing
    function openEntry(index) {
        const entries = JSON.parse(localStorage.getItem("diaryEntries")) || [];
        editingEntry = index;
        entryDate.value = entries[index].date;
        diaryText.value = entries[index].text;
        selectedEmoji = entries[index].emoji || null;
        
        // highlight the previously selected emoji (if any)
        document.querySelectorAll(".emoji-picker span").forEach(emoji => {
            emoji.classList.remove("selected");
            if (emoji.textContent === selectedEmoji) {
                emoji.classList.add("selected");
            }
        });
        entryModal.classList.remove("hidden");
    }
    
    // function to save a new or edited diary entry
    function saveEntry() {
        const entries = JSON.parse(localStorage.getItem("diaryEntries")) || [];
        const newEntry = { date: entryDate.value, emoji: selectedEmoji, text: diaryText.value };
        
        if (editingEntry !== null) {
            entries[editingEntry] = newEntry;
            alert("Entry updated successfully!");
        } else {
            entries.push(newEntry);
            alert("New entry added successfully!")
        }
        
        localStorage.setItem("diaryEntries", JSON.stringify(entries));
        entryModal.classList.add("hidden");
        editingEntry = null;
        loadEntries();
    }
    
    // function to delete an entry
    function deleteEntry() {
        if (editingEntry !== null) {
            const entries = JSON.parse(localStorage.getItem("diaryEntries")) || [];
            entries.splice(editingEntry, 1);
            localStorage.setItem("diaryEntries", JSON.stringify(entries));
            entryModal.classList.add("hidden");
            editingEntry = null;
            alert("Entry deleted successfully!")
            loadEntries();
        }
    }
    
    // Event listener for the "Add Entry" button
    addEntryBtn.addEventListener("click", () => {
        entryDate.value = "";
        diaryText.value = "";
        selectedEmoji = null;
        editingEntry = null;
        document.querySelectorAll(".emoji-picker span").forEach(emoji => emoji.classList.remove("selected"));
        entryModal.classList.remove("hidden");
    });
    
    closeBtn.addEventListener("click", () => entryModal.classList.add("hidden"));
    saveBtn.addEventListener("click", saveEntry);
    deleteBtn.addEventListener("click", deleteEntry);
    
    // event listener for selecting an emoji
    if (emojiContainer) {
        emojiContainer.addEventListener("click", (event) => {
            if (event.target.matches(".emoji-picker span")) {
                document.querySelectorAll(".emoji-picker span").forEach(emoji => emoji.classList.remove("selected"));

                event.target.classList.add("selected");
                selectedEmoji = event.target.textContent;
            }
        });
    }
    
    loadEntries();
});
