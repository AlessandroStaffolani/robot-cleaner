/* Generated by AN DISI Unibo */ 
package it.unibo.ctxRobotMockLedAnalysis;
import it.unibo.qactors.QActorContext;
import it.unibo.is.interfaces.IOutputEnvView;
import it.unibo.system.SituatedSysKb;
public class MainCtxRobotMockLedAnalysis  {
  
//MAIN
public static QActorContext initTheContext() throws Exception{
	IOutputEnvView outEnvView = SituatedSysKb.standardOutEnvView;
	String webDir = null;
	return QActorContext.initQActorSystem(
		"ctxrobotmockledanalysis", "./srcMore/it/unibo/ctxRobotMockLedAnalysis/robotroombaanalysis.pl", 
		"./srcMore/it/unibo/ctxRobotMockLedAnalysis/sysRules.pl", outEnvView,webDir,false);
}
public static void main(String[] args) throws Exception{
	QActorContext ctx = initTheContext();
} 	
}
