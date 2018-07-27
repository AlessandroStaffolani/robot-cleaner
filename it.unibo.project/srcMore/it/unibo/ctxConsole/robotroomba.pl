%====================================================================================
% Context ctxConsole  SYSTEM-configuration: file it.unibo.ctxConsole.robotRoomba.pl 
%====================================================================================
context(ctxrobot, "localhost",  "TCP", "8032" ).  		 
context(ctxconsole, "localhost",  "TCP", "8042" ).  		 
%%% -------------------------------------------
qactor( robotexecutor , ctxrobot, "it.unibo.robotexecutor.MsgHandle_Robotexecutor"   ). %%store msgs 
qactor( robotexecutor_ctrl , ctxrobot, "it.unibo.robotexecutor.Robotexecutor"   ). %%control-driven 
qactor( mindrobot , ctxrobot, "it.unibo.mindrobot.MsgHandle_Mindrobot"   ). %%store msgs 
qactor( mindrobot_ctrl , ctxrobot, "it.unibo.mindrobot.Mindrobot"   ). %%control-driven 
qactor( test , ctxconsole, "it.unibo.test.MsgHandle_Test"   ). %%store msgs 
qactor( test_ctrl , ctxconsole, "it.unibo.test.Test"   ). %%control-driven 
%%% -------------------------------------------
%%% -------------------------------------------

