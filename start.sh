#!/bin/bash
sudo modprobe w1-gpio
sudo modprobe w1-therm
node server.js &
