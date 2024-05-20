import kaboom from 'kaboom';
import { dialogueData, scaleFactor } from './constants';
import { setCameraScale, showDialogue } from './utils';

export const initializeGame = () => {
	const k = kaboom({
		canvas: document.getElementById('game') as HTMLCanvasElement,
		debug: false, // set to false once ready for production
		global: false,
		touchToMouse: true
	});

	k.loadSprite('map', './map.png');

	k.loadSprite('spritesheet', './spritesheet.png', {
		anims: {
			'idle-down': {
				from: 0,
				loop: true,
				speed: 8,
				to: 1
			},
			'idle-side': {
				from: 0,
				loop: true,
				speed: 8,
				to: 1
			},
			'idle-up': {
				from: 12,
				loop: true,
				speed: 8,
				to: 13
			},
			'walk-down': {
				from: 5,
				loop: true,
				speed: 8,
				to: 3
			},
			'walk-side': {
				from: 8,
				loop: true,
				speed: 8,
				to: 9
			},
			'walk-up': {
				from: 15,
				loop: true,
				speed: 8,
				to: 17
			}
		},
		sliceX: 6,
		sliceY: 3
	});

	k.setBackground(k.Color.fromHex('#000000'));

	k.scene('main', async () => {
		const mapData = await (await fetch('./map.json')).json();
		const layers = mapData.layers;
		const map = k.add([k.sprite('map'), k.pos(0, 0), k.scale(scaleFactor)]);
		const player = k.make([
			k.sprite('spritesheet', {
				anim: 'idle-down'
			}),
			k.area({
				shape: new k.Rect(k.vec2(0, 3), 10, 10)
			}),
			k.body(),
			k.anchor('center'),
			k.pos(),
			k.scale(scaleFactor),
			{
				direction: 'down',
				isInDialogue: false,
				speed: 300
			},
			'player'
		]);

		for (const layer of layers) {
			if (layer.name === 'boundaries') {
				for (const boundary of layer.objects) {
					map.add([
						k.area({
							shape: new k.Rect(k.vec2(0), boundary.width, boundary.height)
						}),
						k.body({ isStatic: true }),
						k.pos(boundary.x, boundary.y),
						boundary.name
					]);

					if (boundary.name) {
						player.onCollide(boundary.name, () => {
							if (dialogueData[boundary.name]) {
								player.isInDialogue = true;
								showDialogue({
									onClose: () => {
										player.isInDialogue = false;
									},
									text: dialogueData[boundary.name]
								});
							}
						});
					}
				}

				continue;
			}

			if (layer.name === 'spawnpoint') {
				for (const entity of layer.objects) {
					if (entity.name === 'Hero') {
						player.pos = k.vec2(
							(map.pos.x + entity.x) * scaleFactor,
							(map.pos.y + entity.y) * scaleFactor
						);
						k.add(player);
						continue;
					}
				}
			}
		}

		setCameraScale(k);

		k.onResize(() => {
			setCameraScale(k);
		});

		k.onUpdate(() => {
			k.camPos(player.worldPos().x, player.worldPos().y - 100);
		});

		k.onMouseDown((mouseBtn) => {
			if (mouseBtn !== 'left' || player.isInDialogue) return;

			const worldMousePos = k.toWorld(k.mousePos());
			player.moveTo(worldMousePos, player.speed);
			const mouseAngle = player.pos.angle(worldMousePos);
			const lowerBound = 50; /** @todo */
			const upperBound = 125; /** @todo */

			if (mouseAngle > lowerBound && mouseAngle < upperBound && player.curAnim() !== 'walk-up') {
				player.play('walk-up');
				player.direction = 'up';
				return;
			}

			if (
				mouseAngle < -lowerBound &&
				mouseAngle > -upperBound &&
				player.curAnim() !== 'walk-down'
			) {
				player.play('walk-down');
				player.direction = 'down';
				return;
			}

			if (Math.abs(mouseAngle) > upperBound) {
				player.flipX = false;

				if (player.curAnim() !== 'walk-side') player.play('walk-side');

				player.direction = 'right';
				return;
			}

			if (Math.abs(mouseAngle) < lowerBound) {
				player.flipX = true;

				if (player.curAnim() !== 'walk-side') player.play('walk-side');

				player.direction = 'left';
				return;
			}
		});

		function stopAnims() {
			if (player.direction === 'down') {
				player.play('idle-down');
				return;
			}

			if (player.direction === 'up') {
				player.play('idle-up');
				return;
			}

			player.play('idle-side');
		}

		k.onMouseRelease(stopAnims);

		k.onKeyRelease(() => {
			stopAnims();
		});

		k.onKeyDown(() => {
			const keyMap = [
				k.isKeyDown('right'),
				k.isKeyDown('left'),
				k.isKeyDown('up'),
				k.isKeyDown('down')
			];
			let keysPressed = 0;

			for (const key of keyMap) {
				if (key) {
					keysPressed++;
				}
			}

			if (keysPressed > 1) return;

			if (player.isInDialogue) return;

			if (keyMap[0]) {
				player.flipX = false;

				if (player.curAnim() !== 'walk-side') player.play('walk-side');

				player.direction = 'right';
				player.move(player.speed, 0);
				return;
			}

			if (keyMap[1]) {
				player.flipX = true;

				if (player.curAnim() !== 'walk-side') player.play('walk-side');

				player.direction = 'left';
				player.move(-player.speed, 0);
				return;
			}

			if (keyMap[2]) {
				if (player.curAnim() !== 'walk-up') player.play('walk-up');

				player.direction = 'up';
				player.move(0, -player.speed);
				return;
			}

			if (keyMap[3]) {
				if (player.curAnim() !== 'walk-down') player.play('walk-down');

				player.direction = 'down';
				player.move(0, player.speed);
			}
		});
	});

	k.go('main');
};
