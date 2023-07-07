#!/bin/bash

# import constants and functions
[ -f "./inc/all.sh" ] && source "./inc/all.sh" || source "./scripts/inc/all.sh"

echoLog "post-build.sh starting ..."

echoAndDo "cd $appRootDir/dist"
echoAndDo "ln -s ../data data"

echoLog "post-build.sh done."
