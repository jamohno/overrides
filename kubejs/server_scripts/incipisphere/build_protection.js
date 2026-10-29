(() => {
	function protect(event) {
		if (!event.player || event.player.isCreative() || !['minestuck:prospit', 'minestuck:derse', 'minestuck:veil', 'minestuck:skaia'].includes(String(event.level.dimension))) return
		event.player.inventoryMenu.sendAllDataToRemote()
		event.cancel()
	}

	function protectItem(event) {
		const id = String(event.item.id)
		if ((id.endsWith('bucket') && id != 'minecraft:milk_bucket') || id == 'minecraft:flint_and_steel' || id == 'minecraft:fire_charge') protect(event)
	}

	function canBuild(event) {
		const x = event.block.x
		const y = event.block.y
		const z = event.block.z
		if (!event.player || String(event.level.dimension) != 'minestuck:veil') return false
		if (event.player.tags.contains('mind') && x >= 1268 && x <= 1284 && y >= 2 && y <= 76 && z >= 41 && z <= 57 && ['minecraft:redstone_wire', 'minecraft:repeater', 'minecraft:comparator', 'minecraft:redstone_torch', 'minecraft:redstone_wall_torch', 'minecraft:oak_button', 'minecraft:birch_button', 'minecraft:piston_head', 'minecraft:white_wool'].includes(String(event.block.id))) return true
		if (event.player.tags.contains('heart') && x >= -4 && x <= 6 && y >= 177 && y <= 184 && z >= -9 && z <= 1) return true
		return false
	}

	BlockEvents.placed(event => {
		if (!canBuild(event)) protect(event)
	})
	BlockEvents.broken(event => {
		if (String(event.level.dimension) == 'minestuck:veil' && ['minecraft:obsidian', 'bosses_of_mass_destruction:obsidilith_rune', 'minecraft:fire', 'minecraft:soul_fire'].includes(String(event.block.id))) return
		if (!canBuild(event)) protect(event)
	})

	BlockEvents.leftClicked('cataclysm:boss_respawner', event => {
		const block = event.block
		if (String(event.level.dimension) != 'minestuck:veil') return
		event.player.server.runCommandSilent(`execute in minestuck:veil run setblock ${block.x} ${block.y} ${block.z} minecraft:air destroy`)
		event.player.swing()
	})

	BlockEvents.rightClicked(event => {
		if (String(event.level.dimension) == 'minestuck:veil' && event.item.id == 'minecraft:water_bucket' && ['minecraft:cauldron', 'minecraft:water_cauldron'].includes(String(event.block.id))) return
		protectItem(event)
	})
	ItemEvents.rightClicked(event => protectItem(event))
})()
