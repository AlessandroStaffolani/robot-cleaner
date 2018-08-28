/*
===============================================================
resourceModel.pl
===============================================================
*/
model( type(executor, virtualRobot), name(soffritti), value(true) ). 
model( type(executor, realRobot), name(fuffolo), value(true) ). 
model( type(actuator, leds),      name(1), value(off) ).
model( type(actuator, leds),      name(2), value(off) ).
model( type(sensor, temperature), name(cityTemperature),   value(12)  ).
model( type(sensor, clock), name(clock1),   value(8)  ).
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
	changeModelItem( virtualRobot, soffritti, true),
	changeModelItem( realRobot, fuffolo, true).
changedModelAction( temperature, cityTemperature, V  ):-	 
    		changeModelItem( virtualRobot, soffritti, false),
    		changeModelItem( realRobot, fuffolo, false),
    		emitevent( resourceChange, resourceChange( sensor, temperature, cityTemperature, off ) ).
    		
changedModelAction( clock, clock1, V):-
	startTime( START ),
	endTime( END ),
	eval( get, V, START),
	eval( let, V, END),
	changeModelItem( virtualRobot, soffritti, true),
	changeModelItem( realRobot, fuffolo, true),
	getModelItem( sensor, temperature, TEMPNAME, TEMP ),
	changedModelAction( temperature, TEMPNAME, TEMP).
changedModelAction( clock, clock1, V):-
	changeModelItem( virtualRobot, soffritti, false),
    	changeModelItem( realRobot, fuffolo, false),
    	emitevent( resourceChange, resourceChange( sensor, clock, clock1, off ) ).

changedModelAction( leds, NAME, V  ):- 
	%%output(NAME), output(V),
	emitevent( resourceChange, resourceChange( actuator, leds, NAME, V ) ).

changedModelAction( virtualRobot, soffritti, CMD ).
    		
changedModelAction( realRobot, fuffolo, CMD ).

emitevent( EVID, EVCONTENT ) :- 
	actorobj( Actor ), 
	output( emit( Actor, EVID, EVCONTENT ) ),
	Actor <- emit( EVID, EVCONTENT ).
	
%%%  initialize
initResourceTheory :- output("initializing the initResourceTheory ...").
:- initialization(initResourceTheory).