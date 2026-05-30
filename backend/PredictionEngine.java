public class PredictionEngine {

    public String predictWinner(Match match) {
        Team teamA = match.getTeamA();
        Team teamB = match.getTeamB();

        if (teamA.getTotalScore() > teamB.getTotalScore()) {
            return teamA.getName();
        } else if (teamB.getTotalScore() > teamA.getTotalScore()) {
            return teamB.getName();
        } else {
            return "Draw";
        }
    }

    public double calculateWinChance(Team team, Team opponent) {
        int teamScore = team.getTotalScore();
        int opponentScore = opponent.getTotalScore();

        return (double) teamScore / (teamScore + opponentScore) * 100;
    }
}