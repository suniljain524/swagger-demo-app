#!/bin/bash
run_environment(){
		echo "*** Omni Tag Script is being built. Please wait...***"
		sleep 0.5
		echo	
	   	echo
	 	echo +++ Building Omni TagScript ... +++
	    	sudo NODE_ENV="$1" npm run publish
		echo
	    echo
	   	echo  "Omni Tag Script generated successfully and uploaded to S3"
		echo
}

# Getting the environment varibale from terminal and running enviroment accordingly	
case "$1" in
	dev) run_environment $1
	;;
    prod) run_environment $1 
	;;
	qa)  run_environment $1
	;;
	*) echo "\033[1;31mInvalid environment value >>$1<< , please use - dev, qa or prod\033[0m\n"
    ;;
esac