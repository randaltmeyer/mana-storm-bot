#!/bin/bash

# import constants and functions
[ -f "./inc/all.sh" ] && source "./inc/all.sh" || source "./scripts/inc/all.sh"

echoLog "build.sh starting ..."

echoAndDo "cd $appRootDir"
echoAndDo "tsc --build tsconfig.json"

echoLog "build.sh done."
