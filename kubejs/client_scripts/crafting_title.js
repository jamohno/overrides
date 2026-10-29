(() => {
	const $ScreenOpening = Java.loadClass('net.neoforged.neoforge.client.event.ScreenEvent$Opening')
	const $CraftingScreen = Java.loadClass('net.minecraft.client.gui.screens.inventory.CraftingScreen')

	NativeEvents.onEvent($ScreenOpening, event => {
		const screen = event.getNewScreen()
		if (!(screen instanceof $CraftingScreen) || !screen.getTitle().getString().includes('￱')) return
		event.setNewScreen(new $CraftingScreen(screen.getMenu(), Client.player.getInventory(), Text.of('Crafting')))
	})
})()
