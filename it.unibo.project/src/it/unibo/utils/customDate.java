package it.unibo.utils;

import java.util.Calendar;


import it.unibo.qactors.akka.QActor;

public class customDate {

	public static void getHours(QActor myActor) {
		Calendar now = Calendar.getInstance();
		int hours = now.get(Calendar.HOUR);
		System.out.println("Ore: " + hours);
		hours = 8;
		myActor.replaceRule("currentTime(X)", "currentTime(hours)");
	}
}
