package it.unibo.exploremap.program;

import java.util.List;
import java.util.concurrent.TimeUnit;

import aima.core.agent.Action;
import alice.tuprolog.NoSolutionException;
import alice.tuprolog.SolveInfo;
import it.unibo.exploremap.stella.model.RobotState.Direction;
import it.unibo.qactors.QActorContext;
import it.unibo.qactors.QActorUtils;
import it.unibo.qactors.akka.QActor;

public class autoPilot {
	
	private static QActor mindQa = null;
	
	private static boolean stopAutoPilot = false;
	
	public static final String MOVE_LEFT = "mindcmd( a(200) )";
	public static final String MOVE_RIGHT = "mindcmd( d(200) )";
	public static final String MOVE_FORWARD = "mindcmd( w(200) )";
	public static final String MOVE_BACKWARD = "mindcmd( s(200) )";
	public static final String STOP_MOVE = "mindcmd( h(200) )";
	
	public static void setMindQa(QActor qa) {
		if (mindQa == null) {
			mindQa = qa;
		}
	}
	
	public static void init(QActor qa) {
		autoPilot.stopAutoPilot = false;
		clearObstacle(qa);
	}
	
	public static void start(QActor qa) {
		try {
			init(qa);
			System.out.println("Start auto pilot");
			aiutil.initAI();
			aiutil.cleanQa();
			System.out.println("===== initial map");
			aiutil.showMap();
			
			// Static moves
			forwardToObstacle(qa);
			traceMap(qa);
			
			// AI moves
			cleanRoom(qa);
			List<Action> actions = aiutil.doPlan();
			if (actions.isEmpty()) 
				it.unibo.utils.clientRest.postMap(qa, aiutil.getRoomMap().getRoomMapAsArrayList(), aiutil.getCurrentDirection().toString(), true);
			
			
			System.out.println("===== map after clean");
			aiutil.showMap();
			
		} catch (Exception e) {
 			e.printStackTrace();
		}		
	}
	
	public static void stopAutoPilot(QActor qa) {
		autoPilot.stopAutoPilot = true;
		System.out.println("\n\n\nStop auto pilot, value = " + autoPilot.stopAutoPilot);
	}
	
	public static void forwardToObstacle(QActor qa) throws Exception {
		boolean obstacleDetected = false;
		while (!obstacleDetected && !stopAutoPilot) {
			System.out.println("Value of Autopilot: " + autoPilot.stopAutoPilot);
			moveRobot(qa, "w", true);
			obstacleDetected = isObstacleDetected(qa);
			if (obstacleDetected) {
				clearObstacle(qa);
				String obstacleType = getObstacleType(aiutil.getCurrentDirection());
				aiutil.doMove(obstacleType);
			}
			it.unibo.utils.clientRest.postMap(qa, aiutil.getRoomMap().getRoomMapAsArrayList(), aiutil.getCurrentDirection().toString(), false);
		}
	}
	
	public static void traceMap(QActor qa) throws Exception {
		boolean obstacleDetected = false;
		String obstacleType = "";
		moveRobot(qa, "a", true);
		while (!obstacleType.equals("obstacleOnRight") && !stopAutoPilot) {
			System.out.println("Value of Autopilot: " + autoPilot.stopAutoPilot);
			moveRobot(qa, "w", false);
			obstacleDetected = isObstacleDetected(qa);
			if (obstacleDetected) {
				clearObstacle(qa);
				obstacleType = getObstacleType(aiutil.getCurrentDirection());
				aiutil.doMove(obstacleType);
			} else {
				aiutil.doMove("w");
				moveRobot(qa, "d", true);
				moveRobot(qa, "w", false);
				obstacleDetected = isObstacleDetected(qa);
				if (obstacleDetected) {
					clearObstacle(qa);
					obstacleType = getObstacleType(aiutil.getCurrentDirection());
					aiutil.doMove(obstacleType);
					moveRobot(qa, "a", true);
				}
			}
			it.unibo.utils.clientRest.postMap(qa, aiutil.getRoomMap().getRoomMapAsArrayList(), aiutil.getCurrentDirection().toString(), false);
		}
	}
	
	public static void cleanRoom(QActor qa) throws Exception {
		boolean obstacleDetected = false;
		List<Action> actions = aiutil.doPlan();
		while (!actions.isEmpty() && !stopAutoPilot) {
			moveRobot(qa, actions.get(0).toString(), false);
			obstacleDetected = isObstacleDetected(qa);
			if (obstacleDetected) {
				clearObstacle(qa);
				/*Verifica della tipologia di ostacolo*/
				if(it.unibo.utils.avoidObstacle.isStatic(qa)) {
					String obstacleType = getObstacleType(aiutil.getCurrentDirection());
					aiutil.doMove(obstacleType);
				}else
					aiutil.doMove(actions.get(0).toString());
			} else {
				aiutil.doMove(actions.get(0).toString());
			}
			actions = aiutil.doPlan();
			it.unibo.utils.clientRest.postMap(qa, aiutil.getRoomMap().getRoomMapAsArrayList(), aiutil.getCurrentDirection().toString(), false);
		}
	}
	
	public static boolean isObstacleDetected(QActor qa) throws NoSolutionException {
		SolveInfo result = mindQa.solveGoal("model( type(sensor, obstacle), name(sonar), value(OBSTACLE))");
		String stringResult = result.getVarValue("OBSTACLE").toString();
		return stringResult.equals("yes");
	}
	
	public static void clearObstacle(QActor qa) {
		mindQa.replaceRule("model( type(sensor, obstacle), name(sonar), value(OBSTACLE))", "model( type(sensor, obstacle), name(sonar), value(no))");
	}
	
	protected static void sendMoveCmd(QActor qa, String payload) throws Exception {
		String temporaryStr = QActorUtils.unifyMsgContent(qa.getPrologEngine(),"mindcmd(CMD)",payload, null ).toString();
		System.out.println("Message to send: " + temporaryStr);
		qa.sendMsg("exec","delegateexecutor", QActorContext.dispatch, temporaryStr );
	}
	
	public static void sleepMillseconds(int value) {
		try {
			TimeUnit.MILLISECONDS.sleep(value);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public static void moveRobot(QActor qa, String direction, boolean doMove) throws Exception {
		switch (direction) {
		case "w": 
			sendMoveCmd(qa, MOVE_FORWARD);
			if (doMove) aiutil.doMove("w");
			break;
		case "d": 
			sendMoveCmd(qa, MOVE_RIGHT);
			if (doMove) aiutil.doMove("d");
			break;
		case "a": 
			sendMoveCmd(qa, MOVE_LEFT);
			if (doMove) aiutil.doMove("a");
			break;
		case "s": 
			sendMoveCmd(qa, MOVE_BACKWARD);
			if (doMove) aiutil.doMove("s");
			break;
		}
		sleepMillseconds(1000);
	}
	
	protected static String getObstacleType(Direction currentDirection) {
		String obstacleType = "";
		switch (currentDirection) {
		case UP: obstacleType = "obstacleOnUp"; break;
		case RIGHT: obstacleType = "obstacleOnRight"; break;
		case DOWN: obstacleType = "obstacleOnDown"; break;
		case LEFT: obstacleType = "obstacleOnLeft"; break;
		}
		return obstacleType;
	}
	
	public static String directionToString(Direction currentDirection) {
		String direction = "";
		switch (currentDirection) {
		case UP: direction = "w"; break;
		case RIGHT: direction = "d"; break;
		case DOWN: direction = "s"; break;
		case LEFT: direction = "a"; break;
		}
		return direction;
	}

}
