%====================================================================================
% Context ctxRobotMockLedAnalysis  SYSTEM-configuration: file it.unibo.ctxRobotMockLedAnalysis.robotRoomba.pl 
%====================================================================================
context(ctxrobotmockledanalysis, "localhost",  "TCP", "8032" ).  		 
context(ctxconsolemockledanalysis, "localhost",  "TCP", "8042" ).  		 
context(ctxledmockledanalysis, "localhost",  "TCP", "8052" ).  		 
%%% -------------------------------------------
qactor( robotexecutoranalysis , ctxrobotmockledanalysis, "it.unibo.robotexecutoranalysis.MsgHandle_Robotexecutoranalysis"   ). %%store msgs 
qactor( robotexecutoranalysis_ctrl , ctxrobotmockledanalysis, "it.unibo.robotexecutoranalysis.Robotexecutoranalysis"   ). %%control-driven 
qactor( mindrobotanalysis , ctxrobotmockledanalysis, "it.unibo.mindrobotanalysis.MsgHandle_Mindrobotanalysis"   ). %%store msgs 
qactor( mindrobotanalysis_ctrl , ctxrobotmockledanalysis, "it.unibo.mindrobotanalysis.Mindrobotanalysis"   ). %%control-driven 
qactor( ledanalysis , ctxledmockledanalysis, "it.unibo.ledanalysis.MsgHandle_Ledanalysis"   ). %%store msgs 
qactor( ledanalysis_ctrl , ctxledmockledanalysis, "it.unibo.ledanalysis.Ledanalysis"   ). %%control-driven 
qactor( testanalysis , ctxconsolemockledanalysis, "it.unibo.testanalysis.MsgHandle_Testanalysis"   ). %%store msgs 
qactor( testanalysis_ctrl , ctxconsolemockledanalysis, "it.unibo.testanalysis.Testanalysis"   ). %%control-driven 
%%% -------------------------------------------
%%% -------------------------------------------

