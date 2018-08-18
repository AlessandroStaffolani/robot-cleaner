package it.unibo.utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;

import java.net.URL;

import org.json.JSONException;
import org.json.JSONObject;

public class clientRest {

	public static void sendPutBlink(boolean value, String color, String id_lamp, String url) {
		try {	
			URL urlblink = new URL(url);
			//URL urlswitch = new URL("http://127.0.0.1:5005/lamp/"+id_lamp);
			System.out.println(urlblink);
			
		    HttpURLConnection connection = (HttpURLConnection) urlblink.openConnection();
		    connection.setConnectTimeout(5000);//5 secs
		    connection.setReadTimeout(5000);//5 secs
	
		    connection.setRequestMethod("PUT");
		    connection.setDoOutput(true);
		    connection.setRequestProperty("Content-Type", "application/json");
		    
		    
		    JSONObject json = new JSONObject();
		    json.put("value", value);
		    json.put("color", color);
		    System.out.println("Json object to send: " + json.toString());
		    OutputStreamWriter out = new OutputStreamWriter(connection.getOutputStream());  
		    out.write(
		           json.toString());
		    out.flush();
		    out.close();
	
		    int res = connection.getResponseCode();
	
		    System.out.println(res);
	
	
		    InputStream is = connection.getInputStream();
		    BufferedReader br = new BufferedReader(new InputStreamReader(is));
		    String line = null;
		    System.out.println("Response received: ");
		    while((line = br.readLine() ) != null) {
		        System.out.println(line);
		    }
		    connection.disconnect();
		} catch (IOException | JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}