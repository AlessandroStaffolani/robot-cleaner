package it.unibo.utils;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;
import org.json.JSONObject;
import it.unibo.qactors.akka.QActor;

public class clientTcp   {
private static String hostName = "localhost";
private static int port        = 8999;
private static String sep      = ";";
protected static Socket clientSocket ;
protected static PrintWriter outToServer;
protected static BufferedReader inFromServer;
public static int counter_repeat_distance = 0;

public static void initClientConn(QActor qa ) throws Exception {
		initClientConn(qa, hostName, ""+port);
}
	public static void initClientConn(QActor qa, String hostNameStr, String portStr) throws Exception {
		 hostName = hostNameStr;
		 port     = Integer.parseInt(portStr);
		 clientSocket = new Socket(hostName, port);
		 //outToServer  = new DataOutputStream(clientSocket.getOutputStream()); //DOES NOT WORK!!!!;
		 inFromServer = new BufferedReader( new InputStreamReader(clientSocket.getInputStream()) );  
		 outToServer  = new PrintWriter(clientSocket.getOutputStream());
		 startTheReader(  qa );
	}
	public static void sendMsg(QActor qa, String jsonString) throws Exception {
		JSONObject jsonObject = new JSONObject(jsonString);
		String msg = sep+jsonObject.toString()+sep;
		System.out.println(msg);
		outToServer.println(msg);
		outToServer.flush();
	}
	
	/**Metodo in cui è possibile specificare per quanti secondi il robot deve combiere un movimento:
	 * Importante l'argomento "arg" non deve essere specificato basta solo la distanza**/
	public static void sendMsgWithDistance(QActor qa, String jsonString, String distance)throws Exception{
		JSONObject jsonObject = new JSONObject(jsonString);
		if(distance.equals("low")) {
			jsonObject.put("arg", "-1");
		}else
			jsonObject.put("arg", distance);
	
		String msg = sep+jsonObject.toString()+sep;
		System.out.println("\n\n\n\nQuesto è il messaggio inviato: \n" + msg+"\n");
		outToServer.println(msg);
		outToServer.flush();
	}
	
 	protected static void startTheReader(final QActor qa) {		
		new Thread() {
			public void run() {
				while( true ) {				 
					try {
						String inpuStr = inFromServer.readLine();
						//System.out.println( "reads: " + inpuStr);
						String jsonMsgStr = inpuStr.split(";")[1];
						//System.out.println( "reads: " + jsonMsgStr + " qa=" + qa.getName() );
						JSONObject jsonObject = new JSONObject(jsonMsgStr);
						//System.out.println( "type: " + jsonObject.getString("type"));
						
						System.out.println("\n\nJSON OBJECT = " + jsonObject.toString() + "\n\n");
						
						switch (jsonObject.getString("type") ) {
						case "webpage-ready" : System.out.println( "webpage-ready "   );break;
						case "sonar-activated" : {
							//wSystem.out.println( "sonar-activated "   );
							JSONObject jsonArg = jsonObject.getJSONObject("arg");
							String sonarName   = jsonArg.getString("sonarName");							
							int distance       = jsonArg.getInt( "distance" );
							//System.out.println( "sonarName=" +  sonarName + " distance=" + distance);
							//System.out.println(qa.getName());
							
							String axis 	   = jsonArg.getString("axis");
							/*Per far funzionare il primo autopilot bisogna decommentare tutto quello che c'è sotto*/
//							autoPilot.setRealAxis(autoPilot.getRealAxisValue(axis, sonarName));
//							axis = autoPilot.getAxisValue(axis, sonarName);
//							System.out.println("\n\n\nAxis on clientTCP = " + axis + "\n\n\n");
//							if (axis != autoPilot.robotAxis || autoPilot.robotAxis == null) {
//								autoPilot.setCurrentSonar(sonarName);
//								autoPilot.setRobotAxis(axis);
//							}
//							if(distance == 0)
//								autoPilot.setCurrentSonar(sonarName);
////							else {
////								/*Con questo riesce a stare sull'asse y del sonar1*/
////								autoPilot.setCurrentSonar(null);
////							}
//							autoPilot.setCurrentDistance(distance);
//							//LOOP 
//							if(autoPilot.getStatus()) {
//								if(autoPilot.currentDistance != autoPilot.lastDistance) {
//									autoPilot.setLastDistance(autoPilot.currentDistance);
//									counter_repeat_distance = 0;
//								}else
//									counter_repeat_distance = counter_repeat_distance + 1;
//								
//								System.out.println("\n\nLOOP: " + counter_repeat_distance + "\n\n");
//								if(counter_repeat_distance > 4) {
//									System.out.println("Sono entrato in loop: Cambio direzione!");
//									counter_repeat_distance = 0;
//									int lastTurn = autoPilot.getTurn();
//									System.out.println("Last Turn: " + lastTurn);
//									lastTurn ++;
//									//autoPilot.setCurrentSonar(sonarName);
//									autoPilot.setTurn(lastTurn);
//								}
//							}
							System.out.println( "sonarName = " +  sonarName + " distance = " + distance + " axis = " + axis );
							
							qa.emit("sonar", 
								"sonar(NAME, soffritti, DISTANCE)".replace("NAME", sonarName.replace("-", "")).replace("DISTANCE", (""+distance) ));
							break;
						}
						case "collision" : {
							//System.out.println( "collision"   );
							JSONObject jsonArg  = jsonObject.getJSONObject("arg");
							String objectName   = jsonArg.getString("objectName");
							//System.out.println( "collision objectName=" +  objectName  );
							if(!objectName.contains("wall"))
								avoidObstacle.setObstacleDetected(true);
							qa.emit("sonarDetect",
									"sonarDetect(TARGET, soffritti)".replace("TARGET", objectName.replace("-", "")));
							//System.out.println("Var: " + avoidObstacle.isObstacleDetected());
							break;
						}
						};
 					} catch (IOException e) {
 						e.printStackTrace();
					}
				}
			}
		}.start();
	}
	
//	public void doJob() throws Exception {
//		initClientConn();
//		String jsonString ="";
//		JSONObject jsonObject;
//		String msg="";
//for( int i=1; i<=3; i++ ) {		
//		jsonString = "{ 'type': 'moveForward', 'arg': 800 }";
//		jsonObject = new JSONObject(jsonString);
//		msg = sep+jsonObject.toString()+sep;
//		println("sending msg=" + msg);
//		sendMsg( msg  );
//		Thread.sleep(1000);
//		
//			jsonString = "{ 'type': 'moveBackward', 'arg': 800 }";
// 			jsonObject = new JSONObject(jsonString);
// 			msg = sep+jsonObject.toString()+sep;
// 			println("sending msg=" + msg);
//			sendMsg( msg  );			 
//			Thread.sleep(1000); 
//			
//}			 
//			clientSocket.close();
//	}
//
//	
//	public static void main(String[] args) throws Exception {
//  		new ClientTcp().doJob();
//	}

}
