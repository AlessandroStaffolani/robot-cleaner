/* Generated by AN DISI Unibo */ 
package it.unibo.ctxLedMockLedAnalysis;
import it.unibo.qactors.QActorContext;
import it.unibo.is.interfaces.IOutputEnvView;
import it.unibo.system.SituatedSysKb;
public class MainCtxLedMockLedAnalysis  {
  
//MAIN
public static QActorContext initTheContext() throws Exception{
	IOutputEnvView outEnvView = SituatedSysKb.standardOutEnvView;
	String webDir = null;
	return QActorContext.initQActorSystem(
		"ctxledmockledanalysis", "./srcMore/it/unibo/ctxLedMockLedAnalysis/robotroombaanalysis.pl", 
		"./srcMore/it/unibo/ctxLedMockLedAnalysis/sysRules.pl", outEnvView,webDir,false);
}
public static void main(String[] args) throws Exception{
	QActorContext ctx = initTheContext();
} 	
}