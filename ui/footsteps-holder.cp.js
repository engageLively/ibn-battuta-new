import { component, ConstraintLayout, TilingLayout, part, ViewModel } from 'lively.morphic';
import { IntroScene } from './intro.cp.js';
import { FezMarketUI } from './fez.cp.js';
import { pt } from 'lively.graphics';

class InTheFootsteps extends ViewModel {
  static get properties () {
    return {
      respondsToVisibleWindow: { get () { return true; } },
      expose: { get () { return ['respondsToVisibleWindow', 'relayout']; } }
    };
  }

  relayout () {
    if (lively.FreezerRuntime) {
      this.view.extent = $world.extent;
      this.view.position = pt(0, 0);
    }
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
    window.postMessage({ message: 'enter fez' }, '*'); // navigate over to the fez market scene
  }

  startIntro () {
    this.view.submorphs.forEach(m => m.visible = false);
    this.ui.fez.visible = true;
    this.ui.fez.showPackOverview();
  }

  async startPackSelection () {
    this.view.submorphs.forEach(m => m.visible = false);
    this.ui.fez.visible = true;
    await this.ui.fez.enterPackSelection();
    window.postMessage({ message: 'pack selected', inventory: this.ui.fez.currentInventory }, '*');
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
  extent: pt(1114.2, 747.3),
  submorphs: [
    part(IntroScene, { name: 'intro' }),
    part(FezMarketUI, {
      name: 'fez',
      visible: false
    })
  ]
});
