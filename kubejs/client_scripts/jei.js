(() => {
	const SHOWN_KUBEJS = [
		'kubejs:paradox_slime_bucket', 'kubejs:fresh_prince_plushie', 'kubejs:thresh_prince_plushie', 'kubejs:durian_plushbomb',
		'kubejs:cathedral_cannon', 'kubejs:matriyarn', 'kubejs:blankusb', 'kubejs:techusb', 'kubejs:magicusb', 'kubejs:explorationusb',
		'kubejs:alchemizeusb', 'kubejs:paradox_autoclave', 'kubejs:dna_sequencer', 'kubejs:wondrous_seed_stash', 'kubejs:sublime_seed_stash',
		'kubejs:prodigious_seed_stash', 'kubejs:seed_vault', 'kubejs:wielded_shield', 'kubejs:captchalberd', 'kubejs:stage_platform',
		'kubejs:untrue_soul', 'kubejs:gunblade', 'kubejs:snackshot', 'kubejs:paladins_arsenal', 'kubejs:edible_modus',
		'kubejs:lunar_transportablizer', 'kubejs:transportablizer2', 'kubejs:meteoric_transportablizer', 'kubejs:eye_of_malice',
		'kubejs:eye_of_the_ancients', 'kubejs:eye_of_ascension', 'kubejs:eye_of_the_protector', 'kubejs:pickpockets_glove',
		'kubejs:defusal_kit', 'kubejs:mediation_stick', 'kubejs:elytric_fragment', 'kubejs:talent_scout', 'kubejs:microphone'
	]

	RecipeViewerEvents.removeEntries('item', event => {
		event.remove(item => ['cataclysm', 'mowziesmobs', 'bosses_of_mass_destruction'].includes(String(item.mod)))
		event.remove(item => /^quark:.*(jasper|limestone|shale|myalite|permafrost|ancient_tome|chorus_weeds|chorus_twist|parrot|ravager|dragon_scale|backpack)/.test(String(item.id)))
		event.remove(item => item.mod == 'modern_structure')
		event.remove(item => ['plushie_buddies:workbench', 'plushie_buddies:stuffing', 'plushie_buddies:thread', 'plushie_buddies:sewing_needle', 'plushie_buddies:fabric'].includes(String(item.id)))
		event.remove(item => item.mod == 'kubejs' && !SHOWN_KUBEJS.includes(String(item.id)))
		event.remove(item => item.id == 'refurbished_furniture:dark_electricity_generator')
		event.remove(item => item.id == 'artifacts:scarf_of_invisibility')
		event.remove(item => ['mekanism:raw_uranium', 'mekanism:uranium_ore', 'mekanism:deepslate_uranium_ore', 'mekanism:block_raw_uranium'].includes(String(item.id)))
		event.remove(item => ['whimsy_deco:traffic_cone', 'whimsy_deco:phone', 'whimsy_deco:black_phone', 'whimsy_deco:blue_phone', 'whimsy_deco:red_phone', 'cluttered:cardboard_box_open', 'cluttered:moon_pendant', 'cluttered:steampunk_globe'].includes(String(item.id)))
	})

	RecipeViewerEvents.removeCategories(event => {
		event.remove(['cataclysm:weapon_infusion', 'cataclysm:altar_of_amethyst'])
	})
})()
