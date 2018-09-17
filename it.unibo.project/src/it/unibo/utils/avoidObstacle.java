package it.unibo.utils;

import it.unibo.qactors.akka.QActor;

public class avoidObstacle {

	private static boolean obstacleDetected = false;

	public static void init(QActor qa) {
		/* Parametri statici */
		System.out.println("Obstacle detector!");
		obstacleDetected = false;
		
		obstacleDetector(qa);
	}

	protected static void obstacleDetector(QActor qa) {
		System.out.println("Start thread...");
		new Thread() {
			public void run() {
				try {
					while (true) {
						//System.out.println("E' presente un ostacolo? " + isObstacleDetected());
						if (isObstacleDetected()) {
							//System.out.println("Sono qui: " + obstacleDetected);
							setObstacleDetected(false);
							if (isStatic(qa)) {
								//System.out.println("L'ostacolo è statico");
								/*Riparte la serpentina dal punto in cui mi trovo*/
								//autoPilot.changeDirection(qa);
								//autoPilot.setTurn(autoPilot.getTurn()+1);
								autoPilot.setRobotAxis(null);
								autoPilot.turnVirtualRobot(qa);
								autoPilot.moveRobot(qa);
							} else {
								System.out.println("L'ostacolo è dinamico");
								/*Riparte la serpentina da dove siamo arrivati con l'esecuzione del move forward*/
								autoPilot.setCurrentSonar(null);
								autoPilot.moveRobot(qa);
							}

						}
						autoPilot.sleepMillseconds(500);
					}
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}

		}.start();
	}

//	protected static boolean isDynamic() {
//		// TODO Auto-generated method stub
//		return false;
//	}

	public static boolean isStatic(QActor qa) throws Exception {
		boolean end = false;
		int counter = 0;
		System.out.println("Verifica dell'ostacolo");
		String direction = "";
		while (!end && counter < 3) {
			
			direction = it.unibo.exploremap.program.autoPilot.directionToString(it.unibo.exploremap.program.aiutil.getCurrentDirection());
			//System.out.println("##################\tDirection:" + direction + "\t##################");
			it.unibo.exploremap.program.autoPilot.moveRobot(qa, "w", false);
			
			it.unibo.exploremap.program.autoPilot.sleepMillseconds(300);

			/*Verifico se l'ostacolo non è più presente*/
			if(!it.unibo.exploremap.program.autoPilot.isObstacleDetected(qa))
				end = true;
			else {
				/*L'ostacolo è ancora presente quindi faccio un altro tentativo (massimo 3)*/
				it.unibo.exploremap.program.autoPilot.clearObstacle(qa);
				counter ++;
			}
		}
		System.out.println("Counter obstacle: " + counter);
		if (counter == 3)
			return true;
		else
			return false;
		
		
	}

	public static boolean isObstacleDetected() {
		return obstacleDetected;
	}

	public synchronized static void setObstacleDetected(boolean obstacle) {
		obstacleDetected = obstacle;
	}

}
