const ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 12;
const STRONG_ATTACK_VALUE = 20;
const HEAL_VALUE = 20;
const enteredValue = parseInt(prompt("Maximum life for you and the monster.", "100"));
const MODE_ATTACK = "ATTACK";
const MODE_STRONG_ATTACK = "STRONG_ATTACK";

const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

let chosenMaxLife = enteredValue;

if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
    chosenMaxLife = 100;
}
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;
let battleLog = [];
let lastLoggedEntry;
adjustHealthBars(chosenMaxLife);

function writeToLog(evnt, val, monsterHealth, playerHealth) {
    let logEntry = {
        event: evnt,
        value: val,
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
    };

    switch (evnt) {
        case LOG_EVENT_PLAYER_ATTACK:
            logEntry.target = "MONSTER"; break;
        case LOG_EVENT_PLAYER_STRONG_ATTACK:
            logEntry.target = "MONSTER"; break;
        case LOG_EVENT_MONSTER_ATTACK:
            logEntry.target = "PLAYER"; break;
        case LOG_EVENT_PLAYER_HEAL:
            logEntry.target = "PLAYER"; break;
        case LOG_EVENT_GAME_OVER:
            logEntry = {
                event: evnt,
                value: val,
                finalMonsterHealth: monsterHealth,
                finalPlayerHealth: playerHealth
            }; break;
        default: logEntry = {};


    }

    // if (evnt === LOG_EVENT_PLAYER_ATTACK) {

    // } else if (evnt === LOG_EVENT_PLAYER_STRONG_ATTACK) {
    //     logEntry = {
    //         event: evnt,
    //         value: val,
    //         target: "MONSTER",
    //         finalMonsterHealth: monsterHealth,
    //         finalPlayerHealth: playerHealth

    //     };

    // } else if (evnt === LOG_EVENT_MONSTER_ATTACK) {
    //     logEntry = {
    //         event: evnt,
    //         value: val,
    //         target: "PLAYER",
    //         finalMonsterHealth: monsterHealth,
    //         finalPlayerHealth: playerHealth

    //     };

    // } else if (evnt === LOG_EVENT_PLAYER_HEAL) {
    //     logEntry.target = "PLAYER";
    // }
    // else if (evnt === LOG_EVENT_GAME_OVER) {
    //     logEntry = {
    //         event: evnt,
    //         value: val,
    //         finalMonsterHealth: monsterHealth,
    //         finalPlayerHealth: playerHealth

    //     };

    // }

    battleLog.push(logEntry);
}



function reset() {
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
}


function endRound() {
    const initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;

    writeToLog(LOG_EVENT_MONSTER_ATTACK,
        playerDamage,
        currentMonsterHealth,
        currentPlayerHealth
    );


    if (currentPlayerHealth <= 0 && hasBonusLife) {
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth);
        alert("You would be dead but bonus life saved you.");

    }

    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert("Congrats!You won. You defeated the monster!!");
        writeToLog(LOG_EVENT_GAME_OVER,
            "PLAYER WON",
            currentMonsterHealth,
            currentPlayerHealth
        );
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        alert("OOps! You lost. The monster won.");
        writeToLog(LOG_EVENT_GAME_OVER,
            "MONSTER WON",
            currentMonsterHealth,
            currentPlayerHealth
        );
    } else if (currentMonsterHealth <= 0 && currentMonsterHealth <= 0) {
        alert("You have a draw.!");
        writeToLog(LOG_EVENT_GAME_OVER,
            "A DRAW",
            currentMonsterHealth,
            currentPlayerHealth
        );
    }

    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0 ||
        currentPlayerHealth <= 0 && currentMonsterHealth > 0 ||
        currentMonsterHealth <= 0 && currentMonsterHealth <= 0) {

        reset();
    }

}

function attackMonster(mode) {
    let maxDamage;
    let logEvent;
    if (mode === MODE_ATTACK) {
        maxDamage = ATTACK_VALUE;
        logEvent = LOG_EVENT_PLAYER_ATTACK;
    } else {
        maxDamage = STRONG_ATTACK_VALUE;
        logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
    }

    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;

    writeToLog(logEvent,
        damage,
        currentMonsterHealth,
        currentPlayerHealth
    );
    endRound();

}
function normalAttack() {
    attackMonster(MODE_ATTACK);
}

function strongAttack() {
    attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerHandler() {
    let healValue;
    if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
        alert("You can't heal to more than max initial health.");
        healValue = chosenMaxLife - currentPlayerHealth;
    } else {
        healValue = HEAL_VALUE;
    }
    increasePlayerHealth(healValue);
    currentPlayerHealth += healValue;

    writeToLog(
        LOG_EVENT_PLAYER_HEAL,
        healValue,
        currentMonsterHealth,
        currentPlayerHealth
    );
    endRound();

}


function printLogHandler() {
let i=0;
console.log("<------------------------------------->");

   for(const logItem of battleLog){
       console.log(`#${i}`);
       for(const key in logItem){
           console.log(key.toUpperCase()+" : "+logItem[key]+"\n");
        //    console.log(logItem[key]);
       }
       console.log("<------------------------------------->");
       i++;
   }


}


attackBtn.addEventListener("click", normalAttack);
strongAttackBtn.addEventListener("click", strongAttack);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);