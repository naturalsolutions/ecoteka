#!/bin/sh

mkdir -p /etc/periodic/scripts
echo "0 3 * * * run-parts /etc/periodic/scripts" >> /etc/crontabs/root 

crontab -l
crond -f -l 8
