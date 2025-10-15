// Data dan state aplikasi
let tasks = JSON.parse(localStorage.getItem("tasks")) || [],
  currentTab = "aktif",
  editingId = null;

// Fungsi untuk menambah tugas baru
function addTask() {
  const input = document.getElementById("taskInput"),
    text = input.value.trim(),
    date = document.getElementById("taskDate").value,
    error = document.getElementById("error");

  error.textContent = "";
  if (!text) return (error.textContent = "Nama tugas tidak boleh kosong");
  if (!date) return (error.textContent = "Tanggal harus dipilih");

  tasks.push({
    id: Date.now(),
    text: text,
    completed: false,
    priority: document.getElementById("taskPriority").value,
    date: date,
  });

  save();
  render();
  input.value = "";
}

// Fungsi untuk mengganti tab (aktif/selesai)
function switchTab(tab) {
  currentTab = tab;
  document
    .querySelectorAll(".tab")
    .forEach((t) => t.classList.remove("active"));
  event.target.classList.add("active");
  editingId = null;
  render();
}

// Fungsi untuk menandai tugas selesai/belum
function toggleSelesai(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) task.completed = !task.completed;
  save();
  render();
}

// Fungsi untuk memulai mode edit
function startEdit(id) {
  editingId = id;
  render();
}

// Fungsi untuk menyimpan hasil edit
function saveEdit(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.text = document.getElementById(`editText-${id}`).value.trim();
    task.date = document.getElementById(`editDate-${id}`).value;
    task.priority = document.getElementById(`editPriority-${id}`).value;
    save();
    editingId = null;
    render();
  }
}

// Fungsi untuk menghapus tugas
function hapusTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  save();
  render();
}

// Fungsi utama untuk merender daftar tugas
function render() {
  const list = document.getElementById("taskList"),
    filtered = tasks.filter((task) =>
      currentTab === "aktif" ? !task.completed : task.completed
    );

  if (filtered.length === 0) {
    list.innerHTML = `<div style="text-align:center;color:#666;padding:40px">${
      currentTab === "aktif"
        ? "Tidak ada tugas aktif"
        : "Tidak ada tugas selesai"
    }</div>`;
    return;
  }

  list.innerHTML = filtered
    .map((task) =>
      editingId === task.id
        ? `
        <div class="task-item ${task.priority}">
            <div class="task-content">
                <input type="text" value="${task.text}" id="editText-${
            task.id
          }">
                <div style="display:flex;gap:5px;margin-top:5px">
                    <input type="date" value="${task.date}" id="editDate-${
            task.id
          }">
                    <select id="editPriority-${task.id}">
                        <option value="rendah" ${
                          task.priority == "rendah" ? "selected" : ""
                        }>Rendah</option>
                        <option value="sedang" ${
                          task.priority == "sedang" ? "selected" : ""
                        }>Sedang</option>
                        <option value="tinggi" ${
                          task.priority == "tinggi" ? "selected" : ""
                        }>Tinggi</option>
                    </select>
                </div>
                <div class="task-actions" style="margin-top:5px">
                    <button class="edit-btn" onclick="saveEdit(${
                      task.id
                    })">Simpan</button>
                    <button class="hapus-btn" onclick="editingId=null;render()">Batal</button>
                </div>
            </div>
        </div>`
        : `
        <div class="task-item ${task.completed ? "selesai" : ""} ${
            task.priority
          }">
            <input type="checkbox" class="task-checkbox" ${
              task.completed ? "checked" : ""
            } onchange="toggleSelesai(${task.id})">
            <div class="task-content">
                <div class="task-text ${task.completed ? "selesai" : ""}">${
            task.text
          }</div>
                <div class="task-details">
                    <span class="priority ${
                      task.priority
                    }">${task.priority.toUpperCase()}</span>
                    <span>📅 ${new Date(task.date).toLocaleDateString(
                      "id-ID"
                    )}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="edit-btn" onclick="startEdit(${
                  task.id
                })">Edit</button>
                <button class="hapus-btn" onclick="hapusTask(${
                  task.id
                })">Hapus</button>
            </div>
        </div>`
    )
    .join("");
}

// Fungsi untuk menyimpan data ke localStorage
function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Inisialisasi aplikasi saat halaman dimuat
document.getElementById("taskDate").value = new Date()
  .toISOString()
  .split("T")[0];
render();
