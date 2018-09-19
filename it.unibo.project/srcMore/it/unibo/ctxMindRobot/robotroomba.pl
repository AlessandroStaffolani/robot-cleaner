%====================================================================================
% Context ctxMindRobot  SYSTEM-configuration: file it.unibo.ctxMindRobot.robotRoomba.pl 
%====================================================================================
context(ctxvirtualrobot, "localhost",  "TCP", "8032" ).  		 
context(ctxmindrobot, "localhost",  "TCP", "8030" ).  		 
context(ctxrealrobot, "localhost",  "TCP", "8031" ).  		 
%%% -------------------------------------------
qactor( virtualrobotexecutor , ctxvirtualrobot, "it.unibo.virtualrobotexecutor.MsgHandle_Virtualrobotexecutor"   ). %%store msgs 
qactor( virtualrobotexecutor_ctrl , ctxvirtualrobot, "it.unibo.virtualrobotexecutor.Virtualrobotexecutor"   ). %%control-driven 
qactor( realrobotexecutor , ctxrealrobot, "it.unibo.realrobotexecutor.MsgHandle_Realrobotexecutor"   ). %%store msgs 
qactor( realrobotexecutor_ctrl , ctxrealrobot, "it.unibo.realrobotexecutor.Realrobotexecutor"   ). %%control-driven 
qactor( mindrobot , ctxmindrobot, "it.unibo.mindrobot.MsgHandle_Mindrobot"   ). %%store msgs 
qactor( mindrobot_ctrl , ctxmindrobot, "it.unibo.mindrobot.Mindrobot"   ). %%control-driven 
qactor( delegateexecutor , ctxmindrobot, "it.unibo.delegateexecutor.MsgHandle_Delegateexecutor"   ). %%store msgs 
qactor( delegateexecutor_ctrl , ctxmindrobot, "it.unibo.delegateexecutor.Delegateexecutor"   ). %%control-driven 
qactor( autopilot , ctxmindrobot, "it.unibo.autopilot.MsgHandle_Autopilot"   ). %%store msgs 
qactor( autopilot_ctrl , ctxmindrobot, "it.unibo.autopilot.Autopilot"   ). %%control-driven 
%%% -------------------------------------------
%%% -------------------------------------------

