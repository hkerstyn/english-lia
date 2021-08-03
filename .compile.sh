#!/bin/sh
clear
trap "read" ERR 
cd ~/english-lia
rollup -c
jsdoc -c jsdoc.config.json 
$ZSHPATH/functions/ws x
