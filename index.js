/* global Audio */
import { World, part } from 'lively.morphic';
import { InTheFootstepsHolder } from './ui/footsteps-holder.cp.js';
import { Color } from 'lively.graphics';

export async function main () {
  $world.fill = Color.transparent;
  window.document.body.style.background = 'transparent';
  part(InTheFootstepsHolder, { name: 'funny adventures with ibn' }).openInWorld();
}

export const WORLD_CLASS = World;
