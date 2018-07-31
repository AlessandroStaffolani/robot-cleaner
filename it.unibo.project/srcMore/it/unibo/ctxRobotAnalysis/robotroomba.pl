%====================================================================================
% Context ctxRobotAnalysis  SYSTEM-configuration: file it.unibo.ctxRobotAnalysis.robotRoomba.pl 
%====================================================================================
context(ctxrobotanalysis, "localhost",  "TCP", "8032" ).  		 
context(ctxconsoleanalysis, "localhost",  "TCP", "8042" ).  		 
%%% -------------------------------------------
qactor( robotexecutoranalysis , ctxrobotanalysis, "it.unibo.robotexecutoranalysis.MsgHandle_Robotexecutoranalysis"   ). %%store msgs 
qactor( robotexecutoranalysis_ctrl , ctxrobotanalysis, "it.unibo.robotexecutoranalysis.Robotexecutoranalysis"   ). %%control-driven 
qactor( mindrobotanalysis , ctxrobotanalysis, "it.unibo.mindrobotanalysis.MsgHandle_Mindrobotanalysis"   ). %%store msgs 
qactor( mindrobotanalysis_ctrl , ctxrobotanalysis, "it.unibo.mindrobotanalysis.Mindrobotanalysis"   ). %%control-driven 
qactor( testanalysis , ctxconsoleanalysis, "it.unibo.testanalysis.MsgHandle_Testanalysis"   ). %%store msgs 
qactor( testanalysis_ctrl , ctxconsoleanalysis, "it.unibo.testanalysis.Testanalysis"   ). %%control-driven 
%%% -------------------------------------------
%%% -------------------------------------------

