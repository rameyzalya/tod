// Data dan state aplikasi
let tasks = JSON.parse(localStorage.getItem("tasks")) || []; // Ambil data dari localStorage atau array kosong
let currentTab = "aktif"; // Tab yang aktif (aktif/selesai)
let editingId = null; // ID tugas yang sedang diedit

// Fungsi untuk menambah tugas baru
function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();
  const date = document.getElementById("taskDate").value;
  const error = document.getElementById("error");

  error.textContent = ""; // Reset pesan error

  // Validasi input
  if (!text) {
    error.textContent = "Nama tugas tidak boleh kosong";
    return;
  }

  if (!date) {
    error.textContent = "Tanggal harus dipilih";
    return;
  }

  // Tambah tugas ke array
  tasks.push({
    id: Date.now(), // Generate ID unik berdasarkan timestamp
    text: text,
    completed: false,
    priority: document.getElementById("taskPriority").value,
    date: date,
  });

  save(); // Simpan ke localStorage
  render(); // Render ulang daftar
  input.value = ""; // Reset input
}

// Fungsi untuk mengganti tab (aktif/selesai)
function switchTab(tab) {
  currentTab = tab;
  // Update tampilan tab
  document
    .querySelectorAll(".tab")
    .forEach((t) => t.classList.remove("active"));
  event.target.classList.add("active");
  editingId = null; // Batalkan edit jika ada
  render();
}

// Fungsi untuk menandai tugas selesai/belum
function toggleSelesai(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) task.completed = !task.completed; // Toggle status
  save();
  render();
}

// Fungsi untuk memulai mode edit
function startEdit(id) {
  editingId = id; // Set ID yang sedang diedit
  render(); // Render form edit
}

// Fungsi untuk menyimpan hasil edit
function saveEdit(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    // Update data tugas
    task.text = document.getElementById(`editText-${id}`).value.trim();
    task.date = document.getElementById(`editDate-${id}`).value;
    task.priority = document.getElementById(`editPriority-${id}`).value;
    save();
    editingId = null; // Keluar dari mode edit
    render();
  }
}

// Fungsi untuk menghapus tugas
function hapusTask(id) {
  tasks = tasks.filter((task) => task.id !== id); // Filter out tugas yang dihapus
  save();
  render();
}

// Fungsi utama untuk merender daftar tugas
function render() {
  const list = document.getElementById("taskList");

  // Filter tugas berdasarkan tab aktif
  const filtered = tasks.filter((task) =>
    currentTab === "aktif" ? !task.completed : task.completed
  );

  // Tampilkan pesan jika tidak ada tugas
  if (filtered.length === 0) {
    list.innerHTML = `<div style="text-align:center; color:#666; padding:40px;">
            ${
              currentTab === "aktif"
                ? "Tidak ada tugas aktif"
                : "Tidak ada tugas selesai"
            }
        </div>`;
    return;
  }

  // Render daftar tugas
  list.innerHTML = filtered
    .map((task) =>
      // Jika sedang mode edit, tampilkan form edit
      editingId === task.id
        ? `
            <div class="task-item ${task.priority}">
                <div class="task-content">
                    <input type="text" value="${task.text}" id="editText-${
            task.id
          }">
                    <div style="display:flex; gap:5px; margin-top:5px;">
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
                    <div class="task-actions" style="margin-top:5px;">
                        <button class="edit-btn" onclick="saveEdit(${
                          task.id
                        })">Simpan</button>
                        <button class="hapus-btn" onclick="editingId=null; render()">Batal</button>
                    </div>
                </div>
            </div>
        `
        : // Jika tidak, tampilkan tugas normal
          `
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
            </div>
        `
    )
    .join(""); // Gabungkan semua HTML
}

// Fungsi untuk menyimpan data ke localStorage
function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Inisialisasi aplikasi saat halaman dimuat
document.getElementById("taskDate").value = new Date()
  .toISOString()
  .split("T")[0]; // Set tanggal default
render(); // Render awal
