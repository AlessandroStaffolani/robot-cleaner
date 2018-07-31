%====================================================================================
% Context ctxRobot  SYSTEM-configuration: file it.unibo.ctxRobot.robotRoomba.pl 
%====================================================================================
context(ctxrobot, "localhost",  "TCP", "8032" ).  		 
context(ctxvirtualrobot, "localhost",  "TCP", "8042" ).  		 
%%% -------------------------------------------
qactor( virtualrobotexecutor , ctxvirtualrobot, "it.unibo.virtualrobotexecutor.MsgHandle_Virtualrobotexecutor"   ). %%store msgs 
qactor( virtualrobotexecutor_ctrl , ctxvirtualrobot, "it.unibo.virtualrobotexecutor.Virtualrobotexecutor"   ). %%control-driven 
qactor( robotexecutor , ctxrobot, "it.unibo.robotexecutor.MsgHandle_Robotexecutor"   ). %%store msgs 
qactor( robotexecutor_ctrl , ctxrobot, "it.unibo.robotexecutor.Robotexecutor"   ). %%control-driven 
%%% -------------------------------------------
%%% -------------------------------------------

