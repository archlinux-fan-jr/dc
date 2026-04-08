
let clicks = 0;
let basePerClick = 1;
let perClick = 1;
let cps = 0;
let autoMultiplier = 1;
let tempBoost = 1;

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
  {name:"Baby Donkey", base:0.1, cost:10, level:0, unlock:0},
  {name:"Farm Donkey", base:1, cost:100, level:0, unlock:50},
  {name:"Factory Donkey", base:5, cost:500, level:0, unlock:200},
  {name:"Mega Donkey", base:20, cost:2000, level:0, unlock:1000},
  {name:"Ultra Donkey", base:100, cost:10000, level:0, unlock:5000},
  {name:"God Donkey", base:500, cost:50000, level:0, unlock:20000},
  {name:"Galactic Donkey", base:2000, cost:1000000, level:0, unlock:200000},
  {name:"Quantum Donkey", base:10000, cost:50000000, level:0, unlock:10000000},
  {name:"Multiverse Donkey", base:50000, cost:1000000000, level:0, unlock:100000000},
  {name:"Portal Donkey", base:70000, cost:10000000000, level:0, unlock:1000000000},
  {name:"Atomic Donkey", base:120000, cost:50000000000, level:0, unlock:5000000000},
  {name:"Nebula Donkey", base:250000, cost:250000000000, level:0, unlock:20000000000},
  {name:"Stellar Donkey", base:500000, cost:1000000000000, level:0, unlock:100000000000},
  {name:"Cosmic Donkey", base:1200000, cost:5000000000000, level:0, unlock:500000000000},
  {name:"Eternal Donkey", base:5000000, cost:25000000000000, level:0, unlock:2000000000000},
  {name:"Infinity Donkey", base:20000000, cost:100000000000000, level:0, unlock:10000000000000},
  {name:"Singularity Donkey", base:100000000, cost:500000000000000, level:0, unlock:50000000000000},
  {name:"Omni Donkey", base:500000000, cost:2500000000000000, level:0, unlock:200000000000000},
  {name:"Legendary Donkey", base:2000000000, cost:10000000000000000, level:0, unlock:1000000000000000},
  {name:"Mythic Donkey", base:10000000000, cost:50000000000000000, level:0, unlock:5000000000000000}
];

// 1. DINAMIČNE NADGRADNJE
let upgrades = [
  { name: "Double Click", desc: "x2 manual click", cost: 100, bought: false, type: "clickMult", value: 2 },
  { name: "Triple Click", desc: "x3 manual click", cost: 200, bought: false, type: "clickMult", value: 3 },
  { name: "Ultra Click", desc: "x4 manual click", cost: 1000, bought: false, type: "clickMult", value: 4 },
  { name: "Mega Click", desc: "x5 manual click", cost: 5000, bought: false, type: "clickMult", value: 5 },
  { name: "Donkey rain", desc: "x3 farm every 10 mins for 2 mins", cost: 1000000, bought: false, type: "special", id: "rain" },
  
  // LOGIKA ZA SREČO (Luck)
  { name: "Lucky Hoof", desc: "10% chance for 2x click", cost: 5000, bought: false, type: "luck", chance: 0.1, mult: 2 },
  { name: "Divine Hoof", desc: "50% chance for 5x click", cost: 500000, bought: false, type: "luck", chance: 0.5, mult: 5 },

  // ADRENALIN (Časovni boosti)
  { name: "Adrenaline", desc: "Clicks x3 for 5s every 30s", cost: 75000, bought: false, type: "special", id: "adrenaline" },

  // PASIVNO POVEČANJE GLEDE NA AVTOMATE
  { name: "Heavy Hands", desc: "+1 per click for every 10 autos", cost: 20000, bought: false, type: "scaling", value: 1 },

  // KOMBO SISTEM
  { name: "Combo Starter", desc: "Clicks stack combo (max x5)", cost: 25000, bought: false, type: "special", id: "combo5" },

  // TREASURE CLICK (% od trenutnega denarja)
  { name: "Treasure Click", desc: "1% chance to gain 1% of bank", cost: 100000, bought: false, type: "special", id: "treasure" }
];


function format(n){
  if(n>=1e12) return (n/1e12).toFixed(2)+"T";
  if(n>=1e9) return (n/1e9).toFixed(2)+"B";
  if(n>=1e6) return (n/1e6).toFixed(2)+"M";
  if(n>=1e3) return (n/1e3).toFixed(2)+"K";
  return Math.floor(n).toString();
}

// 2. DINAMIČEN IZRAČUN MOČI KLIKA
function calculatePerClick() {
  let power = basePerClick;

  // Upoštevaj vse kupljene multiplikatorje
  upgrades.forEach(u => {
    if (u.bought && u.type === "clickMult") power *= u.value;
    if (u.bought && u.type === "scaling") {
        let totalAutos = autos.reduce((sum, a) => sum + a.level, 0);
        power += Math.floor(totalAutos / 10) * u.value;
    }
  });

  // Kombo in Adrenalin
  power *= combo;
  if (adrenalineActive) power *= 3;

  return power;
}

function clickDonkey(){
  let currentPower = calculatePerClick();
  let finalGain = currentPower;
  let msg = "+" + format(finalGain);

  // LOGIKA: Luck (Sreča)
  upgrades.filter(u => u.bought && u.type === "luck").forEach(u => {
    if (Math.random() < u.chance) {
        finalGain *= u.mult;
        msg = "CRIT! +" + format(finalGain);
    }
  });

  // LOGIKA: Treasure Click (1% možnost za 1% banke)
  if (upgrades.find(u => u.name === "Treasure Click" && u.bought)) {
      if (Math.random() < 0.01) {
          let bonus = clicks * 0.01;
          finalGain += bonus;
          msg = "JACKPOT! +" + format(finalGain);
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

function buyUpgrade(i){
  let u = upgrades[i];
  if(!u.bought && clicks >= u.cost){
    clicks -= u.cost;
    u.bought = true;

    // Aktiviraj posebne logike ob nakupu
    if (u.id === "rain") startRainCycle();
    if (u.id === "adrenaline") startAdrenalineCycle();
    if (u.id === "combo5") maxCombo = 5;

    updateCPS();
    update();
  }
}

// SPECIAL EVENTI
function startRainCycle(){
  setInterval(()=>{
    tempBoost = 3;
    updateCPS();
    setTimeout(()=>{ tempBoost = 1; updateCPS(); }, 120000);
  }, 600000);
}

function startAdrenalineCycle() {
  setInterval(() => {
    adrenalineActive = true;
    setTimeout(() => { adrenalineActive = false; }, 5000);
  }, 300000); // vsakih 30s (skrajšano za testiranje)
}

function buyAuto(i){
  let a = autos[i];
  if(clicks>=a.cost){
    clicks -= a.cost;
    a.level++;
    a.cost = Math.floor(a.cost*1.2);
    updateCPS();
    update();
  }
}

function updateCPS(){
  cps = 0;
  autos.forEach(a=> cps += a.level * a.base);
  cps *= autoMultiplier * tempBoost;
}

function spawnFloating(text){
  let el=document.createElement("div");
  el.className="float";
  el.innerText=text;
  document.getElementById("floating").appendChild(el);
  setTimeout(()=>el.remove(),1000);
}

function update(){
  perClick = calculatePerClick(); // Osveži vrednost za prikaz
  document.getElementById("clicks").innerText=format(clicks);
  document.getElementById("perClick").innerText=format(perClick) + (combo > 1 ? " (x" + combo.toFixed(1) + ")" : "");
  document.getElementById("cps").innerText=format(cps);

  let autoShop=document.getElementById("autoShop");
  autoShop.innerHTML="";
  autos.forEach((a,i)=>{
    if(clicks>=a.unlock || a.level > 0){
      let div=document.createElement("div");
      div.className="card";
      div.onclick=()=>buyAuto(i);
      div.innerHTML=`<b>${a.name}</b><br>${a.base}€/s (lvl ${a.level})<br>${format(a.cost)} €`;
      autoShop.appendChild(div);
    }
  });

  let upgradeShop=document.getElementById("upgradeShop");
  upgradeShop.innerHTML="";
  upgrades.forEach((u,i)=>{
    if(!u.bought){
      let div=document.createElement("div");
      div.className="card";
      div.onclick=()=>buyUpgrade(i);
      div.innerHTML=`<b>${u.name}</b><br>${u.desc}<br>${format(u.cost)} €`;
      upgradeShop.appendChild(div);
    }
  });
  save();
}

setInterval(()=>{
  clicks+=cps;
  update();
},1000);

function save(){
  localStorage.setItem("donkeySave",JSON.stringify({clicks, autos, upgrades, maxCombo}));
}

function load(){
  let d=JSON.parse(localStorage.getItem("donkeySave"));
  if(d){
    clicks=d.clicks||0;
    if(d.autos) d.autos.forEach((a,i)=> { if(autos[i]) autos[i].level = a.level; autos[i].cost = a.cost; });
    if(d.upgrades) d.upgrades.forEach((u,i)=> { if(upgrades[i]) upgrades[i].bought = u.bought; });
    maxCombo = d.maxCombo || 1;
    
    // Ponovno zaženi cikle, če so kupljeni
    if(upgrades.find(u=>u.id==="rain" && u.bought)) startRainCycle();
    if(upgrades.find(u=>u.id==="adrenaline" && u.bought)) startAdrenalineCycle();
  }
  updateCPS();
}

function resetGame(){ localStorage.clear(); location.reload(); }
function toggleTheme(){ document.body.classList.toggle("light"); }

load();
update();
