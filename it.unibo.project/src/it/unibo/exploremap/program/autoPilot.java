package it.unibo.exploremap.program;

import it.unibo.qactors.akka.QActor;

public class autoPilot {
	
	private static boolean stopAutoPilot = false;
	
	public static void start(QActor qa) {
		try {
			System.out.println("Start auto pilot");
			aiutil.initAI();
			aiutil.cleanQa();
			System.out.println("===== initial map");
			aiutil.showMap();
			boolean obstacleDetected = false;
			String obstacleResource = qa.solveGoal("model( type(sensor, obstacle), name(sonar), value(OBSTACLE)).").getSetOfSolution(); //Get resource model obstacle value
			System.out.println(obstacleResource);
			System.exit(0);
			while(!aiutil.roomIsCleaned() && !stopAutoPilot) {
				
			}
		} catch (Exception e) {
 			e.printStackTrace();
		}		
	}
	
	public static void stop(QActor qa) {
		stopAutoPilot = true;
		System.out.println("\n\n\nStop auto pilot, value = " + stopAutoPilot);
	}

}
