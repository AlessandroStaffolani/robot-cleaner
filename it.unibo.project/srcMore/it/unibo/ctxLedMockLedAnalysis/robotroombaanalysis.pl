%====================================================================================
% Context ctxLedMockLedAnalysis  SYSTEM-configuration: file it.unibo.ctxLedMockLedAnalysis.robotRoombaAnalysis.pl 
%====================================================================================
context(ctxrobotmockledanalysis, "localhost",  "TCP", "8032" ).  		 
context(ctxconsolemockledanalysis, "localhost",  "TCP", "8042" ).  		 
context(ctxledmockledanalysis, "localhost",  "TCP", "8052" ).  		 
%%% -------------------------------------------
qactor( robotexecutormockledanalysis , ctxrobotmockledanalysis, "it.unibo.robotexecutormockledanalysis.MsgHandle_Robotexecutormockledanalysis"   ). %%store msgs 
qactor( robotexecutormockledanalysis_ctrl , ctxrobotmockledanalysis, "it.unibo.robotexecutormockledanalysis.Robotexecutormockledanalysis"   ). %%control-driven 
qactor( mindrobotmockledanalysis , ctxrobotmockledanalysis, "it.unibo.mindrobotmockledanalysis.MsgHandle_Mindrobotmockledanalysis"   ). %%store msgs 
qactor( mindrobotmockledanalysis_ctrl , ctxrobotmockledanalysis, "it.unibo.mindrobotmockledanalysis.Mindrobotmockledanalysis"   ). %%control-driven 
qactor( ledmockledanalysis , ctxledmockledanalysis, "it.unibo.ledmockledanalysis.MsgHandle_Ledmockledanalysis"   ). %%store msgs 
qactor( ledmockledanalysis_ctrl , ctxledmockledanalysis, "it.unibo.ledmockledanalysis.Ledmockledanalysis"   ). %%control-driven 
qactor( testmockledanalysis , ctxconsolemockledanalysis, "it.unibo.testmockledanalysis.MsgHandle_Testmockledanalysis"   ). %%store msgs 
qactor( testmockledanalysis_ctrl , ctxconsolemockledanalysis, "it.unibo.testmockledanalysis.Testmockledanalysis"   ). %%control-driven 
%%% -------------------------------------------
%%% -------------------------------------------

