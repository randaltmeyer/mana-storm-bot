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
if [ "$PKG" = "data" ]; then
	echoAndDo "echo 'ver 0.0.0' > version.txt"
	echoAndDo "echo 'ver 0.0.0' > sage-data-pf2e.ver"
	echoAndDo "cp -r $sageRootDir/data/pf2e/dist/* $deployDirLocal/tmp"
else
	# echoAndDo "cp -r $sageRootDir/node_modules $deployDirLocal/tmp"
	echoAndDo "cp -r $sageRootDir/dist/sage* $deployDirLocal/tmp"
	echoAndDo "cp $sageRootDir/dist/*.mjs $deployDirLocal/tmp"
	echoAndDo "cp $sageRootDir/package.json $deployDirLocal/tmp"
fi

# zip deployment files
echoAndDo "zip -rq9 $deployDirLocal/$PKG.zip *"

# stage files in remote deploy folder
scpTo "$deployDirLocal/$PKG.zip" "$deployDirRemote/$PKG.zip"

# remove local deploy
echoAndDo "rm -rf $deployDirLocal"

#endregion

# execute the deploy script on the remote
NOW=`date '+%F-%H%M'`;
if [ "$PKG" = "data" ]; then
	sshCommands=(
		# "zip -rq9 $packageDir/pf2e/dist-$NOW $packageDir/pf2e/dist"
		"mv $packageDir/pf2e/dist $packageDir/pf2e/dist-$NOW"
		"unzip -q $deployDirRemote/data -d $packageDir/pf2e/dist"
		"rm -f $deployDirRemote/data.zip"
		"pm2 desc sage-dev-$ENV >/dev/null && pm2 restart sage-dev-$ENV"
		"pm2 desc sage-beta-$ENV >/dev/null && pm2 restart sage-beta-$ENV"
		"pm2 desc sage-stable-$ENV >/dev/null && pm2 restart sage-stable-$ENV"
	)
else
	packageDirTmp="$packageDir-tmp"
	packageDirOld="$packageDir-$NOW"
	sshCommands=(
		"mkdir $packageDirTmp"
		"ln -s $botDir/data $packageDirTmp/data"
		"unzip -q $deployDirRemote/$PKG -d $packageDirTmp"
		"rm -f $deployDirRemote/$PKG.zip"
		"cd $packageDirTmp"
		"npm install"
		"pm2 desc sage-$PKG-$ENV >/dev/null && pm2 delete sage-$PKG-$ENV"
		"mv $packageDir $packageDirOld"
		"mv $packageDirTmp $packageDir"
		"cd $packageDir"
		"pm2 start app.mjs --name sage-$PKG-$ENV --node-args='--experimental-modules --es-module-specifier-resolution=node' -- $PKG dist"
		"pm2 save"
	)
fi
sshRun "${sshCommands[@]}"