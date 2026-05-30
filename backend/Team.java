public class Team {
    private String name;
    private int rankingScore;
    private int squadStrength;
    private int worldCupHistory;
    private int homeAdvantage;

    public Team(String name, int rankingScore, int squadStrength, int worldCupHistory, int homeAdvantage) {
        this.name = name;
        this.rankingScore = rankingScore;
        this.squadStrength = squadStrength;
        this.worldCupHistory = worldCupHistory;
        this.homeAdvantage = homeAdvantage;
    }

    public String getName() {
        return name;
    }

    public int getTotalScore() {
        return rankingScore + squadStrength + worldCupHistory + homeAdvantage;
    }
}