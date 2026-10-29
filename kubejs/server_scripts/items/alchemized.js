(() => {
	function giveBonus(event, name, amount, ticks) {
		const player = event.player
		const weapon = String(event.item.id)
		const attribute = player.getAttribute(name)
		if (event.hand != 'MAIN_HAND' || !attribute || attribute.hasModifier(weapon)) return
		player.modifyAttribute(name, weapon, amount, 'add_value')
		player.swing()
		event.server.scheduleInTicks(ticks || 200, () => {
			if (!player.isRemoved()) player.removeAttribute(name, weapon)
		})
	}

	ItemEvents.rightClicked('kubejs:snackshot', event => giveBonus(event, 'additional_attributes:innate_spell/farmers_spell/chaos_slash', 5))
	ItemEvents.rightClicked('kubejs:paladins_arsenal', event => giveBonus(event, 'additional_attributes:innate_spell/irons_spellbooks/fortify', 3))
	ItemEvents.rightClicked('kubejs:gunblade', event => giveBonus(event, 'additional_attributes:innate_spell/gtbcs_geomancy_plus/dripstone_bolt', 3))
	ItemEvents.rightClicked('kubejs:wielded_shield', event => giveBonus(event, 'minecraft:generic.knockback_resistance', 1))
	function grant(player, key, name, amount, ticks) {
		const attribute = player.getAttribute(name)
		if (!attribute || attribute.hasModifier(key)) return
		player.modifyAttribute(name, key, amount, 'add_value')
		player.server.scheduleInTicks(ticks, () => {
			if (!player.isRemoved()) player.removeAttribute(name, key)
		})
	}

	function cannon(player) {
		grant(player, 'kubejs:cathedral_cannon', 'additional_attributes:innate_spell/irons_spellbooks/magma_bomb', 8, 60)
		player.swing()
	}

	function durian(player) {
		grant(player, 'kubejs:second_coming_of_durian_with_a_gun', 'additional_attributes:innate_spell/farmers_spell/white_case_bloom', 5, 200)
		grant(player, 'kubejs:second_coming_of_durian_with_a_gun', 'additional_attributes:innate_spell/irons_spellbooks/healing_circle', 5, 200)
		player.swing()
	}

	BlockEvents.rightClicked('kubejs:cathedral_cannon', event => { if (event.hand == 'MAIN_HAND') cannon(event.player) })
	BlockEvents.rightClicked('kubejs:second_coming_of_durian_with_a_gun', event => { if (event.hand == 'MAIN_HAND') durian(event.player) })

	BlockEvents.rightClicked('kubejs:durian_plushbomb', event => {
		if (event.hand != 'MAIN_HAND') return
		event.player.swing()
		event.player.server.runCommandSilent(`execute in ${event.block.dimension} run summon tnt ${event.block.x + 0.5} ${event.block.y} ${event.block.z + 0.5}`)
	})
})()
