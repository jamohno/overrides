(() => {
	BlockEvents.rightClicked(event => {
		if (event.player.mainHandItem.id != 'kubejs:cursor') return
		event.cancel()
	})
})()
