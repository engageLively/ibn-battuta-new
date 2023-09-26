import { component, ConstraintLayout, TilingLayout, part, ViewModel } from 'lively.morphic';
import { IntroScene } from './intro.cp.js';
import { FezMarketUI } from './fez.cp.js';
import { pt, Color } from 'lively.graphics';
import { add } from 'lively.morphic/components/core.js';
import { SystemButtonDark } from 'lively.components/buttons.cp.js';

class InTheFootsteps extends ViewModel {
  static get properties () {
    return {
      respondsToVisibleWindow: { get () { return true; } },
      bindings: {
        get () {
          return [
            { target: 'start button', signal: 'onMouseUp', handler: 'startIntro' }
          ];
        }
      },
      expose: { get () { return ['respondsToVisibleWindow', 'relayout', 'showStartButton', 'showPacks', 'startPackSelection']; } }
    };
  }

  showStartButton () {
    this.ui.startButton.visible = true;
  }

  relayout () {
    if (lively.FreezerRuntime) {
      this.view.extent = $world.extent;
      this.view.position = pt(0, 0);
    }
    this.ui.startButton.center = this.view.innerBounds().center();
  }

  viewDidLoad () {
    if (lively.FreezerRuntime) {
      this.registerEventListeners();
    }
    this.view.whenRendered().then(() => this.relayout());
  }

  async startIntro () {
    this.view.submorphs.forEach(m => m.visible = false);
    this.ui.intro.visible = true;
    await this.ui.intro.startIntroduction();
    this.showPacks();
    // window.parent?.postMessage({ message: 'remove' }, '*'); // navigate over to the fez market scene
  }

  async showPacks () {
    this.view.submorphs.forEach(m => m.visible = false);
    this.ui.fez.visible = true;
    await this.ui.fez.showPackOverview();
    window.parent?.postMessage({ message: 'remove' }, '*');
  }

  async startPackSelection () {
    this.view.submorphs.forEach(m => m.visible = false);
    this.ui.fez.visible = true;
    await this.ui.fez.enterPackSelection();
    window.parent?.postMessage({ message: 'updateInventory', inventory: JSON.stringify(this.ui.fez.currentInventory) }, '*');
    window.parent?.postMessage({ message: 'remove' }, '*');
  }

  registerEventListeners () {
    window.addEventListener('message', (evt) => {
      switch (evt.data.message) {
        case 'start intro':
          return this.startIntro();
        case 'show packs':
          return this.showPacks();
        case 'start pack selection':
          return this.startPackSelection();
      }
    });
  }
}

export const InTheFootstepsHolder = component({
  defaultViewModel: InTheFootsteps,
  fill: Color.transparent,
  layout: new TilingLayout({
    orderByIndex: true,
    resizePolicies: [['intro', {
      height: 'fill',
      width: 'fill'
    }], ['fez', {
      height: 'fill',
      width: 'fill'
    }]]
  }),
  extent: pt(1114.2000, 628.2000),
  submorphs: [part(IntroScene, {
    name: 'intro'
  }),
  part(FezMarketUI, {
    name: 'fez',
    visible: false
  }),
  part(SystemButtonDark, {
    name: 'start button',
    isLayoutable: false,
    visible: false,
    position: pt(507.1000, 293.9000),
    extent: pt(94.9000, 34.8000),
    submorphs: [{
      name: 'label',
      textAndAttributes: ['Start Game', null]
    }]
  })
  ]
});
