#!/bin/bash

# import constants and functions
[ -f "./inc/all.sh" ] && source "./inc/all.sh" || source "./scripts/inc/all.sh"

BUILD=
FULL=
while test $# -gt 0; do
	case "$1" in
		-b) BUILD=true; shift; ;;
		-f) FULL=true; shift; ;;
		*) break; ;;
	esac
done

if [ "$FULL" = "true" ]; then
	echoAndDo "/bin/bash ./scripts/pre-build.sh"
fi
if [ "$FULL" = "true" ] || [ "$BUILD" = "true" ]; then
	echoAndDo "/bin/bash ./scripts/build.sh"
fi
if [ "$FULL" = "true" ]; then
	echoAndDo "/bin/bash ./scripts/post-build.sh"
fi

# start the bot
echoAndDo "cd $appRootDir/dist"
echoAndDo "node app.mjs --dev"
