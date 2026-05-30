public class Main {
    public static void main(String[] args) {
        Team argentina = new Team("Argentina", 98, 95, 99, 0);
        Team algeria = new Team("Algeria", 67, 72, 69, 0);

        Match match = new Match(argentina, algeria);

        PredictionEngine engine = new PredictionEngine();

        String winner = engine.predictWinner(match);
        double argentinaChance = engine.calculateWinChance(argentina, algeria);
        double algeriaChance = engine.calculateWinChance(algeria, argentina);

        System.out.println("World Cup Predictor");
        System.out.println("-------------------");
        System.out.println("Match: Argentina vs Algeria");
        System.out.println("Predicted Winner: " + winner);
        System.out.println("Argentina Win Chance: " + String.format("%.1f", argentinaChance) + "%");
        System.out.println("Algeria Win Chance: " + String.format("%.1f", algeriaChance) + "%");
    }
}