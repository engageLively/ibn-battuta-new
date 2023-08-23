'format esm';
import { component, part, ViewModel } from 'lively.morphic';
import { pt } from 'lively.graphics/geometry-2d.js';
import { Color } from 'lively.graphics/color.js';
import { Path } from 'lively.morphic/morph.js';
import { projectAsset } from 'lively.project';

class TrailLayerModel extends ViewModel {
  static get properties () {
    return {
      progress: {
        min: 0,
        max: 1,
        defaultValue: 0
      },
      expose: { get () { return ['progress']; } }
    };
  }

  onRefresh (prop) {
    if (prop === 'progress') {
      this.updateFootsteps(this.progress);
    }
  }

  updateFootsteps (progress) {
    const trail = this.ui.footstepsTrail;
    const totalLength = trail._pathNode.getTotalLength();
    const footStepLength = 18;
    const totalNumberFootsteps = Math.floor(totalLength / footStepLength);
    trail.submorphs = [];
    for (let i = 0; i < totalNumberFootsteps; i++) {
      if (i / totalNumberFootsteps > progress) break;
      const center = trail.getPointOnPath(i / totalNumberFootsteps);
      const next = trail.getPointOnPath(i / totalNumberFootsteps + 0.01);
      const angle = next.subPt(center).theta() + Math.PI / 2;
      if (i % 2) trail.addMorph(part(LeftFootstep, { position: center, rotation: angle }));
      else trail.addMorph(part(RightFootstep, { position: center, rotation: angle }));
    }
  }
}

const LeftFootstep = component({
  type: 'image',
  origin: pt(8.1, 6.9),
  extent: pt(6, 13.7),
  imageUrl: projectAsset('left footstep.png')
});

const RightFootstep = component({
  type: 'image',
  origin: pt(-2, 7.2),
  extent: pt(6, 13.7),
  imageUrl: projectAsset('right footstep.png')
});

const TrailLayer = component({
  defaultViewModel: TrailLayerModel,
  borderColor: Color.rgb(23, 160, 251),
  extent: pt(146.2, 361.7),
  position: pt(129.4, 122.9),
  fill: Color.transparent,
  submorphs: [{
    type: Path,
    name: 'footsteps trail',
    borderColor: Color.lively,
    borderWidth: 1,
    fill: Color.transparent,
    draggable: true,
    extent: pt(38.6000, 270.6000),
    isSmooth: true,
    position: pt(84.7000, 39.7000),
    vertices: [({ position: pt(0.0000, 0.0000), isSmooth: true, controlPoints: { next: pt(-41.1947, 99.8499), previous: pt(0.0000, 0.0000) } }), ({ position: pt(38.5969, 270.5664), isSmooth: true, controlPoints: { next: pt(1.4575, 1.1785), previous: pt(-78.7684, -63.6897) } })]
  }]
});

export { TrailLayer };
