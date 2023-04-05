class Weapon {
    constructor(name, attack, speed, weight) {
        this.name = name;
        this.atk = attack;
        this.speed = speed;
        this.weight = weight;
        this.damageType = '';
    }
}
class Sword extends Weapon {
    constructor(...args) {
        super(...args);
        this.damageType = 'slashing';
    }
}
class Club extends Weapon {
    constructor(...args) {
        super(...args);
        this.damageType = 'blunt';
    }
}
class Spear extends Weapon {
    constructor(...args) {
        super(...args);
        this.damageType = 'piercing';
    }
}
class Bow extends Weapon {
    constructor(...args) {
        super(...args);
        this.damageType = 'projectile';
    }
}

class Armor {
    constructor(name, armor, weight, value) {
        this.name = name;
        this.armor = armor;
        this.weight = weight;
        this.value = value;
        this.slot = '';
    }
}
class Helmet extends Armor {
    constructor(...args) {
        super(...args);
        this.slot = 'Helmet';
    }
}
class Body extends Armor {
    constructor(...args) {
        super(...args);
        this.slot = 'Body';
    }
}
class Legs extends Armor {
    constructor(...args) {
        super(...args);
        this.slot = 'Legs';
    }
}
class Feet extends Armor {
    constructor(...args) {
        super(...args);
        this.slot = 'Feet';
    }
}
class Trinket extends Armor {
    constructor(...args) {
        super(...args);
        this.slot = 'Trinket';
    }
}
class Shield extends Armor {
    constructor(...args) {
        super(...args);
        this.slot = 'Off-Hand';
    }
}

class Enemy {
    constructor(health, mana, attack, armor, experience, posX, posY) {
        this.name = '';
        this.health = health;
        this.mana = mana;
        this.attack = attack;
        this.armor = armor;
        this.experience = experience;
        this.loot = {};
        this.posX = posX;
        this.posY = posY;
    }
}
class Goblin extends Enemy {
    constructor(...args) {
        super(...args);
        this.name = 'Goblin'
        this.health = 100;
        this.mana = 20;
        this.attack = 5;
        this.armor = 10;
        this.experience = 1000;
        this.loot = {
            'Gold': { dropChance: .9, minDrop: 10, maxDrop: 99 },
            'Goblin Cheese': { dropChance: .5, minDrop: 1, maxDrop: 2 },
            'Goblin Mail': { dropChance: .1, minDrop: 1, maxDrop: 1 }
        };
    }
    attackTarget(target) {
        if (target instanceof Player) {
            let hitChance = Math.random() * 1;
            let fullDmg = Math.floor(this.attack + (Math.random() * this.attack) * 2);
            let blockedDmg = Math.floor((Math.random() * (this.attack / 2)) + this.attack / 2);
            if (hitChance >= .25) {
                target.health -= fullDmg;
                return `Attacked by ${this.name} for ${fullDmg} damage!`;
            }
            if (hitChance >= .15) {
                target.health -= blockedDmg;
                return `Attack from ${this.name} was blocked for ${blockedDmg} damage!`
            }
            return `${this.name} missed!`
        }
    }
    getLoot() {
        const lootGenerated = {};
        for (let item of Object.keys(this.loot)) {
            let chance = Math.random();
            let min = this.loot[item].minDrop;
            let max = this.loot[item].maxDrop;
            if (chance >= 1 - this.loot[item].dropChance) {
                lootGenerated[item] = Math.floor(Math.random() * (max - min + 1)) + min;
            }
        }
        return lootGenerated;
    }
}

class Player {
    constructor(name, health, mana, exp, level, inventory, posX, posY, helmet, body, legs, feet, waist, trinket1, trinket2, weapon, shield, ammo) {
        this.name = name || 'Player';
        this.health = health || 400;
        this.mana = mana || 200;
        this.exp = exp || 0;
        this.level = level || 1;
        this.inventory = inventory || {};
        this.posX = posX;
        this.posY = posY;
        this.helmet = helmet || new Helmet('Leather Helmet', 5, 20, 200);
        this.body = body || new Body('Leather Armor', 5, 20, 200);
        this.legs = legs || new Legs('Leather Legs', 5, 20, 200);
        this.feet = feet || new Feet('Leather Boots', 5, 20, 200);
        this.waist = waist;
        this.trinket1 = trinket1;
        this.trinket2 = trinket2;
        this.weapon = weapon || new Sword('Fire Sword', 22, 2, 25.5);
        this.shield = shield || new Shield('Beholder Shield', 25, 20, 200);
        this.ammo = ammo;
    }
    addExp(expAmount) {
        const expTable = [0, 500, 1500, 3000, 5000, 7500, 10500, 14000]
        this.exp += expAmount;
        for (let expThreshhold of expTable) {
            if (this.exp >= expTable[this.level]) {
                this.levelUp();
            }
        }
    }
    levelUp() {
        this.level++;
        console.log(`You have leveled up from ${this.level - 1} to ${this.level}!`);
    }
    attackTarget(target) {
        if (target instanceof Enemy && target.health !== 0) {
            let hitChance = Math.random() * 1;
            let fullDmg = Math.floor(this.weapon.atk + (Math.random() * this.weapon.atk) * 2);
            let blockedDmg = Math.floor((Math.random() * (this.weapon.atk / 2)) + this.weapon.atk / 2);
            if (target.health - fullDmg <= 0) {
                let deathDamage = target.health;
                target.health = 0;
                this.addExp(target.experience);
                //target.hasDied();
                let loot = target.getLoot();
                for (let key of Object.keys(loot)) {
                    this.inventory[key] = (this.inventory[key] || 0) + loot[key];
                }
                console.log(this.inventory);
                return `${target.name} was slain by your attack of ${deathDamage}!`;
            }
            if (hitChance >= .25) {
                target.health -= fullDmg;
                return `Attacked ${target.name} for ${fullDmg} ${this.weapon.damageType} damage!`;
            }
            if (hitChance >= .15) {
                target.health -= blockedDmg;
                return `Attack on ${target.name} was blocked for ${blockedDmg} ${this.weapon.damageType} damage!`
            }
            return `You missed!`
        }
        return 'Invalid Target!'
    }
}

const backgroundImage = new Image();
backgroundImage.onload = () => {
    resizeCanvas();
}
backgroundImage.src = '/images/battleMap1.png';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let backgroundImageWidth = 0;
let backgroundImageHeight = 0;

function resizeCanvas() {
    // Calculate the canvas size based on the aspect ratio of the background image
    const aspectRatio = backgroundImage.width / backgroundImage.height;
    let canvasHeight = Math.min(window.innerHeight, backgroundImage.height);
    let canvasWidth = Math.min(canvasHeight * aspectRatio, window.innerWidth);

    // Constrain the canvas width to the window width
    if (canvasWidth > window.innerWidth) {
        canvasWidth = window.innerWidth;
    }

    // Set the canvas size
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Save the background image dimensions
    backgroundImageWidth = canvasWidth;
    backgroundImageHeight = canvasHeight;


    // Calculate the position to center the canvas in the window with 8px of space on the left
    const canvasOffsetX = (window.innerWidth - canvasWidth) / 2 - 8;
    const canvasOffsetY = (window.innerHeight - canvasHeight) / 2 - 8;

    // Set the canvas position
    canvas.style.left = canvasOffsetX + "px";
    canvas.style.top = canvasOffsetY + "px";

    // Draw the background image on the canvas
    drawBackgroundImage(ctx, backgroundImage, backgroundImageWidth, backgroundImageHeight);

    // Calculate the player position relative to the background image
    const playerImage = new Image();
    playerImage.src = '/images/player.png';
    playerImage.onload = () => {
        const playerWidth = backgroundImageHeight / 6;
        const playerHeight = playerWidth;
        const scaleFactor = canvasWidth / backgroundImage.width;
        const playerXOffset = 280 * scaleFactor;
        const playerYOffset = -150 * scaleFactor;
        const playerX = Math.floor((backgroundImageWidth / 2)) - playerXOffset;
        const playerY = Math.floor((backgroundImageHeight / 2)) - playerYOffset;

        // Draw the player image on the canvas
        ctx.drawImage(playerImage, playerX, playerY, playerWidth, playerHeight);
    };
}

function drawBackgroundImage(ctx, backgroundImage, canvasWidth, canvasHeight) {
    const imageAspectRatio = backgroundImage.width / backgroundImage.height;
    const canvasAspectRatio = canvasWidth / canvasHeight;
    let renderWidth, renderHeight, xStart, yStart;

    if (imageAspectRatio < canvasAspectRatio) {
        renderWidth = canvasHeight * imageAspectRatio;
        renderHeight = canvasHeight;
        xStart = (canvasWidth - renderWidth) / 2;
        yStart = 0;
    } else if (imageAspectRatio > canvasAspectRatio) {
        renderWidth = canvasWidth;
        renderHeight = canvasWidth / imageAspectRatio;
        xStart = 0;
        yStart = (canvasHeight - renderHeight) / 2;
    } else {
        renderWidth = canvasWidth;
        renderHeight = canvasHeight;
        xStart = 0;
        yStart = 0;
    }

    ctx.drawImage(backgroundImage, xStart, yStart, renderWidth, renderHeight);
}

// Resize the canvas when the window size changes
window.addEventListener('resize', resizeCanvas);

// Resize the canvas initially
resizeCanvas();









const player1 = new Player();
const enemy1 = new Goblin();
const enemy2 = new Goblin();
const enemy3 = new Goblin();
const enemy4 = new Goblin();
const enemy5 = new Goblin();