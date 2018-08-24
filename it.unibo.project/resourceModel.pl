/*
===============================================================
resourceModel.pl
===============================================================
*/
model( type(actuator, virtualRobot), name(soffritti), value(false) ). 
model( type(actuator, realRobot), name(fuffolo), value(false) ). 
model( type(actuator, leds),      name(ledHue), value(off) ).
model( type(actuator, leds),      name(ledRobot), value(off) ).
model( type(sensor, temperature), name(cityTemperature),   value(12)  ).
model( type(sensor, time), name(clock1),   value(8)  ).
model( type(sensor, sonarVirtual), name(sonar1), value(0)).
model( type(sensor, sonarVirtual), name(sonar2), value(0)).
model( type(sensor, sonarRobot), name(sonarVirtual), value(0)).
model( type(sensor, sonarRobot), name(sonarReal), value(0)).
 
getModelItem( TYPE, CATEG, NAME, VALUE ) :-
		model( type(TYPE, CATEG), name(NAME), value(VALUE) ).

changeModelItem( CATEG, NAME, VALUE ) :-
 		replaceRule( 
			model( type(TYPE, CATEG), name(NAME), value(_) ),  
			model( type(TYPE, CATEG), name(NAME), value(VALUE) ) 		
		),!,
		%%output( changedModelAction(CATEG, NAME, VALUE) ),
		( changedModelAction(CATEG, NAME, VALUE) %%to be defined by the appl designer
		  ; true ).	
		  
eval( let, X, X ).
eval( let, X, V ):- eval( lt, X , V ) .
eval( get, X, X ). 
eval( get, X, V ):- eval( gt, X , V ) .
	
maxTemperature(25).
startTime(7).
endTime(10).
	
changedModelAction( temperature, cityTemperature, V  ):-
	maxTemperature( MAX ),
	eval( let, V , MAX ), !,   
	%%output( getModelItem( sensor, temperature, cityTemperature, V)),
	changeModelItem( virtualRobot, soffritti, true).
changedModelAction( temperature, cityTemperature, V  ):-	 
 			changeModelItem( leds, ledHue, off),
    		changeModelItem( virtualRobot, soffritti, false).

changedModelAction( leds, ledHue, V  ):-
 			emitevent( ctrlEvent, ctrlEvent( leds, ledHue, V) ).

changedModelAction( virtualRobot, soffritti, CMD ):- 
    		emitevent( execMoveRobot, usercmd(CMD)).

emitevent( EVID, EVCONTENT ) :- 
	actorobj( Actor ), 
	output( emit( Actor, EVID, EVCONTENT ) ),
	Actor <- emit( EVID, EVCONTENT ).
%%%  initialize
initResourceTheory :- output("initializing the initResourceTheory ...").
:- initialization(initResourceTheory).