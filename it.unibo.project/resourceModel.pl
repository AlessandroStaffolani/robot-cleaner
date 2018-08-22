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

/*
* Model methods 
*/
 
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

emitevent( EVID, EVCONTENT ) :- 
	actorobj( Actor ), 
	%%output( emit( Actor, EVID, EVCONTENT ) ),
	Actor <- emit( EVID, EVCONTENT ).

/*
* System constants
*/

maxTemperature(25).
startTime(7).
endTime(10).

/*
* Model Actions
*/

changedModelAction( temperature, cityTemperature, V  ):-
	maxTemperature( MAX ),
	eval( let, V , MAX ), !,   
	changeModelItem( virtualRobot, soffritti, true).
changedModelAction( temperature, cityTemperature, V  ):-	 
 			changeModelItem( leds, ledHue, off),
    		changeModelItem( virtualRobot, soffritti, false).

changedModelAction( leds, ledHue, V  ):-
 			emitevent( ctrlEvent, ctrlEvent( leds, ledHue, V) ).

changedModelAction( virtualRobot, soffritti, CMD ):- 
    		emitevent( execMoveRobot, usercmd(CMD)).
    		
/*
* Global methods
*/
  		
eval( let, X, X ). %% lower equal than implementation using worldTheory.pl in src-more/it/unibo/mindrobot/
eval( let, X, V ):- eval( lt, X , V ) .
eval( get, X, X ). %% greater equal than implementation using worldTheory.pl in src-more/it/unibo/mindrobot/
eval( get, X, V ):- eval( gt, X , V ) .

/*
Old Rules
eval( let, X, X ). // lower equal than implementation using worldTheory.pl in src-more/it/unibo/mindrobot/
		eval( let, X, V ):- eval( lt, X , V ) .
		eval( get, X, X ). // greater equal than implementation using worldTheory.pl in src-more/it/unibo/mindrobot/
		eval( get, X, V ):- eval( gt, X , V ) .
		maxTemperature(25).
		startTime(7).
		endTime(10).
		currentTemperature(12).
		currentTime(8).
		checkTemperature(cold):-
				maxTemperature(MAX), 
				currentTemperature(CURRENT), 
				eval(let, CURRENT, MAX), !.
		checkTemperature(hot):- 
				maxTemperature(MAX), 
				currentTemperature(CURRENT), 
				eval(gt, CURRENT, MAX), !.
		checkTime(X):- 
				startTime(START),
				endTime(END),
				currentTime(CURRENT),
				eval(get, CURRENT, START),
				eval(let, CURRENT, END).
		checkConstraints(X):-
			checkTemperature(cold),
			checkTime(X).
*/