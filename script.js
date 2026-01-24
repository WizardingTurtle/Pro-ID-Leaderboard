import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Create a single supabase client for interacting with your database
const supabase = createClient(
  'https://rfcrtocrixcswmujmqzg.supabase.co',
  'sb_publishable_CSG0rxEJhaVT9kDtlsgkxg_QUK4xZUm'
);

const leaderboardList = document.getElementById("leaderboardList");

/**
 * Fetch leaderboard data from Supabase
 */


document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {

    // Remove active from all tabs
    document.querySelectorAll(".tab").forEach(t => 
      t.classList.remove("active")
    );

    // Add active to clicked tab
    tab.classList.add("active");

    // Get sort type
    const sortType = tab.dataset.sort;

    // Reload leaderboard
    loadLeaderboard(sortType);
  });
});


async function loadLeaderboard(sortType = "xp") {
  try {
    const { data, error } = await supabase
      .from("DashboardDisplay")
      .select("*")
      .order(sortType, { ascending: false });

    if (error) throw error;

    renderLeaderboard(data);

  } catch (err) {
    console.error("Supabase error:", err);

    leaderboardList.innerHTML = `
      <div class="player">
        <div class="info">
          <div class="name">Unable to load leaderboard</div>
          <div class="category">Please try again later</div>
        </div>
      </div>
    `;
  }
}


function renderLeaderboard(entries) {
  leaderboardList.innerHTML = "";

  entries.forEach((entry, index) => {
    const row = document.createElement("div");
    row.className = "player";

    row.dataset.id = String(entry.id);
    row.dataset.playerId = String(entry.player_id);

    row.innerHTML = `
        <div class="rank">${index + 1}</div>
        <div class="info">
          <div class="name">${entry.player_name}</div>
          <div class="category">${entry.category}</div>
        </div>
        <div class="score">${entry.xp}</div>
      `; ``

    switch (index + 1) {
      case 1:
        row.classList.add("first")
        break;
      case 2:
        row.classList.add("second")
        break;
      case 3:
        row.classList.add("third")
        break;
    }
    leaderboardList.appendChild(row);
  });

}

loadLeaderboard("xp");