#!/bin/bash

ip=$1
port=$2
topic=$3

if test $# -ne 3; then
	echo "send_mqtt.sh [ip] [port] [topic]"
	exit 0
fi

while true; do

	var=$(python3 obstacle_detector.py)
	echo $var
	if test $var -lt 30; then
		msg="msg(realSonarDetect,event,real_robot,mindrobot,realSonarDetect(sonarReal,$var),1)"
		echo $msg
		python3 mqtt_sender.py $ip $port $topic "$msg"
	fi
	sleep 1

done
