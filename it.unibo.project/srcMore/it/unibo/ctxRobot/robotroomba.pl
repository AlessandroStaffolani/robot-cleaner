%====================================================================================
% Context ctxRobot  SYSTEM-configuration: file it.unibo.ctxRobot.robotRoomba.pl 
%====================================================================================
context(ctxrobot, "localhost",  "TCP", "8032" ).  		 
context(ctxresourcemodel, "localhost",  "TCP", "8030" ).  		 
%%% -------------------------------------------
qactor( robotexecutor , ctxrobot, "it.unibo.robotexecutor.MsgHandle_Robotexecutor"   ). %%store msgs 
qactor( robotexecutor_ctrl , ctxrobot, "it.unibo.robotexecutor.Robotexecutor"   ). %%control-driven 
qactor( mindrobot , ctxresourcemodel, "it.unibo.mindrobot.MsgHandle_Mindrobot"   ). %%store msgs 
qactor( mindrobot_ctrl , ctxresourcemodel, "it.unibo.mindrobot.Mindrobot"   ). %%control-driven 
%%% -------------------------------------------
%%% -------------------------------------------

