#!/bin/bash

# import constants and functions
[ -f "./inc/all.sh" ] && source "./inc/all.sh" || source "./scripts/inc/all.sh"

# warn if any args are missing
if [ -z "$ACT" ] || [ -z "$ENV" ] || [ -z "$PKG" ] || [ "$ENV" = "local" ]; then
	echo "/bin/bash daemon.sh start|stop|restart|delete aws dev|beta|stable"
	exit 1
fi

command="pm2 desc msb-$PKG-$ENV >/dev/null && pm2 $ACT msb-$PKG-$ENV"
if [ "$ACT" = "start" ]; then
	command="[ -f \"app.mjs\" ] && pm2 start app.mjs --name msb-$PKG-$ENV"
fi

sshCommands=(
	"cd $packageDir"
	"$command"
	"pm2 save"
)
sshRun "${sshCommands[@]}"
