let grid; // Mřížka, ve které bude hra uložena
let testMode = false; // Pokud je nastavena na true, zobrazí pozice min (pro testovani :3)
let mineCount = 20; // Celkový počet min ve hře
let flaggedCount = 0; // Počet označených buněk

// Funkce pro generování mřížky
function generateGrid() {
  grid = [];
  let gridElement = document.getElementById("grid");
  gridElement.innerHTML = ""; // Vyčištění mřížky na začátku
  document.getElementById("mine-counter").innerText = `Mines: ${mineCount - flaggedCount}`; // Aktualizace počítadla min

  // Odstranění třídy "game-over" z těla, pokud je přítomna
  document.body.classList.remove("game-over");

  // Generování mřížky 10x10
  for (let i = 0; i < 10; i++) {
    let row = gridElement.insertRow(i); // Přidání řádku do tabulky
    grid.push([]); // Přidání prázdného pole pro nový řádek do mrizky
    for (let j = 0; j < 10; j++) {
      let cell = row.insertCell(j); // Přidání buňky do řádku
      cell.setAttribute("data-row", i); // Nastavení datového atributu řádku
      cell.setAttribute("data-col", j); // Nastavení datového atributu sloupce
      cell.onclick = function () { clickCell(this); }; // Kliknutí na buňku
      let mine = document.createAttribute("data-mine"); // Vytvoření atributu pro minu
      mine.value = "false"; // Nastavení defaultní hodnoty miny na false
      cell.setAttributeNode(mine); // Přidání atributu do buňky
      // Vytvoření objektu reprezentujícího buňku a přidání do gridu
      grid[i][j] = { cell: cell, isMine: false, revealed: false, mineCount: 0, flagged: false };
    }
  }
  addMines(); // Přidání min do mřížky
}

// Funkce pro náhodné přidání min do mřížky
function addMines() {
  for (let i = 0; i < mineCount; i++) {
    let row = Math.floor(Math.random() * 10); // Náhodný řádek
    let col = Math.floor(Math.random() * 10); // Náhodný sloupec
    let cell = grid[row][col].cell;
    if (cell.getAttribute("data-mine") !== "true") { // Pokud na buňce není mina
      cell.setAttribute("data-mine", "true"); // Nastavení atributu miny na true
      if (testMode) cell.innerHTML = "X"; // Pokud je testMode true, zobrazí miny
    } else {
      i--; 
    }
  }
}

// Funkce pro odhalení všech min (při prohře)
function revealMines() {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      let cell = grid[i][j].cell;
      if (cell.getAttribute("data-mine") == "true") cell.classList.add("mine"); 
    }
  }
}

// Funkce pro kontrolu, zda je hra dokončena
function checkLevelCompletion() {
  let levelComplete = true; // Předpoklad, že je úroveň dokončena
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if ((grid[i][j].cell.getAttribute("data-mine") == "false") && (!grid[i][j].revealed)) levelComplete = false; // Kontrola, zda jsou všechny neminové buňky odkryté
    }
  }
  if (levelComplete) { // Pokud jsou všechny neminové buňky odkryté
    alert("You Win!"); // Výhra
    revealMines(); // Odhalení všech min
  }
}

// Funkce, která se spustí při kliknutí na buňku
function clickCell(cell) {
  let cellRow = parseInt(cell.getAttribute("data-row")); // Získání řádku buňky
  let cellCol = parseInt(cell.getAttribute("data-col")); // Získání sloupce buňky

  if (grid[cellRow][cellCol].revealed || grid[cellRow][cellCol].flagged) {
    return; // Zabránění kliknutí na odkryté nebo označené buňky
  }

  if (grid[cellRow][cellCol].cell.getAttribute("data-mine") == "true") { // Pokud je buňka mina
    revealMines(); // Odhalení všech min
    document.body.classList.add("game-over");
    alert("Game Over"); // Zobrazení zprávy o prohře
  } else {
    grid[cellRow][cellCol].revealed = true; // Nastavení buňky jako odkryté
    cell.classList.add("clicked"); // Změna barvy odkryté buňky
    let mineCount = 0; // Počet min v okolí buňky
    // Kontrola okolních buněk na počet min
    for (let i = Math.max(cellRow - 1, 0); i <= Math.min(cellRow + 1, 9); i++) { // Prochází okolní buňky ve dvourozměrném poli kolem dané buňky
      for (let j = Math.max(cellCol - 1, 0); j <= Math.min(cellCol + 1, 9); j++) { // počítá, kolik z nich obsahuje minu.
        if (grid[i][j].cell.getAttribute("data-mine") == "true") mineCount++; // Přičítá tyto miny k proměnné mineCount.
      }
    }
    grid[cellRow][cellCol].mineCount = mineCount; // Nastavení počtu min v okolí
    cell.innerHTML = mineCount === 0 ? "" : mineCount; // Zobrazení počtu min v buňce
    if (mineCount == 0) { // Pokud není v okolí žádná mina
      //odhalení okolních neminových buněk
      for (let i = Math.max(cellRow - 1, 0); i <= Math.min(cellRow + 1, 9); i++) {
        for (let j = Math.max(cellCol - 1, 0); j <= Math.min(cellCol + 1, 9); j++) {
          if (!grid[i][j].revealed) clickCell(grid[i][j].cell);
        }
      }
    }
    checkLevelCompletion(); // Kontrola, zda je hra dokončena
  }
}
// Funkce pro restartování hry
function restartGame() {
  flaggedCount = 0; // Resetování počtu vlajek
  generateGrid(); // Generování nové mřížky
}

// Funkce spuštěná po načtení stránky
window.onload = function () {
  document.getElementById("restart-button").onclick = restartGame; // Přidání funkce restartu na tlačítko
  generateGrid(); // Generování mřížky na začátku
};
