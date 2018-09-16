package it.unibo.exploremap.program;

import java.util.concurrent.TimeUnit;

import alice.tuprolog.NoSolutionException;
import alice.tuprolog.SolveInfo;
import it.unibo.qactors.QActorContext;
import it.unibo.qactors.QActorUtils;
import it.unibo.qactors.akka.QActor;

public class autoPilot {
	
	private static boolean stopAutoPilot = false;
	
	public static final String MOVE_LEFT = "mindcmd( a(250) )";
	public static final String MOVE_RIGHT = "mindcmd( d(250) )";
	public static final String MOVE_FORWARD = "mindcmd( w(250) )";
	public static final String MOVE_BACKWARD = "mindcmd( s(250) )";
	public static final String STOP_MOVE = "mindcmd( h(250) )";
	
	public static void init(QActor qa) {
		autoPilot.stopAutoPilot = false;
		qa.replaceRule("model( type(sensor, obstacle), name(sonar), value(OBSTACLE))", "model( type(sensor, obstacle), name(sonar), value(no))");
	}
	
	public static void start(QActor qa) {
		try {
			init(qa);
			System.out.println("Start auto pilot");
			aiutil.initAI();
			aiutil.cleanQa();
			System.out.println("===== initial map");
			aiutil.showMap();
			
			forwardToObstacle(qa);
			
			System.out.println("===== map after five moves");
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
		int moves = 0;
		while (!obstacleDetected && moves < 5) {
			//it.unibo.utils.clientTcp.sendMsg(qa, MOVE_FORWARD);
			System.out.println("Value of Autopilot: " + autoPilot.stopAutoPilot);
			sendMoveCmd(qa, MOVE_FORWARD);
			aiutil.doMove("w");
			sleepMillseconds(1000);
			obstacleDetected = isObstacleDetected(qa);
			moves ++;
		}
	}
	
	public static boolean isObstacleDetected(QActor qa) throws NoSolutionException {
		SolveInfo result = qa.solveGoal("model( type(sensor, obstacle), name(sonar), value(OBSTACLE))");
		String stringResult = result.getVarValue("OBSTACLE").toString();
		return stringResult.equals("yes");
	}
	
	protected static void sendMoveCmd(QActor qa, String payload) throws Exception {
		String temporaryStr = QActorUtils.unifyMsgContent(qa.getPrologEngine(),"mindcmd(CMD)",payload, null ).toString();
		System.out.println("Message to send: " + temporaryStr);
		qa.sendMsg("exec","delegateexecutor", QActorContext.dispatch, temporaryStr );
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
