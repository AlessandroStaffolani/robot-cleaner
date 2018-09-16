/* Generated by AN DISI Unibo */ 
package it.unibo.delegateexecutor;
import it.unibo.qactors.PlanRepeat;
import it.unibo.qactors.QActorContext;
import it.unibo.qactors.StateExecMessage;
import it.unibo.qactors.QActorUtils;
import it.unibo.is.interfaces.IOutputEnvView;
import it.unibo.qactors.action.AsynchActionResult;
import it.unibo.qactors.action.IActorAction;
import it.unibo.qactors.action.IActorAction.ActionExecMode;
import it.unibo.qactors.action.IMsgQueue;
import it.unibo.qactors.akka.QActor;
import it.unibo.qactors.StateFun;
import java.util.Stack;
import java.util.Hashtable;
import java.util.concurrent.Callable;
import alice.tuprolog.Struct;
import alice.tuprolog.Term;
import it.unibo.qactors.action.ActorTimedAction;
public abstract class AbstractDelegateexecutor extends QActor { 
	protected AsynchActionResult aar = null;
	protected boolean actionResult = true;
	protected alice.tuprolog.SolveInfo sol;
	protected String planFilePath    = null;
	protected String terminationEvId = "default";
	protected String parg="";
	protected boolean bres=false;
	protected IActorAction action;
	 
	
		protected static IOutputEnvView setTheEnv(IOutputEnvView outEnvView ){
			return outEnvView;
		}
		public AbstractDelegateexecutor(String actorId, QActorContext myCtx, IOutputEnvView outEnvView )  throws Exception{
			super(actorId, myCtx,  
			"./srcMore/it/unibo/delegateexecutor/WorldTheory.pl",
			setTheEnv( outEnvView )  , "init");
			this.planFilePath = "./srcMore/it/unibo/delegateexecutor/plans.txt";
	  	}
		@Override
		protected void doJob() throws Exception {
			String name  = getName().replace("_ctrl", "");
			mysupport = (IMsgQueue) QActorUtils.getQActor( name ); 
			initStateTable(); 
	 		initSensorSystem();
	 		history.push(stateTab.get( "init" ));
	  	 	autoSendStateExecMsg();
	  		//QActorContext.terminateQActorSystem(this);//todo
		} 	
		/* 
		* ------------------------------------------------------------
		* PLANS
		* ------------------------------------------------------------
		*/    
	    //genAkkaMshHandleStructure
	    protected void initStateTable(){  	
	    	stateTab.put("handleToutBuiltIn",handleToutBuiltIn);
	    	stateTab.put("init",init);
	    	stateTab.put("waitForCmd",waitForCmd);
	    	stateTab.put("handleExecMsg",handleExecMsg);
	    }
	    StateFun handleToutBuiltIn = () -> {	
	    	try{	
	    		PlanRepeat pr = PlanRepeat.setUp("handleTout",-1);
	    		String myselfName = "handleToutBuiltIn";  
	    		println( "delegateexecutor tout : stops");  
	    		repeatPlanNoTransition(pr,myselfName,"application_"+myselfName,false,false);
	    	}catch(Exception e_handleToutBuiltIn){  
	    		println( getName() + " plan=handleToutBuiltIn WARNING:" + e_handleToutBuiltIn.getMessage() );
	    		QActorContext.terminateQActorSystem(this); 
	    	}
	    };//handleToutBuiltIn
	    
	    StateFun init = () -> {	
	    try{	
	     PlanRepeat pr = PlanRepeat.setUp("init",-1);
	    	String myselfName = "init";  
	    	//delay  ( no more reactive within a plan)
	    	aar = delayReactive(3000,"" , "");
	    	if( aar.getInterrupted() ) curPlanInExec   = "init";
	    	if( ! aar.getGoon() ) return ;
	    	temporaryStr = "\"Executor ready\"";
	    	println( temporaryStr );  
	    	//switchTo waitForCmd
	        switchToPlanAsNextState(pr, myselfName, "delegateexecutor_"+myselfName, 
	              "waitForCmd",false, false, null); 
	    }catch(Exception e_init){  
	    	 println( getName() + " plan=init WARNING:" + e_init.getMessage() );
	    	 QActorContext.terminateQActorSystem(this); 
	    }
	    };//init
	    
	    StateFun waitForCmd = () -> {	
	    try{	
	     PlanRepeat pr = PlanRepeat.setUp(getName()+"_waitForCmd",0);
	     pr.incNumIter(); 	
	    	String myselfName = "waitForCmd";  
	    	//bbb
	     msgTransition( pr,myselfName,"delegateexecutor_"+myselfName,false,
	          new StateFun[]{stateTab.get("handleExecMsg") }, 
	          new String[]{"true","M","exec" },
	          3600000, "handleToutBuiltIn" );//msgTransition
	    }catch(Exception e_waitForCmd){  
	    	 println( getName() + " plan=waitForCmd WARNING:" + e_waitForCmd.getMessage() );
	    	 QActorContext.terminateQActorSystem(this); 
	    }
	    };//waitForCmd
	    
	    StateFun handleExecMsg = () -> {	
	    try{	
	     PlanRepeat pr = PlanRepeat.setUp("handleExecMsg",-1);
	    	String myselfName = "handleExecMsg";  
	    	printCurrentMessage(false);
	    	//onMsg 
	    	setCurrentMsgFromStore(); 
	    	curT = Term.createTerm("mindcmd(h(X))");
	    	if( currentMessage != null && currentMessage.msgId().equals("exec") && 
	    		pengine.unify(curT, Term.createTerm("mindcmd(CMD)")) && 
	    		pengine.unify(curT, Term.createTerm( currentMessage.msgContent() ) )){ 
	    		//println("WARNING: variable substitution not yet fully implemented " ); 
	    		{//actionseq
	    		//PublishMsgMove
	    		parg = "usercmd(robotgui(h(X)))";
	    		sendMsgMqtt(  "unibo/qasys", "execMoveRobot", "virtualrobotexecutor", parg );
	    		//PublishMsgMove
	    		parg = "usercmd(robotgui(h(X)))";
	    		sendMsgMqtt(  "unibo/qasys", "execMoveRobot", "realrobotexecutor", parg );
	    		};//actionseq
	    	}
	    	//onMsg 
	    	setCurrentMsgFromStore(); 
	    	curT = Term.createTerm("mindcmd(w(X))");
	    	if( currentMessage != null && currentMessage.msgId().equals("exec") && 
	    		pengine.unify(curT, Term.createTerm("mindcmd(CMD)")) && 
	    		pengine.unify(curT, Term.createTerm( currentMessage.msgContent() ) )){ 
	    		//println("WARNING: variable substitution not yet fully implemented " ); 
	    		{//actionseq
	    		//PublishMsgMove
	    		parg = "usercmd(robotgui(w(X)))";
	    		sendMsgMqtt(  "unibo/qasys", "execMoveRobot", "virtualrobotexecutor", parg );
	    		//PublishMsgMove
	    		parg = "usercmd(robotgui(w(X)))";
	    		sendMsgMqtt(  "unibo/qasys", "execMoveRobot", "realrobotexecutor", parg );
	    		};//actionseq
	    	}
	    	//onMsg 
	    	setCurrentMsgFromStore(); 
	    	curT = Term.createTerm("mindcmd(s(X))");
	    	if( currentMessage != null && currentMessage.msgId().equals("exec") && 
	    		pengine.unify(curT, Term.createTerm("mindcmd(CMD)")) && 
	    		pengine.unify(curT, Term.createTerm( currentMessage.msgContent() ) )){ 
	    		//println("WARNING: variable substitution not yet fully implemented " ); 
	    		{//actionseq
	    		//PublishMsgMove
	    		parg = "usercmd(robotgui(s(X)))";
	    		sendMsgMqtt(  "unibo/qasys", "execMoveRobot", "virtualrobotexecutor", parg );
	    		//PublishMsgMove
	    		parg = "usercmd(robotgui(s(X)))";
	    		sendMsgMqtt(  "unibo/qasys", "execMoveRobot", "realrobotexecutor", parg );
	    		};//actionseq
	    	}
	    	//onMsg 
	    	setCurrentMsgFromStore(); 
	    	curT = Term.createTerm("mindcmd(a(X))");
	    	if( currentMessage != null && currentMessage.msgId().equals("exec") && 
	    		pengine.unify(curT, Term.createTerm("mindcmd(CMD)")) && 
	    		pengine.unify(curT, Term.createTerm( currentMessage.msgContent() ) )){ 
	    		//println("WARNING: variable substitution not yet fully implemented " ); 
	    		{//actionseq
	    		//PublishMsgMove
	    		parg = "usercmd(robotgui(a(X)))";
	    		sendMsgMqtt(  "unibo/qasys", "execMoveRobot", "virtualrobotexecutor", parg );
	    		//PublishMsgMove
	    		parg = "usercmd(robotgui(a(X)))";
	    		sendMsgMqtt(  "unibo/qasys", "execMoveRobot", "realrobotexecutor", parg );
	    		};//actionseq
	    	}
	    	//onMsg 
	    	setCurrentMsgFromStore(); 
	    	curT = Term.createTerm("mindcmd(d(X))");
	    	if( currentMessage != null && currentMessage.msgId().equals("exec") && 
	    		pengine.unify(curT, Term.createTerm("mindcmd(CMD)")) && 
	    		pengine.unify(curT, Term.createTerm( currentMessage.msgContent() ) )){ 
	    		//println("WARNING: variable substitution not yet fully implemented " ); 
	    		{//actionseq
	    		//PublishMsgMove
	    		parg = "usercmd(robotgui(d(X)))";
	    		sendMsgMqtt(  "unibo/qasys", "execMoveRobot", "virtualrobotexecutor", parg );
	    		//PublishMsgMove
	    		parg = "usercmd(robotgui(d(X)))";
	    		sendMsgMqtt(  "unibo/qasys", "execMoveRobot", "realrobotexecutor", parg );
	    		};//actionseq
	    	}
	    	repeatPlanNoTransition(pr,myselfName,"delegateexecutor_"+myselfName,false,true);
	    }catch(Exception e_handleExecMsg){  
	    	 println( getName() + " plan=handleExecMsg WARNING:" + e_handleExecMsg.getMessage() );
	    	 QActorContext.terminateQActorSystem(this); 
	    }
	    };//handleExecMsg
	    
	    protected void initSensorSystem(){
	    	//doing nothing in a QActor
	    }
	
	}