#!/bin/bash

# import constants and functions
[ -f "./inc/all.sh" ] && source "./inc/all.sh" || source "./scripts/inc/all.sh"

echoLog "pre-build.sh starting ..."

echoAndDo "cd $appRootDir"
echoAndDo "rm -rf dist"
echoAndDo "rm -rf types"

echoLog "pre-build.sh done."
