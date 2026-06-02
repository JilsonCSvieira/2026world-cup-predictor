const matchSelect = document.getElementById("matchSelect");
const predictBtn = document.getElementById("predictBtn");
const groupFilter = document.getElementById("groupFilter");
const simulateBtn = document.getElementById("simulateBtn");
const standingsDiv = document.getElementById("standings");
const worldCupBtn = document.getElementById("worldCupBtn");
const worldCupOutput = document.getElementById("worldCupOutput");

const winner = document.getElementById("winner");
const chance = document.getElementById("chance");
const reason = document.getElementById("reason");

const matchInfo = document.getElementById("matchInfo");
const teamScores = document.getElementById("teamScores");
const championCardTitle = document.getElementById("championCardTitle");
const championCardIcon = document.getElementById("championCardIcon");
const championCardName = document.getElementById("championCardName");
const championCardSubtitle = document.getElementById("championCardSubtitle");

let matches = [];
let teams = [];
const flagCodes = {
    "Argentina": "ar",
    "Brazil": "br",
    "France": "fr",
    "Spain": "es",
    "England": "gb-eng",
    "Portugal": "pt",
    "Germany": "de",
    "Netherlands": "nl",
    "Belgium": "be",
    "Croatia": "hr",
    "Morocco": "ma",
    "Uruguay": "uy",
    "Colombia": "co",
    "Senegal": "sn",
    "Switzerland": "ch",
    "USA": "us",
    "Mexico": "mx",
    "Canada": "ca",
    "Japan": "jp",
    "South Korea": "kr",
    "Australia": "au",
    "Türkiye": "tr",
    "Qatar": "qa",
    "Norway": "no",
    "Scotland": "gb-sct",
    "Egypt": "eg",
    "Ivory Coast": "ci",
    "Algeria": "dz",
    "Czechia": "cz",
    "Tunisia": "tn",
    "Paraguay": "py",
    "South Africa": "za",
    "Saudi Arabia": "sa",
    "Panama": "pa",
    "Ghana": "gh",
    "Bosnia and Herzegovina": "ba",
    "Iraq": "iq",
    "Uzbekistan": "uz",
    "New Zealand": "nz",
    "Jordan": "jo",
    "Congo DR": "cd",
    "Haiti": "ht",
    "Cape Verde": "cv",
    "Curaçao": "cw",
    "Sweden": "se",
    "Iran": "ir",
    "Austria": "at",
    "Ecuador": "ec",
};

function getFlagImg(teamName) {
    const code = flagCodes[teamName];

    console.log("Flag test:", teamName, code);

    if (!code) {
        return "";
    }

    return `<img class="flag-img" src="https://flagcdn.com/w40/${code}.png" alt="${teamName} flag">`;
}

fetch("../data/matches.json")
    .then(response => response.json())
    .then(data => {
        matches = data;
        loadMatches();
    });

fetch("../data/teams.json")
    .then(response => response.json())
    .then(data => {
        teams = data;
    });

groupFilter.addEventListener("change", function () {
    loadMatches();
});

function loadMatches() {
    matchSelect.innerHTML = "";

    const selectedGroup = groupFilter.value;

    matches.forEach((match, index) => {
        if (selectedGroup === "All" || match.group === selectedGroup) {
            const option = document.createElement("option");
            option.value = index;
            option.textContent = `Match ${match.matchNumber}: ${match.teamA} vs ${match.teamB} - Group ${match.group}`;
            matchSelect.appendChild(option);
        }
    });
}

function findTeam(teamName) {
    return teams.find(team => team.name === teamName);
}

function getTotalScore(team) {
    return team.rankingScore + team.squadStrength + team.worldCupHistory + team.homeAdvantage;
}

predictBtn.addEventListener("click", function () {
    const selectedIndex = matchSelect.value;
    const match = matches[selectedIndex];

    const teamA = findTeam(match.teamA);
    const teamB = findTeam(match.teamB);

    const teamAScore = getTotalScore(teamA);
    const teamBScore = getTotalScore(teamB);

    const teamAChance = (teamAScore / (teamAScore + teamBScore)) * 100;
    const teamBChance = (teamBScore / (teamAScore + teamBScore)) * 100;

    let predictedWinner = "Draw";

    if (teamAScore > teamBScore) {
        predictedWinner = teamA.name;
    } else if (teamBScore > teamAScore) {
        predictedWinner = teamB.name;
    }

    let predictionReason = "";

    const rankingDifference = teamA.rankingScore - teamB.rankingScore;
    const squadDifference = teamA.squadStrength - teamB.squadStrength;
    const historyDifference = teamA.worldCupHistory - teamB.worldCupHistory;
    const chanceDifference = Math.abs(teamAChance - teamBChance);

    if (chanceDifference < 5) {
        predictionReason = "This is a very close match. Both teams have similar overall ratings.";
    }
    else if (rankingDifference > 10 && squadDifference > 10) {
        predictionReason = `${teamA.name} has a stronger FIFA ranking and better squad depth.`;
    }
    else if (rankingDifference < -10 && squadDifference < -10) {
        predictionReason = `${teamB.name} has a stronger FIFA ranking and better squad depth.`;
    }
    else if (squadDifference > 10) {
        predictionReason = `${teamA.name} has stronger squad quality, which gives them an important advantage.`;
    }
    else if (squadDifference < -10) {
        predictionReason = `${teamB.name} has stronger squad quality, which gives them an important advantage.`;
    }
    else if (historyDifference > 10) {
        predictionReason = `${teamA.name} has stronger World Cup history and tournament experience.`;
    }
    else if (historyDifference < -10) {
        predictionReason = `${teamB.name} has stronger World Cup history and tournament experience.`;
    }
    else if (teamA.homeAdvantage > 0) {
        predictionReason = `${teamA.name} receives a small host-nation advantage.`;
    }
    else if (teamB.homeAdvantage > 0) {
        predictionReason = `${teamB.name} receives a small host-nation advantage.`;
    }
    else {
        predictionReason = "The prediction is based on a balanced evaluation of ranking, squad strength, tournament history, and home advantage.";
    }

    matchInfo.textContent = `Match ${match.matchNumber}: ${match.teamA} vs ${match.teamB}`;
    winner.textContent = `Predicted Winner: ${predictedWinner}`;
    chance.textContent = `${teamA.name}: ${teamAChance.toFixed(1)}% | ${teamB.name}: ${teamBChance.toFixed(1)}%`;
    teamScores.textContent = `Team Scores: ${teamA.name} ${teamAScore} - ${teamB.name} ${teamBScore}`;
    reason.textContent = `Reason: ${predictionReason}`;
});

function simulateMatch(teamA, teamB) {
    const teamAScore = getTotalScore(teamA);
    const teamBScore = getTotalScore(teamB);

    const scoreDifference = Math.abs(teamAScore - teamBScore);

    let favorite;
    let underdog;

    if (teamAScore >= teamBScore) {
        favorite = "teamA";
        underdog = "teamB";
    } else {
        favorite = "teamB";
        underdog = "teamA";
    }

    let favoriteChance;
    let drawChance;
    let underdogChance;

    if (scoreDifference >= 60) {
        favoriteChance = 0.90;
        drawChance = 0.07;
        underdogChance = 0.03;
    } else if (scoreDifference >= 35) {
        favoriteChance = 0.78;
        drawChance = 0.14;
        underdogChance = 0.08;
    } else if (scoreDifference >= 15) {
        favoriteChance = 0.65;
        drawChance = 0.22;
        underdogChance = 0.13;
    } else {
        favoriteChance = 0.48;
        drawChance = 0.30;
        underdogChance = 0.22;
    }

    const randomNumber = Math.random();

    if (randomNumber < favoriteChance) {
        return favorite;
    } else if (randomNumber < favoriteChance + drawChance) {
        return "draw";
    } else {
        return underdog;
    }
}

simulateBtn.addEventListener("click", function () {
    const standings = {};

    matches.forEach(match => {
        if (!standings[match.group]) {
            standings[match.group] = {};
        }

        const teamA = findTeam(match.teamA);
        const teamB = findTeam(match.teamB);

        if (!standings[match.group][teamA.name]) {
            standings[match.group][teamA.name] = createStanding(teamA.name);
        }

        if (!standings[match.group][teamB.name]) {
            standings[match.group][teamB.name] = createStanding(teamB.name);
        }

        const teamAScore = getTotalScore(teamA);
        const teamBScore = getTotalScore(teamB);

    const result = simulateMatch(teamA, teamB);

if (result === "teamA") {
    standings[match.group][teamA.name].points += 3;
    standings[match.group][teamA.name].wins += 1;
    standings[match.group][teamB.name].losses += 1;
}
else if (result === "teamB") {
    standings[match.group][teamB.name].points += 3;
    standings[match.group][teamB.name].wins += 1;
    standings[match.group][teamA.name].losses += 1;
}
else {
    standings[match.group][teamA.name].points += 1;
    standings[match.group][teamB.name].points += 1;
    standings[match.group][teamA.name].draws += 1;
    standings[match.group][teamB.name].draws += 1;
}    
        standings[match.group][teamA.name].played += 1;
        standings[match.group][teamB.name].played += 1;
    });

    displayStandings(standings);
});
function createStanding(teamName) {
    return {
        team: teamName,
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        points: 0
    };
}

function displayStandings(standings) {
    standingsDiv.innerHTML = "";

    const groups = Object.keys(standings).sort();

    groups.forEach(group => {
        const groupTitle = document.createElement("h3");
        groupTitle.textContent = `🏆 Group ${group}`;
        standingsDiv.appendChild(groupTitle);

        const table = document.createElement("table");

        table.innerHTML = `
            <tr>
                <th>Team</th>
                <th>MP</th>
                <th>W</th>
                <th>D</th>
                <th>L</th>
                <th>Pts</th>
            </tr>
        `;

        const teamsArray = Object.values(standings[group]);

    teamsArray.sort((a, b) => {
        if (b.points !== a.points) {
            return b.points - a.points;
    }

        if (b.wins !== a.wins) {
            return b.wins - a.wins;
    }

    const teamAStrength = getTotalScore(findTeam(a.team));
    const teamBStrength = getTotalScore(findTeam(b.team));

    return teamBStrength - teamAStrength;
});

        teamsArray.forEach(team => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${getFlagImg(team.team)} ${team.team}</td>
                <td>${team.played}</td>
                <td>${team.wins}</td>
                <td>${team.draws}</td>
                <td>${team.losses}</td>
                <td>${team.points}</td>
            `;

            table.appendChild(row);
        });

        standingsDiv.appendChild(table);
    });
} 
function getQualifiedTeams(standings) {
    let qualifiedTeams = [];
    let thirdPlaceTeams = [];

    const groups = Object.keys(standings).sort();

    groups.forEach(group => {
        const teamsArray = Object.values(standings[group]);

        teamsArray.sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            if (b.wins !== a.wins) return b.wins - a.wins;

            const teamAStrength = getTotalScore(findTeam(a.team));
            const teamBStrength = getTotalScore(findTeam(b.team));

            return teamBStrength - teamAStrength;
        });

        qualifiedTeams.push({
            name: teamsArray[0].team,
            group: group,
            position: 1
        });

        qualifiedTeams.push({
            name: teamsArray[1].team,
            group: group,
            position: 2
        });

        thirdPlaceTeams.push({
            name: teamsArray[2].team,
            group: group,
            position: 3,
            points: teamsArray[2].points,
            wins: teamsArray[2].wins
        });
    });

    thirdPlaceTeams.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.wins !== a.wins) return b.wins - a.wins;

        const teamAStrength = getTotalScore(findTeam(a.name));
        const teamBStrength = getTotalScore(findTeam(b.name));

        return teamBStrength - teamAStrength;
    });

    const bestThirdPlaceTeams = thirdPlaceTeams.slice(0, 8);

    bestThirdPlaceTeams.forEach(team => {
        qualifiedTeams.push(team);
    });

    return qualifiedTeams;
}
function createRoundOf32Pairings(qualifiedTeams) {
    const teams = [...qualifiedTeams];
    const pairings = [];

    while (teams.length > 0) {
        const teamA = teams.shift();

        let opponentIndex = teams.findIndex(team => team.group !== teamA.group);

        if (opponentIndex === -1) {
            opponentIndex = 0;
        }

        const teamB = teams.splice(opponentIndex, 1)[0];

        pairings.push(teamA.name);
        pairings.push(teamB.name);
    }

    return pairings;
}
function simulateKnockoutRound(teamsList) {
    const winners = [];
    const matchesPlayed = [];

    for (let i = 0; i < teamsList.length; i += 2) {
        const teamA = findTeam(teamsList[i]);
        const teamB = findTeam(teamsList[i + 1]);

        const result = simulateMatch(teamA, teamB);

        let winnerName;

        if (result === "teamA") {
            winnerName = teamA.name;
        } else if (result === "teamB") {
            winnerName = teamB.name;
        } else {
            const teamAScore = getTotalScore(teamA);
            const teamBScore = getTotalScore(teamB);

            winnerName = teamAScore >= teamBScore ? teamA.name : teamB.name;
        }

        winners.push(winnerName);

        matchesPlayed.push({
            teamA: teamA.name,
            teamB: teamB.name,
            winner: winnerName
        });
    }

    return {
        winners: winners,
        matchesPlayed: matchesPlayed
    };
} 
function simulateGroupStageOnly() {
    const standings = {};

    matches.forEach(match => {
        if (!standings[match.group]) {
            standings[match.group] = {};
        }

        const teamA = findTeam(match.teamA);
        const teamB = findTeam(match.teamB);

        if (!standings[match.group][teamA.name]) {
            standings[match.group][teamA.name] = createStanding(teamA.name);
        }

        if (!standings[match.group][teamB.name]) {
            standings[match.group][teamB.name] = createStanding(teamB.name);
        }

        const result = simulateMatch(teamA, teamB);

        if (result === "teamA") {
            standings[match.group][teamA.name].points += 3;
            standings[match.group][teamA.name].wins += 1;
            standings[match.group][teamB.name].losses += 1;
        }
        else if (result === "teamB") {
            standings[match.group][teamB.name].points += 3;
            standings[match.group][teamB.name].wins += 1;
            standings[match.group][teamA.name].losses += 1;
        }
        else {
            standings[match.group][teamA.name].points += 1;
            standings[match.group][teamB.name].points += 1;
            standings[match.group][teamA.name].draws += 1;
            standings[match.group][teamB.name].draws += 1;
        }

        standings[match.group][teamA.name].played += 1;
        standings[match.group][teamB.name].played += 1;
    });

    return standings;
} 

function displayRound(roundName, roundData) {
    const roundCard = document.createElement("div");
    roundCard.classList.add("round-card");

    let matchesHTML = `<h3>${roundName}</h3>`;

    roundData.matchesPlayed.forEach(match => {
        matchesHTML += `
            <p>
                ${getFlagImg(match.teamA)} ${match.teamA}
                vs
                ${getFlagImg(match.teamB)} ${match.teamB}
                →
                <strong>${getFlagImg(match.winner)} ${match.winner}</strong>
            </p>
        `;
    });

    roundCard.innerHTML = matchesHTML;
    worldCupOutput.appendChild(roundCard);
}


  function displayWorldCupSimulation(roundOf32, roundOf16, quarterfinals, semifinals, final, champion, qualifiedTeams) {
    worldCupOutput.innerHTML = "";

    const championCard = document.createElement("div");
    championCard.classList.add("champion-card");

    championCard.innerHTML = `
        <h3>🏆 Predicted World Cup Champion</h3>
        <p>${champion}</p>
    `;

    worldCupOutput.appendChild(championCard);

    displayQualifiedTeams(qualifiedTeams);

    displayRound("Round of 32", roundOf32);
    displayRound("Round of 16", roundOf16);
    displayRound("Quarterfinals", quarterfinals);
    displayRound("Semifinals", semifinals);
    displayRound("Final", final);
}

function displayQualifiedTeams(qualifiedTeams) {
    const qualifiedCard = document.createElement("div");
    qualifiedCard.classList.add("round-card");

    const groupWinners = qualifiedTeams.filter(team => team.position === 1);
    const runnersUp = qualifiedTeams.filter(team => team.position === 2);
    const thirdPlaceTeams = qualifiedTeams.filter(team => team.position === 3);

    let html = `<h3>Qualified Teams</h3>`;

    html += `<p><strong>Group Winners:</strong> ${groupWinners.map(team => team.name).join(", ")}</p>`;
    html += `<p><strong>Runners-up:</strong> ${runnersUp.map(team => team.name).join(", ")}</p>`;
    html += `<p><strong>Best Third-Place Teams:</strong> ${thirdPlaceTeams.map(team => team.name).join(", ")}</p>`;

    qualifiedCard.innerHTML = html;
    worldCupOutput.appendChild(qualifiedCard);
}


worldCupBtn.addEventListener("click", function () {
    const standings = simulateGroupStageOnly();
    const qualifiedTeams = getQualifiedTeams(standings);

    const roundOf32Teams = createRoundOf32Pairings(qualifiedTeams);
    const roundOf32 = simulateKnockoutRound(roundOf32Teams);
    const roundOf16 = simulateKnockoutRound(roundOf32.winners);
    const quarterfinals = simulateKnockoutRound(roundOf16.winners);
    const semifinals = simulateKnockoutRound(quarterfinals.winners);
    const final = simulateKnockoutRound(semifinals.winners);

    const champion = final.winners[0];
    championCardTitle.textContent = "🏆 Predicted Champion";
    championCardIcon.innerHTML = getFlagImg(champion);
    championCardName.textContent = champion;
    championCardSubtitle.textContent = "2026 Simulation Winner";

    displayWorldCupSimulation(
        roundOf32,
        roundOf16,
        quarterfinals,
        semifinals,
        final,
        champion,
        qualifiedTeams
    );
});