(() => {
	LootJS.modifiers(event => {
		event.addTableModifier(LootType.CHEST, LootType.VAULT)
			.matchDimension('minecraft:overworld')
			.removeLoot(['@irons_spellbooks', '@hazennstuff', '@hazentouvelib', '@discerning_the_eldritch', '@aero_additions', '@farmers_spell', '@aces_spell_utils', '@gtbcs_geomancy_plus', ItemFilter.hasStoredEnchantment('@irons_spellbooks'), ItemFilter.hasStoredEnchantment('@hazennstuff')])
	})
})()
