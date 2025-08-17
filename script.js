const userContainer = document.getElementById("userContainer");
const reloadBtn = document.getElementById("reloadBtn");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

let allUsers = []; // store users for searching & sorting

// Fetch and display users
async function fetchUsers() {
  userContainer.innerHTML = `<p class="loading">⏳ Loading users...</p>`;

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!response.ok) throw new Error("Network response was not ok");

    const users = await response.json();
    allUsers = users; // store for filtering
    displayUsers(users);

  } catch (error) {
    userContainer.innerHTML = `
      <div class="error">
        <p>⚠️ Error: ${error.message}</p>
        <button onclick="fetchUsers()">Retry</button>
      </div>
    `;
  }
}

// Display users
function displayUsers(users) {
  userContainer.innerHTML = "";

  if (users.length === 0) {
    userContainer.innerHTML = `<p style="text-align:center; color:#555;">No users found</p>`;
    return;
  }

  users.forEach(user => {
    const card = document.createElement("div");
    card.classList.add("user-card");

    card.innerHTML = `
      <h3>${user.name}</h3>
      <p><strong>Email:</strong> ${user.email}</p>
      <div class="address" style="display:none;">
        <p><strong>Address:</strong> ${user.address.suite}, ${user.address.street}, ${user.address.city}, ${user.address.zipcode}</p>
        <p><strong>Phone:</strong> ${user.phone}</p>
        <p><strong>Company:</strong> ${user.company.name}</p>
      </div>
      <button class="toggle-btn">Show Details</button>
    `;

    // Toggle button functionality
    const toggleBtn = card.querySelector(".toggle-btn");
    const addressDiv = card.querySelector(".address");

    toggleBtn.addEventListener("click", () => {
      if (addressDiv.style.display === "none") {
        addressDiv.style.display = "block";
        toggleBtn.textContent = "Hide Details";
      } else {
        addressDiv.style.display = "none";
        toggleBtn.textContent = "Show Details";
      }
    });

    userContainer.appendChild(card);
  });
}

// Search functionality
searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase();
  const filtered = allUsers.filter(user =>
    user.name.toLowerCase().includes(term) ||
    user.email.toLowerCase().includes(term)
  );
  displayUsers(filtered);
});

// Sort functionality
sortSelect.addEventListener("change", () => {
  const sorted = [...allUsers].sort((a, b) => {
    if (sortSelect.value === "az") return a.name.localeCompare(b.name);
    else return b.name.localeCompare(a.name);
  });
  displayUsers(sorted);
});

// Reload button
reloadBtn.addEventListener("click", fetchUsers);

// Fetch on page load
fetchUsers();