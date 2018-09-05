package it.unibo.utils;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

import org.json.JSONObject;

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
	public static final String STOP_MOVE = "{ \"type\": \"alarm\" }";
	
	private static boolean stopAutoPilot = false;
	
	private static int lastTurn = 1; 
	private static String startingPoint = null;
	private static String endingPoint = null;
	private static boolean isStarted = false;
	
	public static String currentSonar = null;
	public static int currentDistance = 0;
	public static String robotAxis = null;
	
	public static void stopAutoPilot(QActor qa) {
		stopAutoPilot = true;
		System.out.println("Stop auto pilot, value = " + stopAutoPilot);
	}
	
	public static void startAutoPilot(QActor qa) throws Exception {
		stopAutoPilot = false;
		//startTheReader();
		moveRobot(qa);
	}
	
	protected static void moveRobot(QActor qa) throws Exception {
		/*while (true) {
			System.out.println("StartPoint = " + startingPoint + "\n");
			System.out.println("EndPoint = " + endingPoint + "\n");
			System.out.println("CurrentSonar = " + currentSonar + "\n");
			System.out.println("CurrentDistance = " + currentDistance + "\n");
			System.out.println("RobotAxis = " + robotAxis + "\n");
			
			sleepMillseconds(2000);
		}*/
		while (!stopAutoPilot && (startingPoint == null || endingPoint == null)) {
			clientTcp.sendMsg(qa, "{ \"type\": \"moveForward\", \"arg\": 100 }");
			
			System.out.println("\n\n\nStarting Point = " + startingPoint + "\n\nEndpoint = " + endingPoint + "\n\n");
			if (currentDistance != 0) {
				if (Math.abs(currentDistance) <= 3) {
					if (startingPoint == null) {
						startingPoint = currentSonar;
					} else if (!startingPoint.equals(currentSonar)) {
						endingPoint = currentSonar;
						stopAutoPilot = true;
					}
				} 
			}
			
			System.out.println("\n\nCurrent sonar = " + currentSonar + "\n\nAxis = " + robotAxis + "\n\n\n");
			
			if (currentSonar != null) {
				clientTcp.sendMsg(qa, STOP_MOVE);
				sleepMillseconds(300);
				setCurrentSonar(null);
				turnVirtualRobot(qa);
			}
			
			sleepMillseconds(150);
		}
	}
	
	protected static void turnVirtualRobot(QActor qa) throws Exception {
		String msg = "";
		if (lastTurn % 2 == 0) {
			msg = MOVE_RIGHT;
		} else {
			msg = MOVE_LEFT;
		}
		lastTurn += 1;
		clientTcp.sendMsg(qa, msg);
		sleepMillseconds(300);
		clientTcp.sendMsg(qa, "{ \"type\": \"moveForward\", \"arg\": 200 }");
		sleepMillseconds(300);
		clientTcp.sendMsg(qa, msg);
		sleepMillseconds(300);
	}
	
	protected static void startTheReader() {		
		new Thread() {
			public void run() {
				while( !stopAutoPilot ) {				 
					try {
						String inpuStr = clientTcp.inFromServer.readLine();
						//System.out.println( "reads: " + inpuStr);
						String jsonMsgStr = inpuStr.split(";")[1];
						//System.out.println( "reads: " + jsonMsgStr + " qa=" + qa.getName() );
						JSONObject jsonObject = new JSONObject(jsonMsgStr);
						//System.out.println( "type: " + jsonObject.getString("type"));
						
						System.out.println("JSON OBJECT = " + jsonObject.toString());
						if (jsonObject.getString("type").equals("sonar-activated")) {
							//wSystem.out.println( "sonar-activated "   );
							JSONObject jsonArg = jsonObject.getJSONObject("arg");
							String sonarName   = jsonArg.getString("sonarName");							
							int distance       = jsonArg.getInt( "distance" );

							String axis 	   = getAxisValue(jsonArg.getString("axis"), sonarName);
							if (axis != robotAxis || robotAxis == null) {
								setCurrentSonar(sonarName);
								setRobotAxis(axis);
							}
							setCurrentDistance(distance);
							
							System.out.println( "sonarName = " +  sonarName + " distance = " + distance + " axis = " + axis );
						}
						
 					} catch (IOException e) {
 						e.printStackTrace();
					}
				}
			}
		}.start();
	}
	
	protected static synchronized void setCurrentSonar(String value)  {
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

	protected static String getAxisValue(String axis, String sonar) {
		if (sonar.equals("sonar1") && axis.equals("y")) {
			return "x";
			//return axis + "1";
		} else if (sonar.equals("sonar1") && axis.equals("x")) {
			return "y";
		} else {
			return axis;
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
	
}
