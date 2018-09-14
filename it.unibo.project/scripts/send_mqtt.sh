#!/bin/bash

ip=$1
topic=$2

if test $# -ne 2; then
	echo "send_mqtt.sh [ip] [topic]"
	exit 0
fi

while true; do

	var=$(python3 obstacle_detector.py)
	echo $var
	if test $var -lt 30; then
		msg="msg(realSonarDetect,event,real_robot,mindrobot,realSonarDetect(sonarReal,$var),1)"
		echo $msg
		mosquitto_pub -h $ip -m "$msg" -t $topic
	fi
	sleep 0.5

done
