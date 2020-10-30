#!/bin/bash -e

if [[ -z $1 ]]; then
    echo "No container specified"
    exit 1
fi

if [[ "$(docker ps -aq -f name=^/${1}$ 2> /dev/null)" == "" ]]; then
    echo "Container \"$1\" does not exist, exiting."
    exit 1
fi

log=$(docker inspect -f '{{.LogPath}}' $1 2> /dev/null)
truncate -s 0 $log
