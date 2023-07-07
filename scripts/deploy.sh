#!/bin/bash

# import constants and functions
[ -f "./inc/all.sh" ] && source "./inc/all.sh" || source "./scripts/inc/all.sh"

# warn if any args are missing
if [ -z "$ENV" ] || [ -z "$PKG" ]; then
	echoLog "/bin/bash deploy.sh dev|beta|stable aws"
	exit 1
fi

echoAndDo "/bin/bash ./scripts/pre-build.sh"
echoAndDo "/bin/bash ./scripts/build.sh"
echoAndDo "/bin/bash ./scripts/post-build.sh"

# other dir vars
deployDirRemote="$botDir/deploy"
deployDirLocal="$appRootDir/deploy"

#region setup deploy folder, zip deployment, deploy it, and delete local deployment

echoAndDo "rm -rf $deployDirLocal; mkdir $deployDirLocal"

# build a tmp deploy folder and add files that need to get deployed
echoAndDo "mkdir $deployDirLocal/tmp; cd $deployDirLocal/tmp"
echoAndDo "cp -r $appRootDir/dist/handlers $deployDirLocal/tmp"
echoAndDo "cp -r $appRootDir/dist/utils $deployDirLocal/tmp"
echoAndDo "cp $appRootDir/dist/app.mjs $deployDirLocal/tmp"
echoAndDo "cp $appRootDir/package.json $deployDirLocal/tmp"

# zip deployment files
echoAndDo "zip -rq9 $deployDirLocal/$PKG.zip *"

# stage files in remote deploy folder
scpTo "$deployDirLocal/$PKG.zip" "$deployDirRemote/$PKG.zip"

# remove local deploy
echoAndDo "rm -rf $deployDirLocal"

#endregion

# execute the deploy script on the remote
NOW=`date '+%F-%H%M'`;
packageDirTmp="$packageDir-tmp"
packageDirOld="$packageDir-$NOW"
sshCommands=(
	"mkdir $packageDirTmp"
	"ln -s $botDir/data $packageDirTmp/data"
	"unzip -q $deployDirRemote/$PKG -d $packageDirTmp"
	"rm -f $deployDirRemote/$PKG.zip"
	"cd $packageDirTmp"
	"npm install"
	"pm2 desc msb-$PKG-$ENV >/dev/null && pm2 delete msb-$PKG-$ENV"
	"mv $packageDir $packageDirOld"
	"mv $packageDirTmp $packageDir"
	"cd $packageDir"
	"pm2 start app.mjs --name msb-$PKG-$ENV"
	"pm2 save"
)
sshRun "${sshCommands[@]}"
