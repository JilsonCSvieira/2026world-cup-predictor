const matchSelect = document.getElementById("matchSelect");
const predictBtn = document.getElementById("predictBtn");
const groupFilter = document.getElementById("groupFilter");
const simulateBtn = document.getElementById("simulateBtn");
const standingsDiv = document.getElementById("standings");

const winner = document.getElementById("winner");
const chance = document.getElementById("chance");
const reason = document.getElementById("reason");

const matchInfo = document.getElementById("matchInfo");
const teamScores = document.getElementById("teamScores");

let matches = [];
let teams = [];

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

        if (teamAScore > teamBScore) {
            standings[match.group][teamA.name].points += 3;
            standings[match.group][teamA.name].wins += 1;
            standings[match.group][teamB.name].losses += 1;
        }
        else if (teamBScore > teamAScore) {
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

        teamsArray.sort((a, b) => b.points - a.points);

        teamsArray.forEach(team => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${team.team}</td>
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
});