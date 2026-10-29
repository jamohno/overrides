(() => {
	ItemEvents.entityInteracted(event => {
		if (event.target.type == 'minestuck:lotus_flower' && String(event.target.level.dimension) == 'minestuck:veil') event.cancel()
	})

	BlockEvents.rightClicked('minestuck:lotus_time_capsule_base', event => {
		const player = event.player
		const block = event.block
		const dimension = String(event.level.dimension)
		if (event.hand != 'MAIN_HAND' || dimension != 'minestuck:veil') return
		if (player.inventory.count('minestuck:sburb_code') < 1 || player.inventory.count('minestuck:computer_parts') < 1) return
		player.server.runCommandSilent(`clear ${player.username} minestuck:sburb_code 1`)
		player.server.runCommandSilent(`clear ${player.username} minestuck:computer_parts 1`)
		player.give('kubejs:floral_receipt')
		player.swing()
		const nearest = `execute in ${dimension} positioned ${block.x + 0.5} ${block.y + 0.5} ${block.z + 0.5} run data merge entity @n[type=minestuck:lotus_flower]`
		player.server.runCommandSilent(`${nearest} {EventTimer:120}`)
		player.server.scheduleInTicks(100, () => player.server.runCommandSilent(`${nearest} {EventTimer:-1}`))
		event.cancel()
	})
})()
