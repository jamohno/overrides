(() => {
	PlayerEvents.loggedIn(event => {
		const server = event.server
		if (server.persistentData.getBoolean('StarterItemsCleared')) return
		server.persistentData.putBoolean('StarterItemsCleared', true)
		server.scheduleInTicks(20, () => server.runCommandSilent('kill @e[type=minecraft:item]'))
	})
})()
