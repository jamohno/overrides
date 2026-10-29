(() => {
	const $PlayerData = Java.loadClass('com.mraof.minestuck.player.PlayerData')
	const $MSAttachments = Java.loadClass('com.mraof.minestuck.util.MSAttachments')
	const CLASSES = ['bard', 'heir', 'knight', 'mage', 'maid', 'page', 'prince', 'rogue', 'seer', 'sylph', 'thief', 'witch']
	const ASPECTS = ['blood', 'breath', 'doom', 'heart', 'hope', 'life', 'light', 'mind', 'rage', 'space', 'time', 'void']
	const HUES = { breath: 190, blood: 1, time: 7, light: 31, void: 245, mind: 162, heart: 332, life: 80, doom: 135, hope: 55, rage: 280 }

	PlayerEvents.advancement(event => {
		if (event.advancement.id != 'minestuck:minestuck/entry') return
		const player = event.player
		const title = $PlayerData.get(player).get().getData($MSAttachments.TITLE)
		if (title == null) return
		const titleString = String(title).toLowerCase()
		const titleClass = CLASSES.find(name => titleString.includes(name))
		const titleAspect = ASPECTS.find(name => titleString.includes(name))
		CLASSES.concat(ASPECTS).forEach(tag => player.removeTag(tag))
		if (titleClass) player.addTag(titleClass)
		if (titleAspect) player.addTag(titleAspect)
		if (!titleAspect) return
		event.server.scheduleInTicks(5, () => {
			event.server.runCommandSilent(`give ${player.username} kubejs:inventory_upgrade[lore=['[{"text":"${titleAspect}","italic":false,"color":"gray"}]']]`)
			event.server.runCommandSilent(`execute as ${player.username} at @s run playsound minecraft:custom.pesteropen master @s`)
			if (HUES[titleAspect] != undefined) event.server.runCommandSilent(`recolor set all ${HUES[titleAspect]} ${player.username}`)
			else event.server.runCommandSilent(`recolor reset ${player.username}`)
		})
	})

	ItemEvents.rightClicked('kubejs:inventory_upgrade', event => {
		const player = event.player
		if (event.hand != 'MAIN_HAND') return
		event.server.runCommandSilent(`execute as ${player.username} at @s run playsound verseworks:dimension_prepared master @s`)
		player.tell('§7Your inventory was §aupgraded!')
		player.mainHandItem.shrink(1)
		event.server.runCommandSilent(`inventory_slots set_unlocked ${player.username} 27`)
		player.swing()
	})
})()
