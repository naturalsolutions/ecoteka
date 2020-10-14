#!/bin/sh

duplicity full --no-encryption /home/duplicity/src file:///home/duplicity/backup
duplicity remove-older-than 7D file:///home/duplicity/backup