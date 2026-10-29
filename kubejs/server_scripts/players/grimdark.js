(() => {
	function cure(player) {
		player.removeTag('Grimdark')
		player.removeEffect('minecraft:trial_omen')
	}

	EntityEvents.death('minecraft:player', event => {
		if (event.entity.tags.contains('Grimdark')) cure(event.entity)
	})

	ItemEvents.foodEaten('create:builders_tea', event => {
		if (event.entity.tags.contains('Grimdark')) cure(event.entity)
	})

	ServerEvents.commandRegistry(event => {
		const Commands = event.commands
		const Arguments = event.arguments
		event.register(Commands.literal('grimdark')
			.requires(source => source.hasPermission(2))
			.then(Commands.literal('on').then(Commands.argument('player', Arguments.PLAYER.create(event)).executes(ctx => {
				const player = Arguments.PLAYER.getResult(ctx, 'player')
				if (player.tags.contains('Grimdark')) {
					ctx.source.sendFailure(Text.of(`${player.username} is already Grimdark`))
					return 0
				}
				if (!player.tags.contains('BeenGrimdark')) player.server.runCommandSilent(`give ${player.username} irons_spellbooks:ancient_knowledge_fragment[custom_name='[{"text":"Grimdark Knowledge","italic":false}]']`)
				player.addTag('BeenGrimdark')
				player.addTag('Grimdark')
				player.potionEffects.add('minecraft:blindness', 100, 0, false, true)
				player.potionEffects.add('minecraft:darkness', 100, 0, false, true)
				player.potionEffects.add('minecraft:trial_omen', -1, 0, false, true)
				ctx.source.sendSuccess(Text.of(`${player.username} is now Grimdark`), true)
				return 1
			})))
			.then(Commands.literal('off').then(Commands.argument('player', Arguments.PLAYER.create(event)).executes(ctx => {
				const player = Arguments.PLAYER.getResult(ctx, 'player')
				if (!player.tags.contains('Grimdark')) {
					ctx.source.sendFailure(Text.of(`${player.username} isn't Grimdark`))
					return 0
				}
				cure(player)
				ctx.source.sendSuccess(Text.of(`${player.username} is no longer Grimdark`), true)
				return 1
			}))))
	})
})()
