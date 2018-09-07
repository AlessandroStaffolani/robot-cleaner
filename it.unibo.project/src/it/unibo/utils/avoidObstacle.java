package it.unibo.utils;

import it.unibo.qactors.akka.QActor;

public class avoidObstacle {

	private static boolean obstacleDetected;

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
								System.out.println("L'ostacolo è statico");
								/*Riparte la serpentina dal punto in cui mi trovo*/
								autoPilot.changeDirection(qa);
								autoPilot.startAutoPilot(qa);
							} else {
								System.out.println("L'ostacolo è dinamico");
								/*Riparte la serpentina da dove siamo arrivati con l'esecuzione del move forward*/
								autoPilot.startAutoPilot(qa);
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

	protected static boolean isStatic(QActor qa) throws Exception {
		boolean end = false;
		int counter = 0;
		System.out.println("Verifica dell'ostacolo");
		while (!end && counter < 3) {
			
			clientTcp.sendMsg(qa, autoPilot.MOVE_FORWARD);
			autoPilot.sleepMillseconds(350);
			
			/*Verifico se l'ostacolo non è più presente*/
			if(!isObstacleDetected())
				end = true;
			else
				/*L'ostacolo è ancora presente quindi faccio un altro tentativo (massimo 3)*/
				setObstacleDetected(false);
			
			counter++;
			autoPilot.sleepMillseconds(1000);

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
