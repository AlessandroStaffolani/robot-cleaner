package it.unibo.utils;

import java.util.concurrent.TimeUnit;

import it.unibo.qactors.akka.QActor;

public class autoPilot {
	public static final int FORWARD_STEP = 300;
	public static final int S1_X_END = -3;
	public static final int S1_Y_END = -3;
	public static final int S2_X_END = 3;
	public static final int S2_Y_END = 3;
	public static final int S1_X = -21;
	public static final int S1_Y = -16;
	public static final int S2_X = 21;
	public static final int S2_Y = 15;

	public static final String MOVE_LEFT = "{ \"type\": \"turnLeft\", \"arg\": 300 }";
	public static final String MOVE_RIGHT = "{ \"type\": \"turnRight\", \"arg\": 300 }";
	public static final String MOVE_FORWARD = "{ \"type\": \"moveForward\", \"arg\": " + FORWARD_STEP + " }";
	public static final String MOVE_BACKWARD = "{ \"type\": \"moveBackward\", \"arg\": " + FORWARD_STEP + " }";
	public static final String STOP_MOVE = "{ \"type\": \"alarm\" }";

	private static boolean stopAutoPilot = false;

	private static int lastTurn = 1;
	private static String startingPoint = null;
	private static String endingPoint = null;

	public static String currentSonar = null;
	public static int currentDistance = 0;
	public static int lastDistance = 0;
	public static String robotAxis = null;
	public static String realAxis = null;

	public static void init() {
		lastTurn = 1;
		startingPoint = null;
		endingPoint = null;
		currentSonar = null;
		currentDistance = 0;
		lastDistance = 0;
		robotAxis = null;
		realAxis = null;
	}

	public static void stopAutoPilot(QActor qa) {
		stopAutoPilot = true;
		System.out.println("\n\n\nStop auto pilot, value = " + stopAutoPilot);
	}

	public static void startAutoPilot(QActor qa) throws Exception {
		// init();
		stopAutoPilot = false;
//		if (isStartingPoint(qa)) {
//			// Siamo nella posizione iniziale possiamo far partire la serpentina
//			init();
//			startingPoint = "sonar1";
//		} else {
//			// Non siamo nella posizione iniziale facciamo partire il metodo per metterci in
//			// posizione iniziale
//			init();
//			goToStartingPoint(qa);
//		}
//		startingPoint = "sonar1";
//		// startTheReader(qa);
		moveRobot(qa);
	}

	protected static void moveRobot(QActor qa) throws Exception {

		new Thread() {
			public void run() {
				while (!stopAutoPilot && (startingPoint == null || endingPoint == null)
						&& !avoidObstacle.isObstacleDetected()) {
					try {

						// if (!isTurning) {
						clientTcp.sendMsg(qa, "{ \"type\": \"moveForward\", \"arg\": 100 }");
						// }

						if (currentSonar != null) {
							if (Math.abs(currentDistance) <= 5) {
								if (startingPoint == null) {
									System.out.println(
											"#=================================================================#");
									startingPoint = currentSonar;
									System.out.println("Ho acquisito lo StartingPoint:" + startingPoint);
									System.out.println(
											"#=================================================================#");
									setCurrentSonar(null); /* Permette al robot di fare meglio gli angoli */
									/*
									 * TODO se non cambiamo la modalità di movimento rimette la posizione iniziale
									 * del robot verso il sonar e non viceversa
									 */
									changeDirection(qa);
								} else if (!startingPoint.equals(currentSonar)) {
									System.out.println(
											"#=================================================================#");
									System.out.println("Ho terminato la pulizia!");
									endingPoint = currentSonar;
									System.out.println("Il nuovo ending point è il seguente: " + endingPoint);
									stopAutoPilot = true;
									System.out.println(
											"#=================================================================#");
								}
							}
						}

						
						if (currentSonar != null) {

							clientTcp.sendMsg(qa, STOP_MOVE);
							sleepMillseconds(300);
							turnVirtualRobot(qa);
							setCurrentSonar(null);

						}

						sleepMillseconds(150);

					} catch (Exception e) {
						e.printStackTrace();
					}
				}
			}
		}.start();
	}

	protected static void turnVirtualRobot(QActor qa) throws Exception {
		String msg = "";
		if (lastTurn % 2 == 0) {
			msg = MOVE_RIGHT;
		} else {
			msg = MOVE_LEFT;
		}
		lastTurn += 1;

		/* Gira */
		clientTcp.sendMsg(qa, msg);
		sleepMillseconds(300);

		/* Vai avanti per 200 ms */
		clientTcp.sendMsg(qa, "{ \"type\": \"moveForward\", \"arg\": 200 }");
		sleepMillseconds(300);

		/* Gira */
		clientTcp.sendMsg(qa, msg);
		sleepMillseconds(300);

		/* Vai avanti per 200 ms */
		clientTcp.sendMsg(qa, "{ \"type\": \"moveForward\", \"arg\": 200 }");
		sleepMillseconds(300);
	}

	protected static void changeDirection(QActor qa) throws Exception {
		/* Gira */
		clientTcp.sendMsg(qa, MOVE_LEFT);
		sleepMillseconds(300);

		/* Gira */
		clientTcp.sendMsg(qa, MOVE_LEFT);
		sleepMillseconds(300);
	}

	protected static boolean isStartingPoint(QActor qa) throws Exception {
		if (currentSonar != null && currentDistance != 0 && realAxis != null) {
			if (currentSonar.equals("sonar1") && currentDistance == -4 && realAxis.equals("y1")) {
				clientTcp.sendMsg(qa, MOVE_FORWARD);
				sleepMillseconds(310);
				if (currentDistance == -7) {
					// Il robot è anche nel verso giusto
					clientTcp.sendMsg(qa, MOVE_BACKWARD);
					sleepMillseconds(310);
					return true;
				} else if (currentDistance == -1) {
					// Lo giro di 180 gradi
					clientTcp.sendMsg(qa, MOVE_BACKWARD);
					sleepMillseconds(310);
					changeDirection(qa);
					return true;
				} else {
					return false;
				}
			}
		}
		return false;
	}

	protected static void goToStartingPoint(QActor qa) throws Exception {
		while (realAxis == null && !stopAutoPilot) {
			clientTcp.sendMsg(qa, MOVE_FORWARD);
			sleepMillseconds(350);
		}
		switch (realAxis) {
		case "x1":
			fromX1ToStart(qa);
			break;
		case "y1":
			fromY1ToStart(qa);
			break;
		case "x2":
			fromX2ToStart(qa);
			break;
		case "y2":
			fromY2ToStart(qa);
			break;
		default:
			System.out.println("RealAxis value not allowed, current value = " + realAxis);
		}
	}

	protected static synchronized void setCurrentSonar(String value) {
		currentSonar = value;
	}

	protected static synchronized void setCurrentDistance(int value) {
		currentDistance = value;
	}

	protected static synchronized void setRobotAxis(String value) {
		if (value != robotAxis) {
			robotAxis = value;
		}
	}

	protected static synchronized void setRealAxis(String value) {
		realAxis = value;
	}

	protected static synchronized void setLastDistance(int value) {
		lastDistance = value;
	}

	protected static void setTurn(int value) {
		lastTurn = value;
	}

	protected static int getTurn() {
		return lastTurn;
	}

	protected static boolean getStatus() {
		if (stopAutoPilot)
			return false;
		else
			return true;
	}

	protected static String getAxisValue(String axis, String sonar) {
		if (sonar.equals("sonar1") && axis.equals("y")) {
			return "x";
			// return axis + "1";
		} else if (sonar.equals("sonar1") && axis.equals("x")) {
			return "y";
		} else {
			return axis;
		}
	}

	public static String getRealAxisValue(String axis, String sonar) {
		if (sonar.equals("sonar1")) {
			return axis + "1";
		} else {
			return axis + "2";
		}
	}

	protected static void sleepMillseconds(int value) {
		try {
			TimeUnit.MILLISECONDS.sleep(value);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	protected static void fromX1ToStart(QActor qa) throws Exception {
		clientTcp.sendMsg(qa, MOVE_LEFT);
		sleepMillseconds(310);
		while (currentDistance != 0 && !stopAutoPilot) {
			clientTcp.sendMsg(qa, MOVE_FORWARD);
			sleepMillseconds(310);
		}
		clientTcp.sendMsg(qa, MOVE_LEFT);
		sleepMillseconds(310);
		clientTcp.sendMsg(qa, MOVE_FORWARD);
		sleepMillseconds(310);
	}

	protected static void fromY1ToStart(QActor qa) throws Exception {
		clientTcp.sendMsg(qa, MOVE_RIGHT);
		sleepMillseconds(310);
		while (currentDistance != 0 && !stopAutoPilot) {
			clientTcp.sendMsg(qa, MOVE_FORWARD);
			sleepMillseconds(310);
		}
		changeDirection(qa);
		clientTcp.sendMsg(qa, MOVE_FORWARD);
		sleepMillseconds(310);
	}

	protected static void fromX2ToStart(QActor qa) throws Exception {
		changeDirection(qa);
		while (!realAxis.equals("x1") && !stopAutoPilot) {
			clientTcp.sendMsg(qa, MOVE_FORWARD);
			sleepMillseconds(310);
		}
		fromX1ToStart(qa);
	}

	protected static void fromY2ToStart(QActor qa) throws Exception {
		changeDirection(qa);
		while (!realAxis.equals("y1") && !stopAutoPilot) {
			clientTcp.sendMsg(qa, MOVE_FORWARD);
			sleepMillseconds(310);
		}
		fromY1ToStart(qa);
	}
}
