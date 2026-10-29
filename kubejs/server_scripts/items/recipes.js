(() => {
	ServerEvents.recipes(event => {
		event.shaped('kubejs:paradox_autoclave', ['ABA', 'CDC', 'AEA'], {
			A: 'minecraft:iron_block',
			B: 'minestuck:transportalizer',
			C: 'minecraft:glass_pane',
			D: 'kubejs:paradox_slime_bucket',
			E: 'verseworks:hyper_dust'
		})

		event.shaped('kubejs:dna_sequencer', ['A', 'B', 'C'], {
			A: 'minestuck:uranium_pressure_plate',
			B: 'mekanism:basic_bin',
			C: 'minecraft:iron_block'
		})

		event.shaped('kubejs:lunar_transportablizer', [' A ', 'ABD', ' D '], {
			A: 'kubejs:prospit_token',
			B: 'minestuck:transportalizer',
			D: 'kubejs:derse_brick'
		})

		event.shaped('kubejs:lunar_transportablizer', [' A ', 'ABD', ' D '], {
			A: 'kubejs:prospit_brick',
			B: 'minestuck:transportalizer',
			D: 'kubejs:derse_token'
		})

		event.shaped('kubejs:transportablizer2', [' B ', 'BAB', ' B '], {
			A: 'kubejs:lunar_transportablizer',
			B: 'minestuck:chessboard'
		})

		event.shaped('kubejs:prospit_key', ['AAA', 'AAA', 'AAA'], {
			A: 'kubejs:prospit_key_fragment'
		})

		event.remove({ id: 'minestuck:combinations/elytra_from_feather' })
		event.remove({ id: 'minestuck:combinations/elytra_from_leather_chestplate' })
		event.shaped('minecraft:elytra', ['AAA', 'AAA', 'AAA'], {
			A: 'kubejs:elytric_fragment'
		})

		event.shapeless('kubejs:seed_vault', ['kubejs:wondrous_seed_stash', 'kubejs:sublime_seed_stash', 'kubejs:prodigious_seed_stash'])
		event.shapeless('kubejs:prodigious_seed_stash', ['minecraft:wheat_seeds', 'minecraft:pumpkin_seeds', 'minecraft:melon_seeds', 'minecraft:beetroot_seeds', 'farmersdelight:rice', 'farmersdelight:cabbage_seeds', 'farmersdelight:tomato_seeds', 'minecraft:carrot', 'minecraft:potato'])
		event.shapeless('kubejs:wondrous_seed_stash', ['minecraft:poppy', 'minecraft:dandelion', 'minecraft:blue_orchid', 'minecraft:allium', 'minecraft:pink_tulip', 'minecraft:lily_of_the_valley', 'minecraft:cornflower', 'minecraft:oxeye_daisy', 'minecraft:azure_bluet'])
		event.shapeless('kubejs:sublime_seed_stash', ['minecraft:sunflower', 'minecraft:lilac', 'minecraft:rose_bush', 'minecraft:peony', 'biomeswevegone:delphinium', 'biomeswevegone:tall_prairie_grass', 'biomeswevegone:foxglove', 'biomeswevegone:tall_beach_grass', 'biomeswevegone:cattail_sprout'])

		event.shapeless('kubejs:talent_scout', ['2x minecraft:paper', 'minecraft:ink_sac', 'minecraft:feather'])

		event.shaped('kubejs:microphone', ['A', 'B', 'C'], {
			A: 'create:andesite_alloy',
			B: 'minecraft:iron_ingot',
			C: 'minecraft:stick'
		})

		event.shaped('kubejs:blankusb', ['AB'], {
			A: '#c:ingots/steel',
			B: 'mekanism:basic_tier_installer'
		})
		event.shapeless('kubejs:techusb', ['kubejs:blankusb', 'toms_storage:adv_wireless_terminal', 'create:precision_mechanism', 'create:sturdy_sheet', 'mekanism:ultimate_tier_installer'])
		event.shapeless('kubejs:alchemizeusb', ['kubejs:blankusb', 'kubejs:second_coming_of_durian_with_a_gun'])
		event.shapeless('kubejs:explorationusb', ['kubejs:blankusb', 'kubejs:floral_receipt', 'kubejs:made_choice', 'kubejs:ectobiology_certificate', 'kubejs:obsidian_rings'])
		event.shapeless('kubejs:magicusb', ['kubejs:blankusb', 'discerning_the_eldritch:ascended_key', 'hazennstuff:divine_mold'])

		event.remove({ id: 'minecraft:lectern' })
		event.remove({ id: 'quark:building/crafting/bookshelves/lectern_with_variant_bookshelves' })
		event.shaped('minecraft:lectern', ['AAA', ' B ', ' A '], {
			A: 'minecraft:iron_ingot',
			B: '#c:bookshelves'
		})

		event.shapeless('minestuckdungeons:poor_zillium_chunks', ['5x minestuckdungeons:crude_zillium_dust'])
		event.shapeless('minestuckdungeons:polluted_zillium_shard', ['2x minestuckdungeons:poor_zillium_chunks'])
		event.shapeless('minestuckdungeons:pure_zillium_gem', ['2x minestuckdungeons:polluted_zillium_shard'])

		event.remove({ mod: 'plushie_buddies' })

		event.shapeless('mowziesmobs:bluff_rod', ['minecraft:cobblestone', 'minecraft:breeze_rod'])

		event.shaped('kubejs:defusal_kit', ['NSG', 'III'], {
			N: '#c:nuggets/copper',
			S: 'minecraft:shears',
			G: 'mekanism:geiger_counter',
			I: '#c:ingots/steel'
		})

		event.shaped('kubejs:inventory_upgrade', ['IPI', 'PCP', 'IPI'], {
			I: 'minecraft:iron_ingot',
			P: '#minestuck:planks/aspect',
			C: 'minecraft:crafting_table'
		})

		event.remove({ output: 'refurbished_furniture:dark_electricity_generator' })
		event.remove({ output: 'refurbished_furniture:light_electricity_generator' })
		event.shaped('refurbished_furniture:light_electricity_generator', ['UUU', 'UEU', 'UUU'], {
			U: '#c:ingots/uranium',
			E: 'minestuck:energy_core'
		})

		event.replaceInput({ id: 'mekanism:personal_chest' }, '#c:chests/wooden', '#minestuck:planks/aspect')
		event.replaceInput({ id: 'mekanism:personal_barrel' }, '#c:barrels/wooden', '#minestuck:planks/aspect')

		event.remove({ output: 'whimsy_deco:traffic_cone' })
		event.remove({ output: 'whimsy_deco:phone' })
		event.remove({ output: 'whimsy_deco:black_phone' })
		event.remove({ output: 'whimsy_deco:blue_phone' })
		event.remove({ output: 'whimsy_deco:red_phone' })
		event.remove({ output: 'cluttered:cardboard_box_open' })
		event.remove({ output: 'cluttered:moon_pendant' })
		event.remove({ output: 'cluttered:steampunk_globe' })

		event.remove({ id: 'mekanism:processing/uranium/raw_storage_blocks/from_raw' })
		event.remove({ id: 'mekanism:processing/uranium/raw/from_raw_block' })
		event.remove({ id: 'mekanism:processing/uranium/ingot/from_ore_smelting' })
		event.remove({ id: 'mekanism:processing/uranium/ingot/from_ore_blasting' })
		event.remove({ id: 'minestuckcompat:combinations/mekanism/raw_uranium' })
		event.remove({ id: 'minestuckcompat:combinations/mekanism/uranium_ore' })
		event.remove({ id: 'minestuckcompat:combinations/mekanism/deepslate_uranium_ore' })
		event.remove({ id: 'minestuckcompat:combinations/mekanism/block_raw_uranium' })
		event.shapeless('minestuck:raw_uranium', ['mekanism:raw_uranium'])
		event.shapeless('minestuck:uranium_block', ['mekanism:block_raw_uranium'])
		event.shapeless('minestuck:stone_uranium_ore', ['mekanism:uranium_ore'])
		event.shapeless('minestuck:deepslate_uranium_ore', ['mekanism:deepslate_uranium_ore'])

		event.shaped('hazennstuff:starfury', ['  S', 'GS ', 'WG '], {
			S: 'hazennstuff:stardust',
			G: 'minecraft:gold_ingot',
			W: 'irons_spellbooks:weapon_parts'
		})

		event.shaped('hazennstuff:muramasa', ['  D', ' D ', 'W  '], {
			D: 'hazennstuff:demonite_ingot',
			W: 'irons_spellbooks:weapon_parts'
		})

		event.shaped('discerning_the_eldritch:cataclysm', ['  E', ' N ', 'W  '], {
			E: 'minecraft:echo_shard',
			N: 'minecraft:netherite_ingot',
			W: 'irons_spellbooks:weapon_parts'
		})

		event.shaped('discerning_the_eldritch:mourning_star', [' EE', ' HE', 'W  '], {
			E: 'minecraft:echo_shard',
			H: 'minecraft:heavy_core',
			W: 'irons_spellbooks:weapon_parts'
		})

		event.shaped('irons_spellbooks:autoloader_crossbow', [' P ', 'ICI', ' W '], {
			P: 'minecraft:piston',
			I: 'minecraft:iron_ingot',
			C: 'minecraft:crossbow',
			W: 'irons_spellbooks:weapon_parts'
		})

		event.remove({ id: 'hazennstuff:crafting/materials/crude_metal' })
		event.remove({ id: 'hazentouvelib:crafting/materials/crude_metal' })
		event.shapeless('9x hazennstuff:crude_metal', ['minecraft:heavy_core'])
		event.shapeless('hazentouvelib:crude_metal', ['hazennstuff:crude_metal'])

		event.remove({ id: 'cataclysm:the_incinerator' })
		event.remove({ id: 'cataclysm:bulwark_of_the_flame' })
		event.remove({ id: 'cataclysm:blazing_grips' })
		event.remove({ id: 'cataclysm:smithing/ignitium_helmet' })
		event.remove({ id: 'cataclysm:smithing/ignitium_chestplate' })
		event.remove({ id: 'cataclysm:smithing/ignitium_leggings' })
		event.remove({ id: 'cataclysm:smithing/ignitium_boots' })
		event.remove({ id: 'cataclysm:weapon_infusion/ignitium_elytra_chestplate' })
		event.remove({ id: 'cataclysm:weapon_infusion/the_immolator' })
		event.remove({ id: 'cataclysm:cursed_bow' })
		event.remove({ id: 'cataclysm:soul_render' })
		event.remove({ id: 'cataclysm:the_annihilator' })
		event.remove({ id: 'cataclysm:smithing/cursium_helmet' })
		event.remove({ id: 'cataclysm:smithing/cursium_chestplate' })
		event.remove({ id: 'cataclysm:smithing/cursium_leggings' })
		event.remove({ id: 'cataclysm:smithing/cursium_boots' })
		event.remove({ id: 'cataclysm:weapon_infusion/wrath_of_the_desert' })
		event.remove({ id: 'cataclysm:laser_gatling' })
		event.remove({ id: 'cataclysm:meat_shredder' })
		event.remove({ id: 'cataclysm:wither_assault_shoulder_weapon' })
		event.remove({ id: 'cataclysm:weapon_infusion/void_assault_shoulder_weapon' })
		event.remove({ id: 'cataclysm:mechanical_fusion_anvil' })
		event.remove({ id: 'cataclysm:ancient_spear' })
		event.remove({ id: 'cataclysm:bone_reptile_helmet' })
		event.remove({ id: 'cataclysm:bone_reptile_chestplate' })
		event.remove({ id: 'cataclysm:smithing/monstrous_helm' })
		event.remove({ id: 'cataclysm:weapon_infusion/brontes' })
		event.remove({ id: 'cataclysm:weapon_infusion/void_forge' })
		event.remove({ id: 'cataclysm:weapon_infusion/gauntlet_of_bulwark' })
		event.remove({ id: 'cataclysm:weapon_infusion/gauntlet_of_maelstrom' })
		event.remove({ id: 'bosses_of_mass_destruction:earthdive_spear' })
		event.remove({ id: 'bosses_of_mass_destruction:blast_amplifier' })
		event.remove({ id: 'bosses_of_mass_destruction:levitation_block' })
		event.remove({ id: 'bosses_of_mass_destruction:charged_ender_pearl' })
	})
})()
