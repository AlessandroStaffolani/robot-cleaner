package it.unibo.utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;

import it.unibo.exploremap.stella.model.Box;
import it.unibo.qactors.akka.QActor;

import java.net.URL;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class clientRest {

	private final static HashMap<String, String> data = new HashMap<String, String>();

	public static void sendPutBlink(QActor qa, String value, String color, String code_lamp) {
		try {
			URL urlblink = new URL("http://localhost:5005/lamp/" + code_lamp + "/blink");
			System.out.println("Try to call: " + urlblink.toString());
			// URL urlswitch = new URL("http://127.0.0.1:5005/lamp/"+code_lamp);
			System.out.println(urlblink);

			HttpURLConnection connection = (HttpURLConnection) urlblink.openConnection();
			connection.setConnectTimeout(5000);// 5 secs
			connection.setReadTimeout(5000);// 5 secs

			connection.setRequestMethod("PUT");
			connection.setDoOutput(true);
			connection.setRequestProperty("Content-Type", "application/json");

			JSONObject json = new JSONObject();
			for (String key : data.keySet()) {
				json.put(key, data.get(key));
			}
			json.put("value", value);
			json.put("color", color);
			System.out.println("Json object to send: " + json.toString());
			OutputStreamWriter out = new OutputStreamWriter(connection.getOutputStream());
			out.write(json.toString());
			out.flush();
			out.close();

			int res = connection.getResponseCode();

			System.out.println(res);

			InputStream is = connection.getInputStream();
			BufferedReader br = new BufferedReader(new InputStreamReader(is));
			String line = null;
			System.out.println("Response received: ");
			while ((line = br.readLine()) != null) {
				System.out.println(line);
			}
			connection.disconnect();
		} catch (IOException | JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public static void addData(QActor qa, String key, String value) {
		data.put(key, value);
	}

	public static void clearData(QActor qa) {
		for (String key : data.keySet()) {
			data.remove(key);
		}
	}

	public static void sendPut(QActor qa, String url) {
		try {
			URL urlblink = new URL(url);
			// URL urlswitch = new URL("http://127.0.0.1:5005/lamp/"+id_lamp);
			System.out.println(urlblink);

			HttpURLConnection connection = (HttpURLConnection) urlblink.openConnection();
			connection.setConnectTimeout(5000);// 5 secs
			connection.setReadTimeout(5000);// 5 secs

			connection.setRequestMethod("PUT");
			connection.setDoOutput(true);
			connection.setRequestProperty("Content-Type", "application/json");

			JSONObject json = new JSONObject();
			for (String key : data.keySet()) {
				json.put(key, data.get(key));
			}
			// json.put("value", value);
			// json.put("color", color);
			System.out.println("Json object to send: " + json.toString());
			OutputStreamWriter out = new OutputStreamWriter(connection.getOutputStream());
			out.write(json.toString());
			out.flush();
			out.close();

			int res = connection.getResponseCode();

			System.out.println(res);

			InputStream is = connection.getInputStream();
			BufferedReader br = new BufferedReader(new InputStreamReader(is));
			String line = null;
			System.out.println("Response received: ");
			while ((line = br.readLine()) != null) {
				System.out.println(line);
			}
			connection.disconnect();
		} catch (IOException | JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public static void postMap(QActor qa, List<ArrayList<Box>> roomMap) {

		try {

			URL url = new URL("http://localhost:5000/map");
			System.out.println("Try to call: " + url.toString());
			System.out.println(url);

			HttpURLConnection connection = (HttpURLConnection) url.openConnection();
			connection.setConnectTimeout(5000);// 5 secs
			connection.setReadTimeout(5000);// 5 secs

			connection.setRequestMethod("POST");
			connection.setDoOutput(true);
			connection.setRequestProperty("Content-Type", "application/json");

			JSONArray jsonMap = new JSONArray();
			for (int i = 0; i < roomMap.size(); i++) {
				ArrayList<Box> row = roomMap.get(i);
				JSONArray jsonRow = new JSONArray();
				for (int j = 0; j < row.size(); j++) {
					Box box = row.get(j);
					JSONObject jsonBox = new JSONObject();
					jsonBox.put("x", i);
					jsonBox.put("y", j);
					if (box.isDirty())
						jsonBox.put("content", "0");
					else if (box.isObstacle())
						jsonBox.put("content", "X");
					else if (box.isRobot())
						jsonBox.put("content", "R");
					else
						jsonBox.put("content", "1");
					jsonRow.put(jsonBox);
				}
				jsonMap.put(jsonRow);
			}
			JSONObject body = new JSONObject();
			body.put("map", jsonMap);

			System.out.println(body.toString());
			
			OutputStreamWriter out = new OutputStreamWriter(connection.getOutputStream());
			out.write(body.toString());
			out.flush();
			out.close();

			int res = connection.getResponseCode();

			System.out.println(res);

			InputStream is = connection.getInputStream();
			BufferedReader br = new BufferedReader(new InputStreamReader(is));
			String line = null;
			System.out.println("Response received: ");
			while ((line = br.readLine()) != null) {
				System.out.println(line);
			}
			connection.disconnect();

		} catch (IOException | JSONException e) {
			e.printStackTrace();
		}
	}

}