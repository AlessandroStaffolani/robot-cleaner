%====================================================================================
% Context ctxConsoleAnalysis  SYSTEM-configuration: file it.unibo.ctxConsoleAnalysis.robotRoomba.pl 
%====================================================================================
context(ctxrobotanalysis, "localhost",  "TCP", "8032" ).  		 
context(ctxconsoleanalysis, "localhost",  "TCP", "8042" ).  		 
%%% -------------------------------------------
qactor( robotanalysis , ctxrobotanalysis, "it.unibo.robotanalysis.MsgHandle_Robotanalysis"   ). %%store msgs 
qactor( robotanalysis_ctrl , ctxrobotanalysis, "it.unibo.robotanalysis.Robotanalysis"   ). %%control-driven 
qactor( consoleanalysis , ctxconsoleanalysis, "it.unibo.consoleanalysis.MsgHandle_Consoleanalysis"   ). %%store msgs 
qactor( consoleanalysis_ctrl , ctxconsoleanalysis, "it.unibo.consoleanalysis.Consoleanalysis"   ). %%control-driven 
%%% -------------------------------------------
%%% -------------------------------------------

