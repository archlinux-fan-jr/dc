let clicks = 0;
let perClick = 1;
let cps = 0;
let autoMultiplier = 1;
let tempBoost = 1;

// RAIN EVENT
let rainUnlocked = false;
function startRainCycle(){
  rainUnlocked = true;

  setInterval(()=>{
    tempBoost = 3;
    updateCPS();

    setTimeout(()=>{
      tempBoost = 1;
      updateCPS();
    },120000); // active 2 min

  },1200000); // every 20 min
}



// AUTOS
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
// UPGRADES
let upgrades = [
  {name:"Double Click", desc:"x2 manual", cost:200, bought:false},
  {name:"Triple Click", desc:"x3 manual", cost:1000, bought:false},
  {name:"Ultra Click", desc:"x5 manual", cost:5000, bought:false},
  {name:"Mega Click", desc:"x7 manual", cost:15000, bought:false},
  {name:"Hyper Click", desc:"x10 manual", cost:100000, bought:false},
  {name:"Quantum Click", desc:"x25 manual", cost:1000000, bought:false},
  {name:"God Finger", desc:"x100 manual", cost:10000000, bought:false},

  {name:"Lucky Hoof", desc:"10% chance for 2x click", cost:5000, bought:false},
  {name:"Golden Hoof", desc:"25% chance for 3x click", cost:50000, bought:false},
  {name:"Divine Hoof", desc:"50% chance for 5x click", cost:500000, bought:false},

  {name:"Adrenaline", desc:"Clicks are x3 for 5 sec every 30 sec", cost:75000, bought:false},
  {name:"Overdrive", desc:"Clicks are x10 for 3 sec every 30 sec", cost:500000, bought:false},

  {name:"Heavy Hands", desc:"+1 per click per 10 autos owned", cost:20000, bought:false},
  {name:"Steel Hands", desc:"+5 per click per 10 autos owned", cost:150000, bought:false},

  {name:"Combo Starter", desc:"Clicks stack combo (max x5)", cost:25000, bought:false},
  {name:"Combo Master", desc:"Max combo increased to x10", cost:200000, bought:false},

  {name:"Treasure Click", desc:"1% chance to gain 1% of current money", cost:100000, bought:false},
  {name:"Jackpot Click", desc:"0.1% chance to gain 10% of current money", cost:1000000, bought:false},

  {name:"Momentum", desc:"+1% click power every second (resets on click)", cost:300000, bought:false},
  {name:"Patience", desc:"No click for 10s → next click x20", cost:750000, bought:false},

  {name:"Donkey Rage", desc:"Spam clicking increases power (caps at x15)", cost:200000, bought:false},
  {name:"Lazy Bonus", desc:"Click slower → stronger clicks", cost:200000, bought:false},

  {name:"Reality Break", desc:"Clicks scale with total money (log boost)", cost:5000000, bought:false},
  {name:"Singularity Tap", desc:"Clicks gain +0.01% of total earned", cost:20000000, bought:false}
];

function format(n){
  if(n>=1e12) return Math.floor(n/1e12)+"T";
  if(n>=1e9) return Math.floor(n/1e9)+"B";
  if(n>=1e6) return Math.floor(n/1e6)+"M";
  if(n>=1e3) return Math.floor(n/1e3)+"K";
  return Math.floor(n);
}

function clickDonkey(){
  clicks += perClick;
  spawnFloating("+"+format(perClick));
  update();
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

function buyUpgrade(i){
  let u = upgrades[i];
  if(u.bought) return;
  if(clicks>=u.cost){
    clicks -= u.cost;
    u.bought = true;

    if(i===0) perClick*=2;
    if(i===1) perClick*=3;
    if(i===2) perClick*=5;

    if(i===3) autoMultiplier*=2;
    if(i===4) autoMultiplier*=5;
    if(i===5) autoMultiplier*=10;

    if(i===6) startRainCycle();

    updateCPS();
    update();
  }
}

function spawnFloating(text){
  let el=document.createElement("div");
  el.className="float";
  el.innerText=text;
  document.getElementById("floating").appendChild(el);
  setTimeout(()=>el.remove(),1000);
}

function update(){
  document.getElementById("clicks").innerText=format(clicks);
  document.getElementById("perClick").innerText=format(perClick);
  document.getElementById("cps").innerText=format(cps);

  let autoShop=document.getElementById("autoShop");
  autoShop.innerHTML="";

  autos.forEach((a,i)=>{
    if(clicks>=a.unlock){
      let div=document.createElement("div");
      div.className="card";
      div.onclick=()=>buyAuto(i);
      div.innerHTML=`<b>${a.name}</b><br>${a.base}/s (lvl ${a.level})<br>${format(a.cost)}`;
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
      div.innerHTML=`<b>${u.name}</b><br>${u.desc}<br>${format(u.cost)}`;
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
  localStorage.setItem("save",JSON.stringify({clicks,perClick,autos,upgrades,autoMultiplier}));
}

function load(){
  let d=JSON.parse(localStorage.getItem("save"));
  if(d){
    clicks=d.clicks||0;
    perClick=d.perClick||1;
    autos=d.autos||autos;
    upgrades=d.upgrades||upgrades;
    autoMultiplier=d.autoMultiplier||1;
  }
  updateCPS();
}

function resetGame(){ localStorage.clear(); location.reload(); }
function toggleTheme(){ document.body.classList.toggle("light"); }

load();
update();
