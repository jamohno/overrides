(() => {
	const SECTIONS = ['87 190 -22 87 192 -25', '87 194 -22 87 196 -25', '87 194 -27 87 196 -30', '87 190 -27 87 192 -30']
	let busy = false

	function run(event, command) {
		event.server.runCommandSilent(`execute in minestuck:veil run ${command}`)
	}

	function lightSection(event, section, last, pitch) {
		run(event, `fill ${SECTIONS[last]} kubejs:space1 replace kubejs:space2`)
		run(event, `fill ${SECTIONS[section]} kubejs:space2 replace kubejs:space1`)
		run(event, `playsound minecraft:block.note_block.bit block @a 87 193.5 -26 1 ${pitch}`)
	}

	BlockEvents.rightClicked('minestuck:shade_pressure_plate', event => {
		const player = event.player
		if (event.hand != 'MAIN_HAND' || String(event.level.dimension) != 'minestuck:veil' || player.tags.contains('Ectobiologist') || busy) return
		busy = true
		player.addTag('Ectobiologist')
		event.server.scheduleInTicks(0, () => lightSection(event, 0, 3, 2))
		event.server.scheduleInTicks(10, () => lightSection(event, 1, 0, 1))
		event.server.scheduleInTicks(20, () => lightSection(event, 2, 1, 2))
		event.server.scheduleInTicks(30, () => lightSection(event, 3, 2, 1))
		event.server.scheduleInTicks(40, () => lightSection(event, 0, 3, 2))
		event.server.scheduleInTicks(50, () => lightSection(event, 1, 0, 1))
		event.server.scheduleInTicks(60, () => lightSection(event, 2, 1, 2))
		event.server.scheduleInTicks(70, () => lightSection(event, 3, 2, 1))
		event.server.scheduleInTicks(80, () => {
			run(event, 'fill 87 190 -22 87 196 -30 kubejs:space1 replace kubejs:space2')
			run(event, 'particle minestuck:transportalizer 93 189.5 -19 0 0 0 0 1 force')
			run(event, 'playsound minestuck:block.transportalizer.teleport block @a 93 189.5 -19')
			run(event, 'summon strawstatues:straw_statue 93 189.5 -19 {NoGravity:1b,Invulnerable:1b,DisabledSlots:4144959,ModelParts:126b,Rotation:[0f,0f],Pose:{Head:[-3.5897436f,2.8966346f,0f],LeftArm:[0f,-11.892278f,0f],RightArm:[0f,5.625f,0f]},profile:{id:[I;-2080599684,-1326299414,-1105399113,270957103],name:"slime_0709",properties:[{name:"textures",signature:"NpQ9CM4c1Kn5ed3DVmebTO4/GRma2M8Bd89tFpO35cFQMD0FFdrL+9Kgf7KcF9AyDVzQFyhyiRjfKa80Vg2a4qb21CxN4abuqpVpxjHZZLjfZxKI+ofZ48OT/DylzTgYMY0ZrUEMOBS4vHunePYfiH9U3kQ3hYY7d3yT29j3Helb1X0eh/Jl+caWf3RsWgF2rMtttI9ZFbeTjR0oweBaiE2mwmXPa9QHjvzXzxMPGt85vg6GYk+nDHpQfxRsVJxi5qjZzehoU8wtyryTkEEXrv8bmdVdt38qWD28dQmFzdQwdNtiRAaNXMvcoxn7CCxhaTwbk7TUznAeQHrgF1pLOKBFzoKYjx2LkSwUzkS166YiTeGlid84Xl0KO/f8OyoI3/F6HGcW0h0pSQmD58Kkr5AJD5PjePKzDmvVD0yU11l+cajcEYXz/s817vjlUk8t2Y1jGCYad+ySCRwGjgE/z9GzQa9dNzwjbsFdgoUMwqt0S1kMQPwb8YTFEvH1a3ddxk5yYJdp8ETHLxO4L4SSXiYDKOFUCx+xNH4c5qv15jIHGWUoQmAUwMx3B2lUwG5OvA0Y0OV5ENQOYgxl/iCMMxrA/Aya55CKr84Nd09vYdGvfOuIuUNJ2FOVhVPesLjbxttVoEQEi27Sc1WrQBNt7uMbm12KjDMpuvzjCZVMqHE=",value:"ewogICJ0aW1lc3RhbXAiIDogMTc5MTI5MjcwMzIwMSwKICAicHJvZmlsZUlkIiA6ICI4M2ZjOTE3Y2IwZjI0NmVhYmUxY2YyYjcxMDI2N2EyZiIsCiAgInByb2ZpbGVOYW1lIiA6ICJzbGltZV8wNzA5IiwKICAic2lnbmF0dXJlUmVxdWlyZWQiIDogdHJ1ZSwKICAidGV4dHVyZXMiIDogewogICAgIlNLSU4iIDogewogICAgICAidXJsIiA6ICJodHRwOi8vdGV4dHVyZXMubWluZWNyYWZ0Lm5ldC90ZXh0dXJlLzU0NmUxNzY0Njg5Mzk4ZjVlN2UyYTdhNzQ4OTk0OTU2YThkMTYzNjkzMTE0NjZlZDY4ZTg3ZDUyY2Y3OTlhNDciLAogICAgICAibWV0YWRhdGEiIDogewogICAgICAgICJtb2RlbCIgOiAic2xpbSIKICAgICAgfQogICAgfSwKICAgICJDQVBFIiA6IHsKICAgICAgInVybCIgOiAiaHR0cDovL3RleHR1cmVzLm1pbmVjcmFmdC5uZXQvdGV4dHVyZS8xZGUyMTQxOTAwOWRiNDgzOTAwZGE2Mjk4YTFlNmNiZjlmMWJjMTUyM2EwZGNkYzE2MjYzZmFiMTUwNjkzZWRkIgogICAgfQogIH0KfQ=="}]},Tags:["EctobiologySlime"]}')
		})
		event.server.scheduleInTicks(120, () => {
			run(event, 'kill @e[type=strawstatues:straw_statue,tag=EctobiologySlime]')
			run(event, 'setblock 94 190 -19 air')
			run(event, 'setblock 94 190 -19 mekanism:basic_fluid_tank{fluid_tanks:[{stored:{amount:32000,id:"kubejs:paradox_slime"},tank:0b}]}')
			run(event, 'playsound minecraft:item.bucket.fill block @a 94 190.5 -19')
		})
		event.server.scheduleInTicks(160, () => {
			run(event, 'setblock 94 190 -19 air')
			run(event, 'setblock 94 190 -19 mekanism:basic_fluid_tank')
			run(event, 'particle minestuck:transportalizer 93 189.1875 -26 0 0 0 0 1 force')
			run(event, 'playsound minestuck:block.transportalizer.teleport block @a 93 189.1875 -26')
			run(event, `summon strawstatues:straw_statue 93 188.9375 -26 {NoGravity:1b,Invulnerable:1b,DisabledSlots:4144959,Small:1b,SlimArms:1b,Rotation:[225f,0f],Pose:{LeftArm:[-18.461538f,-48.88747f,0f],LeftLeg:[-90f,-10f,0f],RightArm:[-27.692308f,17.666016f,0f],RightLeg:[-90f,10f,0f]},profile:{name:"${player.username}"},Tags:["EctobiologyBaby"]}`)
			player.give('kubejs:ectobiology_certificate')
		})
		event.server.scheduleInTicks(260, () => {
			const x = (97.5 + Math.floor(Math.random() * 17) / 4).toFixed(2)
			const z = (-31.5 + Math.floor(Math.random() * 33) / 4).toFixed(2)
			run(event, `tp @e[type=strawstatues:straw_statue,tag=EctobiologyBaby] ${x} 188.75 ${z} ${Math.floor(Math.random() * 360)} 0`)
			run(event, `particle minestuck:transportalizer ${x} 189.25 ${z} 0 0 0 0 1 force`)
			run(event, `playsound minestuck:block.transportalizer.teleport block @a ${x} 189.25 ${z}`)
			run(event, 'tag @e[type=strawstatues:straw_statue,tag=EctobiologyBaby] remove EctobiologyBaby')
			busy = false
		})
		player.swing()
		event.cancel()
	})
})()
