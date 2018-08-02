package it.unibo.utils;

import java.util.Date;
import java.text.SimpleDateFormat;

import it.unibo.qactors.akka.QActor;

public class customDate {

	public static void getHours(QActor myActor) {
		SimpleDateFormat sdf = new SimpleDateFormat("HH");
		String hours = sdf.format(new Date());
		/*Only For test*/
		//hours = "7";
		//System.out.println("Ore: " + hours);
		/*************************************/
		myActor.replaceRule("currentTime(X)", "currentTime("+hours+")");
	}
}
