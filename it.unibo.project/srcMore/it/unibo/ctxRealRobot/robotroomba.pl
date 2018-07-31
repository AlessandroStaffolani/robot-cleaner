%====================================================================================
% Context ctxRealRobot  SYSTEM-configuration: file it.unibo.ctxRealRobot.robotRoomba.pl 
%====================================================================================
context(ctxvirtualrobot, "localhost",  "TCP", "8032" ).  		 
context(ctxresourcemodel, "localhost",  "TCP", "8030" ).  		 
context(ctxrealrobot, "localhost",  "TCP", "8031" ).  		 
%%% -------------------------------------------
qactor( virtualrobotexecutor , ctxvirtualrobot, "it.unibo.virtualrobotexecutor.MsgHandle_Virtualrobotexecutor"   ). %%store msgs 
qactor( virtualrobotexecutor_ctrl , ctxvirtualrobot, "it.unibo.virtualrobotexecutor.Virtualrobotexecutor"   ). %%control-driven 
qactor( realrobotexecutor , ctxrealrobot, "it.unibo.realrobotexecutor.MsgHandle_Realrobotexecutor"   ). %%store msgs 
qactor( realrobotexecutor_ctrl , ctxrealrobot, "it.unibo.realrobotexecutor.Realrobotexecutor"   ). %%control-driven 
qactor( mindrobot , ctxresourcemodel, "it.unibo.mindrobot.MsgHandle_Mindrobot"   ). %%store msgs 
qactor( mindrobot_ctrl , ctxresourcemodel, "it.unibo.mindrobot.Mindrobot"   ). %%control-driven 
%%% -------------------------------------------
%%% -------------------------------------------

