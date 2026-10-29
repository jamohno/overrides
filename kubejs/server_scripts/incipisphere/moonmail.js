(() => {
	ItemEvents.entityInteracted('minecraft:bread', event => {
		if (event.hand != 'MAIN_HAND' || event.target.type != 'minestuck:dersite_pawn' || event.target.tags.contains('Fed')) return
		event.target.addTag('Fed')
		event.item.shrink(1)
		event.player.give('kubejs:derse_brick')
		event.player.swing()
		event.cancel()
	})

	ItemEvents.entityInteracted('minecraft:iron_sword', event => {
		if (event.hand != 'MAIN_HAND' || event.target.type != 'minestuck:prospitian_pawn') return
		event.item.shrink(1)
		event.target.setMainHandItem('minecraft:iron_sword')
		event.player.give('kubejs:prospit_token')
		event.player.swing()
		event.cancel()
	})

	ItemEvents.entityInteracted('kubejs:pickpockets_glove', event => {
		const type = event.target.type
		if (event.hand != 'MAIN_HAND' || (type != 'minestuck:dersite_pawn' && type != 'minestuck:prospitian_pawn') || event.target.tags.contains('Pickpocketed')) return
		event.target.addTag('Pickpocketed')
		if (type == 'minestuck:dersite_pawn') event.player.give('kubejs:prospit_brick')
		else event.player.give('kubejs:prospit_plans')
		event.player.swing()
		event.cancel()
	})

	ItemEvents.entityInteracted('farmersdelight:flint_knife', event => {
		const paper = event.player.offHandItem
		if (event.hand != 'MAIN_HAND' || event.target.type != 'minestuck:dersite_pawn' || event.target.tags.contains('Supporter') || paper.id != 'minecraft:paper') return
		event.target.addTag('Supporter')
		paper.shrink(1)
		event.player.give('kubejs:derse_signature')
		event.player.swing()
		event.cancel()
	})

	ItemEvents.entityInteracted('farmersdelight:hamburger', event => {
		if (event.hand != 'MAIN_HAND' || event.target.type != 'minestuck:dersite_rook') return
		event.item.shrink(1)
		event.player.give('kubejs:derse_token')
		event.player.swing()
	})

	EntityEvents.drops('minestuck:prospitian_rook', event => {
		event.addDrop('kubejs:prospit_key_fragment')
	})

	BlockEvents.rightClicked('kubejs:prospit_vault', event => {
		const player = event.player
		if (event.hand != 'MAIN_HAND' || event.item.id != 'kubejs:prospit_key' || player.tags.contains('VaultOpened')) return
		event.item.shrink(1)
		player.addTag('VaultOpened')
		player.give('minestuck:white_kings_scepter')
		player.swing()
		event.cancel()
	})

	function mailRing(event) {
		if (event.hand != 'MAIN_HAND' || event.item.id != 'minestuck:white_queens_ring') return
		event.item.shrink(1)
		event.player.server.runCommandSilent(`give ${event.player.username} paper[custom_name='[{"text":"Mailing Receipt","italic":false}]']`)
		event.player.swing()
		event.cancel()
	}

	BlockEvents.rightClicked('minestuck:parcel_pyxis', event => mailRing(event))
	BlockEvents.rightClicked('minestuck:pyxis_lid', event => mailRing(event))

	function giveStrife(player) {
		player.give('kubejs:strife')
		player.server.runCommandSilent(`execute as ${player.username} at @s run playsound minecraft:custom.vanish master @s`)
	}

	ItemEvents.entityInteracted('minestuck:white_kings_scepter', event => {
		const bishop = event.target
		const player = event.player
		if (event.hand != 'MAIN_HAND' || bishop.type != 'minestuck:prospitian_bishop') return
		event.item.shrink(1)
		player.server.runCommandSilent(`execute in ${bishop.level.dimension} run summon minestuck:dersite_bishop ${bishop.x.toFixed(3)} ${bishop.y.toFixed(3)} ${bishop.z.toFixed(3)} {NoAI:1b,Silent:1b,Rotation:[${bishop.yaw.toFixed(1)}f,0f],KubeJSPersistentData:{RemoveAt:${bishop.level.time + 40}L}}`)
		bishop.discard()
		player.tell(Text.of('Gotcha!').lightPurple())
		player.swing()
		player.server.scheduleInTicks(40, () => giveStrife(player))
	})

	ItemEvents.entityInteracted('minestuck:white_kings_scepter', event => {
		const lich = event.target
		if (event.hand != 'MAIN_HAND' || lich.type != 'bosses_of_mass_destruction:lich' || String(lich.level.dimension) != 'minestuck:derse') return
		event.item.shrink(1)
		lich.discard()
		event.player.tell(Text.of('You really thought I would take you to the end of the world?').lightPurple())
		giveStrife(event.player)
		event.player.swing()
	})

	BlockEvents.rightClicked('minecraft:purple_glazed_terracotta', event => {
		const player = event.player
		const level = player.level
		const x = event.block.x + 0.5
		const y = event.block.y + 2
		const z = event.block.z + 0.5
		let lichNearby = false
		if (event.hand != 'MAIN_HAND' || String(level.dimension) != 'minestuck:derse') return
		level.getEntitiesWithin(AABB.of(x - 1000, y - 1000, z - 1000, x + 1000, y + 1000, z + 1000)).forEach(entity => {
			if (entity.type == 'bosses_of_mass_destruction:lich' && entity.distanceToSqr(x, y, z) <= 1000 * 1000) lichNearby = true
		})
		if (lichNearby) return
		player.server.runCommandSilent(`execute in minestuck:derse run summon bosses_of_mass_destruction:lich ${x} ${y} ${z} {NoAI:1b,Invulnerable:1b,Rotation:[180f,0f],KubeJSPersistentData:{RemoveAt:${level.time + 200}L}}`)
		player.swing()
		event.cancel()
	})

	function removeWhenDue(event) {
		const entity = event.entity
		const removeAt = entity.persistentData.getLong('RemoveAt')
		const ticksLeft = removeAt - entity.level.time
		if (removeAt == 0) return
		if (ticksLeft > 0) {
			entity.server.scheduleInTicks(ticksLeft, () => {
				if (!entity.isRemoved()) entity.discard()
			})
			return
		}
		event.cancel()
	}

	EntityEvents.spawned('bosses_of_mass_destruction:lich', event => removeWhenDue(event))
	EntityEvents.spawned('minestuck:dersite_bishop', event => removeWhenDue(event))
})()
