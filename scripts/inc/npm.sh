#region local npm libs for DEV only

NODE_TYPES_NPM="@types/node@18.14.0"
NODE_TYPES_FOLLOW_REDIRECTS="@types/follow-redirects@1.14.1"

#endregion

#region npm libs for DEPLOY

DISCORD_NPM="discord.js@14.11.0"
FOLLOW_REDIRECTS_NPM="follow-redirects@1.15.2"

#endregion

#region

function checkNpmLibs() {
	local installMissingLibs="$1"
	local npmLib=

	local NPM_LIBS_DEV=(
		"$NODE_TYPES_NPM"
		"$NODE_TYPES_FOLLOW_REDIRECTS"
	)

	for npmLib in "${NPM_LIBS_DEV[@]}"; do
		local exists=$(npm ls "$npmLib" >/dev/null && echo "true")
		if [ "$exists" = "true" ]; then
			echo "NPM lib '$npmLib' found."
		else
			if [ "$installMissingLibs" = "true" ]; then
				npm i --save-dev "$npmLib"
			else
				echo "NPM lib '$npmLib' NOT found!"
			fi
		fi
	done

	local NPM_LIBS=(
		"$DISCORD_NPM"
		"$FOLLOW_REDIRECTS_NPM"
	)

	for npmLib in "${NPM_LIBS[@]}"; do
		local exists=$(npm ls "$npmLib" >/dev/null && echo "true")
		if [ "$exists" = "true" ]; then
			echo "NPM lib '$npmLib' found."
		else
			if [ "$installMissingLibs" = "true" ]; then
				npm i "$npmLib"
			else
				echo "NPM lib '$npmLib' NOT found!"
			fi
		fi
	done

}

#endregion
