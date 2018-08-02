package it.unibo.utils;

import java.util.Calendar;


import it.unibo.qactors.akka.QActor;

public class customDate {

	public static void getHours(QActor myActor) {
		Calendar now = Calendar.getInstance();
		int hours = now.get(Calendar.HOUR);
		/*Only For test*/
		hours = 7;
		System.out.println("Ore: " + hours);
		/*************************************/
		myActor.replaceRule("currentTime(X)", "currentTime("+hours+")");
	}
}
