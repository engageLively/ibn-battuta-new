/* global Audio */
import { World, part } from 'lively.morphic';
import { InTheFootstepsHolder } from './ui/footsteps-holder.cp.js';

export async function main () {
  part(InTheFootstepsHolder, { name: 'funny adventures with ibn' }).openInWorld();
}

export const WORLD_CLASS = World;
