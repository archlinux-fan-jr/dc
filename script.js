
let clicks = 999999999999990;
let basePerClick = 0.01;
let perClick = 0.01;
let cps = 0;
let autoMultiplier = 1;
let tempBoost = 1;
let activeTimer = null;
let lastUnlockState = "";
let autoSpeedMultiplier = 1; // Začnemo z 1x hitrostjo
let autoInterval = null;     // Shramba za interval, da ga lahko ponastavimo
let keysPressed = {}; // Tukaj bomo beležili, katera tipka je pritisnjena

// Statistika za posebne nadgradnje
let rainUnlocked = false;
let luckChance = 0; 
let luckMult = 1;
let combo = 1;
let maxCombo = 1;
let comboTimer = null;
let adrenalineActive = false;


// AVTOMATI (ostanejo enaki)
let autos = [
  {name:"Baby Donkey",        base:0.01,          cost:0.5,             	level:0},
  {name:"Toddler Donkey",     base:0.05,          cost:5,              		level:0},
  {name:"Kiddo Donkey",       base:0.20,          cost:40,              	level:0},
  {name:"Farm Donkey",        base:1,             cost:200,             	level:0},
  {name:"Factory Donkey",     base:2,             cost:500,             	level:0},
  {name:"Mega Donkey",        base:5,            	cost:1250,           		level:0},
  {name:"Ultra Donkey",       base:10,           	cost:3000,           		level:0},
  {name:"God Donkey",         base:25,           	cost:12500,           	level:0},
  {name:"Galactic Donkey",    base:50,          	cost:25000,          		level:0},
  {name:"Quantum Donkey",     base:100,         	cost:50000,         		level:0},
  {name:"Multiverse Donkey",  base:250,         	cost:100000,        		level:0},
  {name:"Portal Donkey",      base:500,        		cost:250000,        		level:0},
  {name:"Atomic Donkey",      base:1000,       		cost:500000,       			level:0},
  {name:"Nebula Donkey",      base:2500,       		cost:1000000,      			level:0},
  {name:"Stellar Donkey",     base:5000,      		cost:2500000,     			level:0},
  {name:"Cosmic Donkey",      base:10000,     		cost:10000000,    			level:0},
  {name:"Eternal Donkey",     base:25000,     		cost:25000000,   				level:0},
  {name:"Infinity Donkey",    base:50000,    			cost:500000000,  				level:0},
  {name:"Singularity Donkey", base:100000,   			cost:1000000000, 				level:0},
  {name:"Omni Donkey",        base:250000,   			cost:2500000000,				level:0},
  {name:"Legendary Donkey",   base:500000,  			cost:5000000000,				level:0},
  {name:"Mythic Donkey",      base:9990000, 			cost:99990000000000,			level:0}
];

// 1. DINAMIČNE NADGRADNJE
let upgrades = [
  { name: "Baby Double Click",		desc: "x2 manual click", 						cost:	5, 				bought: false, type: "clickMult", value: 2 },
  { name: "Baby Two&Half Click", 	desc: "x2.5 manual click",					cost: 20, 			bought: false, type: "clickMult", value: 2.5 },
  { name: "Baby Cinco Click", 		desc: "x5 manual click", 						cost: 50, 			bought: false, type: "clickMult", value: 5 },
  { name: "Full Click", 					desc: "First Full click", 					cost: 250, 			bought: false, type: "clickMult", value: 4 },
  { name: "Double Click", 				desc: "x2 manual click", 						cost: 500, 			bought: false, type: "clickMult", value: 2 },
  { name: "Combo Starter", 				desc: "Clicks stack combo (max x2)",cost: 1000, 		bought: false, type: "combo", 		value: 2 },
  { name: "Two&Half Click", 			desc: "x2.5 manual click", 					cost: 2500, 		bought: false, type: "clickMult", value: 2.5 },
  
  { name: "Big Combo Starter", 		desc: "Clicks stack combo (max x5)",cost: 5000, 		bought: false, type: "combo", 		value: 2.5 },
  
	{	name: "Turbo Donkey", 				desc: "Auto farmers work 1.5x faster",cost: 7500, 	bought: false, type: "autoSpeed", value: 1.5 },
  
  { name: "Lucky Hoof",						desc: "20% chance for 2x click", 	cost: 10000, 			bought: false, type: "luck", chance: 0.2, mult: 2 },
   
  { name: "Adrenaline",				desc: "Clicks x3 for 10s every 1min", cost: 15000, 			bought: false, type: "special", 	id: "adrenaline" },

  { name: "Ultra Click", 			desc: "x4 manual click", 							cost: 25000, 			bought: false, type: "clickMult", value: 4 },
  
  { name: "Big Boy Combo",		desc: "Clicks stack combo (max x10)",	cost: 80000, 			bought: false, type: "combo", 		value: 2 },
  
  { name: "Treasure Click", 	desc: "1% chance to gain 1% of bank", cost: 100000, 		bought: false, type: "special", 	id: "treasure" },

  { name: "Mega Combo",				desc: "Clicks stack combo (max x20)",	cost: 200000, 		bought: false, type: "combo", 		value: 2 },   
 
  { name: "Cinco Click", 			desc: "x5 manual click", 							cost: 500000, 		bought: false, type: "clickMult", value: 5 },
  
  { name: "Divine Hoof", 			desc: "25% chance for 5x click", 			cost: 2500000, 		bought: false, type: "luck", chance: 0.25, mult: 5 },
  
  { name: "God Click", 				desc: "x7.5 manual click", 						cost: 7500000, 		bought: false, type: "clickMult", value: 7.5 },
  
  {	name: "Super Donkey", 		desc: "Auto farmers work double speed",cost: 15000000, 	bought: false, type: "autoSpeed", value: 2 },
  
  { name: "Mega Click", 			desc: "x10 manual click", 						cost: 150000000, 	bought: false, type: "clickMult", value: 10 },
  
  { name: "Donkey rain", 			desc: "x3 farm every 5 mins for 1 min", cost: 250000000,bought: false, type: "special", 	id: "rain" },
  																																				
  { name: "Quantum Click",		desc: "x20 manual click", 						cost: 5000000000, 	bought: false, type: "clickMult", value: 20 },
  { name: "OMG Click", 				desc: "x50 manual click", 						cost: 200000000000,	bought: false, type: "clickMult", value: 50 },
  { name: "Infinity Click", 	desc: "x999 manual click", 						cost: 99990000000000,bought: false, type: "clickMult", value: 999 }
  
];



function format(n) {
	if (n >= 1e18) return (n / 1e18).toFixed(2) + "Qi"; // Quintillion
  if (n >= 1e15) return (n / 1e15).toFixed(2) + "Qa"; // Quadrillion
  if (n >= 1e12) return (n / 1e12).toFixed(2) + "T";  // Trillion
  if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";   // Billion
  if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";   // Million
  // ... ostalo

  if (n < 1000) {
    // Če je manj kot 1€, pokaži 2 decimalki (npr. 0,50)
    return n.toLocaleString('de-DE', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  } else {
    // Če je 1€ ali več, odreži decimalke in uporabi pike za tisočice (npr. 1.000)
    return Math.floor(n).toLocaleString('de-DE', { 
      maximumFractionDigits: 0 
    });
  }
}

function calculatePerClick() {
    let power = basePerClick;

    upgrades.forEach(u => {
        if (u.bought) {
            // Le nadgradnje tipa clickMult naj povečajo osnovno moč klika
            if (u.type === "clickMult") {
                power *= u.value;
            }
            // ODSTRANJENO: autoSpeed (Turbo/Super Donkey) ne vpliva več na manual klik!
        }
    });

    power *= combo;
    
    // Če je aktiven Adrenalin, pomnoži s 3
    if (adrenalineActive) power *= 3;
    
    // Če teče Donkey Rain (tempBoost je takrat 3), pomnoži manual klik s 3
    if (tempBoost > 1) {
        power *= 3; 
    }

    return power;
}

function clickDonkey(){
  let currentPower = calculatePerClick();
  let finalGain = currentPower;
  let msg = "+" + format(finalGain);
	let currentCritMult = 1;

  // LOGIKA: Luck (Sreča)
  upgrades.filter(u => u.bought && u.type === "luck").forEach(u => {
    if (Math.random() < u.chance) {
        currentCritMult *= u.mult;
    }
  });

  if (currentCritMult > 1) {
      finalGain *= currentCritMult;
      // Ustvarimo sporočilo s skupnim multiplikatorjem (npr. x2, x5 ali x10)
      msg = `CRIT x${currentCritMult} +${format(finalGain)}`;
  }
  

	// LOGIKA: Treasure Click (Jackpot)
  if (upgrades.find(u => u.name === "Treasure Click" && u.bought)) {
      if (Math.random() < 0.01) {
          let bonus = clicks * 0.01;
          if(bonus < 1) bonus = clicks * 0.1 + 10; 
          
          finalGain += bonus;
          
          // Pokličemo efekte s številko dobitka
          triggerJackpotEffects(bonus);
          
          // Ker efekte sprožimo ročno, lahko msg pustimo prazen ali kratek
          msg = ""; 
      }
  }

  clicks += finalGain;
  
  // LOGIKA: Kombo sistem
  if (maxCombo > 1) {
      combo = Math.min(combo + 0.1, maxCombo);
      clearTimeout(comboTimer);
      comboTimer = setTimeout(() => { combo = 1; update(); }, 2000);
  }

  spawnFloating(msg);
  update();
}

// Funkcija za vizualni feedback (trzaj osla)
function animateDonkey() {
    const donkey = document.getElementById("donkey");
    donkey.classList.add("clicking");
    
    // Odstranimo razred po 50ms, da se vrne v prvotno stanje
    setTimeout(() => {
        donkey.classList.remove("clicking");
    }, 50);
}


// Onemogoči desni klik meni na CELOTNI strani
document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
});

// Poslušalec za klike (ostane podobno, le da zdaj pokriva vse gumbe/kartice)
const donkeyImg = document.getElementById("donkey");

// Posodobljeno klikanje z miško
donkeyImg.addEventListener("mousedown", function(e) {
    e.preventDefault(); 
    if (e.button === 0 || e.button === 2) {
        animateDonkey(); // Sproži animacijo
        clickDonkey();   // Dodaj denar
    }
});

// Posodobljeno klikanje za mobilnike
donkeyImg.addEventListener("touchstart", function(e) {
    e.preventDefault();
    animateDonkey(); // Sproži animacijo
    clickDonkey();   // Dodaj denar
}, {passive: false});

// POSLUŠALEC ZA TIPKOVNICO (Space, Puščica levo, Puščica desno)
// 1. Zaznavanje PRITISKA tipke (keydown)
document.addEventListener("keydown", function(e) {
    if (e.code === "Space" || e.code === "ArrowLeft" || e.code === "ArrowRight") {
        e.preventDefault();
        
        // ČE TIPKA ŠE NI PRITISNJENA (prepreči držanje)
        if (!keysPressed[e.code]) {
            keysPressed[e.code] = true; // Označimo, da je tipka zdaj pritisnjena
            
            animateDonkey();
            clickDonkey();
        }
    }
});

// 2. Zaznavanje SPROSTITVE tipke (keyup)
document.addEventListener("keyup", function(e) {
    if (e.code === "Space" || e.code === "ArrowLeft" || e.code === "ArrowRight") {
        // Ko igralec dvigne prst, tipko "odklenemo" za naslednji klik
        keysPressed[e.code] = false;
    }
});

function buyUpgrade(i) {
  let u = upgrades[i];
  if (!u.bought && clicks >= u.cost) {
    clicks -= u.cost;
    u.bought = true;

    // --- LOGIKA ZA HITROST SAMODEJNIH KMETOV ---
    if (u.type === "autoSpeed") {
        autoSpeedMultiplier *= u.value; // Stackanje: 2x * 3x = 6x hitreje
        restartAutoInterval(); // Funkcija, ki jo definiramo spodaj
    }

    if (u.type === "combo") {
      if (maxCombo === 1) maxCombo = u.value;
      else maxCombo *= u.value;
    }

		// V funkciji buyUpgrade spremeni vrstici:
    if (u.id === "rain") startRainCycle(60);       // Ob nakupu zaženi za 60s
    if (u.id === "adrenaline") startAdrenalineCycle(10); // Ob nakupu zaženi za 10s

    updateCPS();
    update();
  }
}
function restartAutoInterval() {
    // Najprej ugasnemo stari interval, če obstaja
    if (autoInterval) clearInterval(autoInterval);

    // Izračunamo nov interval (1000ms / množitelj)
    // Npr. 1000 / 2 = 500ms
    let newIntervalTime = 1000 / autoSpeedMultiplier;

    autoInterval = setInterval(() => {
        if (cps > 0) {
            clicks += cps;
            spawnFloating("+" + format(cps), true);
            update();
        }
    }, newIntervalTime);
}



function updateTimer() {
    let timerEl = document.getElementById("eventTimer");
    if (activeTimer) clearTimeout(activeTimer); // Počistimo stari timeout

    let adrEnd = parseInt(localStorage.getItem("adrenalineEndTime") || 0);
    let rainEnd = parseInt(localStorage.getItem("rainEndTime") || 0);
    let now = Date.now();

    let adrSec = Math.max(0, Math.floor((adrEnd - now) / 1000));
    let rainSec = Math.max(0, Math.floor((rainEnd - now) / 1000));

    // Če nobena stvar ne teče, skrij timer
    if (adrSec <= 0 && rainSec <= 0) {
        timerEl.innerText = "";
        document.body.classList.remove("event-active");
        adrenalineActive = false; // Za vsak slučaj ugasnemo status
        tempBoost = 1;
        return;
    }

    document.body.classList.add("event-active");

    if (adrSec > 0 && rainSec > 0) {
        timerEl.innerHTML = `<span style="color: #ff6b6b; animation: doubleGlow 1s infinite;">🔥 DOUBLE EVENT 🔥</span><br>
                             Adrenaline: ${adrSec}s | Rain: ${formatTime(rainSec)}`;
    } else if (adrSec > 0) {
        timerEl.innerText = `ADRENALINE: ${adrSec}s`;
        timerEl.style.color = "#ff6b6b";
    } else if (rainSec > 0) {
        timerEl.innerText = `DONKEY RAIN: ${formatTime(rainSec)}`;
        timerEl.style.color = "gold";
    }

    // Shranimo timeout v globalno spremenljivko activeTimer
    activeTimer = setTimeout(updateTimer, 1000);
}

// Pomožna funkcija za lepši izpis minut/sekund
function formatTime(seconds) {
  let m = Math.floor(seconds / 60);
  let s = seconds % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}


function startAdrenalineCycle(remainingSeconds = 0) {
    const activateAdrenaline = (secs = 10) => {
        adrenalineActive = true;
        localStorage.setItem("adrenalineEndTime", Date.now() + (secs * 1000));
        
        update();      // Takoj preračunaj manual click vrednost
        updateTimer(); // Takoj zaženi vidni timer

        setTimeout(() => {
            adrenalineActive = false;
            update();  // Ponastavi vrednosti po koncu
        }, secs * 1000);
    };

    if (remainingSeconds > 0) activateAdrenaline(remainingSeconds);
    setInterval(() => activateAdrenaline(10), 60000);
}

function startRainCycle(remainingSeconds = 0) {
    const activateRain = (secs = 60) => {
        tempBoost = 3;
        updateCPS();
        update(); // <--- DODANO: Takoj osveži "Manual: X" številko na zaslonu
        
        localStorage.setItem("rainEndTime", Date.now() + (secs * 1000));
        updateTimer();

        setTimeout(() => {
            tempBoost = 1;
            updateCPS();
            update(); // <--- DODANO: Takoj vrne številko na normalo po koncu dežja
        }, secs * 1000);
    };

    if (remainingSeconds > 0) activateRain(remainingSeconds);
    setInterval(() => activateRain(60), 300000);
}

function buyAuto(i){
  let a = autos[i];
  if(clicks >= a.cost){
    clicks -= a.cost;
    a.level++;
    // Povečamo ceno za 20%, a ne uporabimo Math.floor, 
    // da ne zaokrožimo na 0, če je znesek nizek.
    a.cost = a.cost * 1.2; 
    updateCPS();
    update();
  }
}

function updateCPS(){
  cps = 0;
  autos.forEach(a=> cps += a.level * a.base);
  cps *= autoMultiplier * tempBoost;
  if (adrenalineActive) cps *= 2;
}

function spawnFloating(text, isAuto = false) {
  if (!text) return;

  let el = document.createElement("div");
  el.className = "float";
  el.innerText = text;
  
  // Če sporočilo vsebuje "CRIT", dodamo razred "crit-click"
  if (text.includes("CRIT")) {
      el.classList.add("crit-click");
  }

  if (text.includes("JACKPOT")) {
      el.classList.add("jackpot");
  }

  // --- NOVA LOGIKA ZA STRANI ---
  if (isAuto) {
    // AVTOMATSKI (modri) gredo zdaj na DESNO stran
    el.style.right = "-70px"; 
    el.style.left = "auto";
    el.style.color = "#4D96FF";
  } else {
    // ROČNI (zeleni/rdeči) gredo zdaj na LEVO stran
    el.style.left = "-70px";
    el.style.right = "auto";
    
    // Če ni kritičen ali jackpot, uporabi privzeto zeleno barvo
    if (!text.includes("CRIT") && !text.includes("JACKPOT")) {
        el.style.color = "#6BCB77";
    }
  }

  document.getElementById("floating").appendChild(el);
  setTimeout(() => el.remove(), 1500);
}

function triggerJackpotEffects(bonusAmount) {
    const mainArea = document.querySelector(".main-area");
    const floatingLayer = document.getElementById("floating");

    mainArea.classList.add("jackpot-active");
    
    // Ustvarimo naslov
    let title = document.createElement("div");
    title.className = "float jackpot-title jackpot-center"; // Dodan center razred
    title.innerText = "💰 JACKPOT 💰";
    floatingLayer.appendChild(title);
    
    // Ustvarimo znesek
    let amount = document.createElement("div");
    amount.className = "float jackpot-amount jackpot-center"; // Dodan center razred
    amount.innerText = "+" + format(bonusAmount) + " €";
    floatingLayer.appendChild(amount);

    setTimeout(() => {
        mainArea.classList.remove("jackpot-active");
        title.remove();
        amount.remove();
    }, 2000);

}

function updateProgressBars() {
    // 1. Izračun za Upgrades (Manual)
    const totalUpgrades = upgrades.length;
    const boughtUpgrades = upgrades.filter(u => u.bought).length;
    const manualPercent = (boughtUpgrades / totalUpgrades) * 100;
    document.getElementById("manualProgress").style.height = manualPercent + "%";

    // 2. Izračun za Autos
    // Tukaj upoštevamo "odklenjenost" - vsak avtomat ima 1 nivo "odklenjenosti"
    // ali pa vsoto vseh levelov glede na neko ciljno številko.
    // Najbolj pregledno je: koliko različnih avtomatov si že kupil vsaj 1x.
    const totalAutos = autos.length;
    const unlockedAutos = autos.filter(a => a.level > 0).length;
    const autoPercent = (unlockedAutos / totalAutos) * 100;
    document.getElementById("autoProgress").style.height = autoPercent + "%";
}


function update() {
    perClick = calculatePerClick();
    document.getElementById("clicks").innerText = format(clicks);
    document.getElementById("perClick").innerText = format(perClick) + (combo > 1 ? " (x" + combo.toFixed(1) + ")" : "");
    document.getElementById("cps").innerText = format(cps);

    // USTVARIMO STANJE:
    // 1. Spremljamo kupljene nadgradnje in stopnje avtomatov
    // 2. Spremljamo vidnost vsakega avtomata posebej (ali je nad 1/2.5 cene)
    // 3. Spremljamo vidnost vsake nadgradnje posebej
    let currentUnlockState = upgrades.map(u => u.bought).join(",") + 
                             autos.map(a => a.level).join(",") + 
                             autos.map(a => clicks >= a.cost / 4).join(",") +
                             upgrades.map(u => clicks >= u.cost / 4).join(",");

    // Če se katerikoli prag spremeni, takoj izrišemo trgovino
    if (currentUnlockState !== lastUnlockState) {
        lastUnlockState = currentUnlockState;
        renderShops();
    }
    
    // Osvežimo samo prosojnost
    document.querySelectorAll('.card').forEach(card => {
        let cost = parseFloat(card.getAttribute('data-cost'));
        card.style.opacity = clicks >= cost ? "1" : "0.5";
    });

    updateProgressBars(); // <--- DODAJ TO VRSTICO
    save();
}

function renderShops() {
    // --- AUTO FARMERS SHOP ---
    let autoShop = document.getElementById("autoShop");
    autoShop.innerHTML = "";

    // 1. Poiščemo indeks najvišjega avtomata, ki ima level > 0
    let highestBoughtIndex = -1;
    for (let i = autos.length - 1; i >= 0; i--) {
        if (autos[i].level > 0) {
            highestBoughtIndex = i;
            break;
        }
    }

    autos.forEach((a, i) => {
        let unlockThreshold = a.cost / 4;
        
        // LOGIKA PRIKAZA:
        // - Pokažemo, če je denar nad pragom (odklepanje novih)
        // - ALI če je to prvi avtomat (da igra ne "stoji")
        // - IN hkrati mora biti indeks i večji ali enak tistemu, ki smo ga nazadnje kupili
        // (To skrije vse "stare" avtomate pod tvojim trenutnim nivojem)
        if ((clicks >= unlockThreshold || i === 0 || i <= highestBoughtIndex + 1) && i >= highestBoughtIndex) {
            let div = document.createElement("div");
            div.className = "card";
            div.setAttribute('data-cost', a.cost);
            div.onclick = () => buyAuto(i);
            div.innerHTML = `<b>${a.name}</b><br>${format(a.base)} €/s (lvl ${a.level})<br>${format(a.cost)} €`;
            autoShop.prepend(div);
        }
    });

    // --- UPGRADES SHOP --- (ostane isto kot prej)
    let upgradeShop = document.getElementById("upgradeShop");
    upgradeShop.innerHTML = "";
    let firstAvailableUpgradeFound = false;
    upgrades.forEach((u, i) => {
        let unlockThreshold = u.cost / 4;
        let isFirstAvailable = false;
        if (!u.bought && !firstAvailableUpgradeFound) {
            isFirstAvailable = true;
            firstAvailableUpgradeFound = true;
        }
        if (!u.bought && (clicks >= unlockThreshold || isFirstAvailable)) {
            let div = document.createElement("div");
            div.className = "card";
            div.setAttribute('data-cost', u.cost);
            div.onclick = () => buyUpgrade(i);
            div.innerHTML = `<b>${u.name}</b><br>${u.desc}<br>${format(u.cost)} €`;
            upgradeShop.prepend(div);
        }
    });
}

function save(){
  localStorage.setItem("donkeySave",JSON.stringify({clicks, autos, upgrades, maxCombo}));
}

function load() {
  let d = JSON.parse(localStorage.getItem("donkeySave"));
  window.onblur = function() { keysPressed = {}; };
  
  if (d) {
    clicks = d.clicks || 0;
    maxCombo = 1;

    if (d.autos) d.autos.forEach((a, i) => { 
      if (autos[i]) { autos[i].level = a.level; autos[i].cost = a.cost; } 
    });

    // Ponastavi multiplierje pred preračunom
    autoSpeedMultiplier = 1; 

    if (d.upgrades) d.upgrades.forEach((u, i) => { 
      if (upgrades[i]) {
        upgrades[i].bought = u.bought;
        
        if (upgrades[i].bought && upgrades[i].type === "combo") {
          if (maxCombo === 1) maxCombo = upgrades[i].value;
          else maxCombo *= upgrades[i].value;
        }
        if (upgrades[i].bought && upgrades[i].type === "autoSpeed") {
          autoSpeedMultiplier *= upgrades[i].value;
        }
      }
    });
    
    // Šele ko so vsi podatki naloženi, zaženemo cikle
    // Preveri Adrenalin
    if (upgrades.find(u => u.id === "adrenaline" && u.bought)) {
        let endTime = localStorage.getItem("adrenalineEndTime");
        let diff = endTime ? Math.floor((endTime - Date.now()) / 1000) : 0;
        
        if (diff > 0) {
            startAdrenalineCycle(diff); // Nadaljuj preostanek
        } else {
            startAdrenalineCycle(0);    // Samo zaženi interval (bo čakal 60s)
        }
    }

    // Preveri Rain
    if (upgrades.find(u => u.id === "rain" && u.bought)) {
        let endTime = localStorage.getItem("rainEndTime");
        let diff = endTime ? Math.floor((endTime - Date.now()) / 1000) : 0;
        
        if (diff > 0) {
            startRainCycle(diff); // Nadaljuj preostanek
        } else {
            startRainCycle(0);    // Samo zaženi interval
        }
    }
  }
  
  updateCPS();
  update(); // Osveži izpise
  restartAutoInterval(); // Pokliči ENKRAT na koncu
  updateTimer(); // DODAJ TOLE VRSTICO!
}

function resetGame(){ localStorage.clear(); location.reload(); }
function toggleTheme(){ document.body.classList.toggle("light"); }

load();
update();
