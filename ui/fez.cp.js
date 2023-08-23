/* global Audio */
import { component, ConstraintLayout, ViewModel, part, ShadowObject, TilingLayout } from 'lively.morphic';
import { projectAsset } from 'lively.project';
import { pt, rect } from 'lively.graphics/geometry-2d.js';
import { Image } from 'lively.morphic/morph.js';
import { Color } from 'lively.graphics/color.js';
import { Inventory } from './inventory.cp.js';
import { promise } from 'lively.lang/index.js';
import { once } from 'lively.bindings/index.js';

class FezMarketModel extends ViewModel {
  static get properties () {
    return {
      currentInventory: {},
      bindings: {
        get () {
          return [
            { target: /.* pack/, signal: 'onMouseUp', handler: 'selectPack', converter: '() => source.name' }
          ];
        }
      },
      expose: {
        get () {
          return ['showPackOverview', 'enterPackSelection', 'currentInventory'];
        }
      }
    };
  }

  clearAudioIfPlaying () {
    if (this._audioClip?.ended === false) this._audioClip.pause();
  }

  playAudio (url) {
    this.clearAudioIfPlaying();
    this._audioClip = new Audio(url);
    this._audioClip.play();
  }

  showPackOverview () {
    // dispalys the packs but does not allow the user to select them. instead plays a weird ibn battuta audio thingy
    this.ui.packSelection.visible = true;
    const { artisansPack, explorersPack, merchantsPack, nomadsPack, scholarsPack } = this.ui;
    [artisansPack, explorersPack, merchantsPack, nomadsPack, scholarsPack].forEach(m => m.reactsToPointer = false);
    this.playAudio(projectAsset('Ibn Intro Part 2 SHORTENED.mp3'));
    const p = promise.deferred();
    this._audioClip.onended = () => {
      this.hidePacks();
      p.resolve(true);
    };
    return p.promise;
  }

  hidePacks () {
    this.ui.packSelection.visible = false;
  }

  enterPackSelection () {
    // now the user can actually start selection the packs
    const { artisansPack, explorersPack, merchantsPack, nomadsPack, scholarsPack } = this.ui;
    [artisansPack, explorersPack, merchantsPack, nomadsPack, scholarsPack].forEach(m => m.reactsToPointer = true);
    this.ui.packSelection.visible = true;
    const p = this._packPromise = promise.deferred();
    return p.promise;
  }

  selectPack (packName) {
    const packs = {
      artisan: {
        camels: 3,
        guides: 2,
        waterSkins: 24,
        foodCrates: 4,
        spices: 6,
        glassBeadBags: 8,
        islamicBooks: 1
      },
      explorers: {
        camels: 5,
        guides: 3,
        waterSkins: 21,
        foodCrates: 7,
        glassBeadBags: 8
      },
      merchants: {
        camels: 3,
        guides: 1,
        waterSkins: 14,
        foodCrates: 4,
        swordBags: 6,
        spices: 8,
        glassBeadBags: 10
      },
      nomads: {
        camels: 6,
        guides: 2,
        waterSkins: 34,
        foodCrates: 8
      },
      scholars: {
        camels: 4,
        guides: 3,
        waterSkins: 28,
        foodCreates: 8,
        islamicBooks: 4
      }
    };
    this.fillInventory(packs[packName]);
    this.hidePacks();
    this._packPromise?.resolve(true);
  }

  viewDidLoad () {
    this.ui.inventory.visible = false;
    this.ui.packSelection.visible = false;
  }

  fillInventory (contents) {
    this.currentInventory = contents;
  }

  // not yet used
  showInventory () {
    this.ui.inventory.visible = true;
  }

  hideInventory () {
    this.ui.inventory.visible = false;
  }
}

const Scaled = component({ fill: Color.transparent, dropShadow: new ShadowObject({ color: Color.white, blur: 50 }) });

const Pack = component({
  type: Image,
  dropShadow: new ShadowObject({ color: Color.black, blur: 50 }),
  extent: pt(308.7, 308.7),
  nativeCursor: 'pointer',
  position: pt(33.9, 33.6),
  imageUrl: projectAsset('pack-icons/Artisans.png')
});

const PackSelection = component({
  extent: pt(1129.4, 747.2),
  layout: new TilingLayout({
    align: 'center',
    axisAlign: 'center',
    orderByIndex: true,
    padding: rect(34, 34, 0, 0),
    spacing: 32,
    wrapSubmorphs: true
  }),
  fill: Color.rgba(0, 0, 0, 0.5034),
  submorphs: [
    part(Pack, {
      name: 'artisans pack',
      master: { hover: Scaled },
      imageUrl: projectAsset('pack-icons/Artisans.png')
    }), part(Pack, {
      name: 'explorers pack',
      master: { hover: Scaled },
      imageUrl: projectAsset('pack-icons/Explorers.png')
    }), part(Pack, {
      name: 'merchants pack',
      master: { hover: Scaled },
      imageUrl: projectAsset('pack-icons/Merchants.png')
    }), part(Pack, {
      name: 'nomads pack',
      master: { hover: Scaled },
      imageUrl: projectAsset('pack-icons/nomads.png')
    }), part(Pack, {
      name: 'scholars pack',
      master: { hover: Scaled },
      imageUrl: projectAsset('pack-icons/Scholars.png')
    })
  ]
});

export const FezMarketUI = component({
  defaultViewModel: FezMarketModel,
  extent: pt(1235.6, 899.2),
  fill: Color.rgba(255, 255, 255, 0),
  layout: new ConstraintLayout({
    lastExtent: {
      x: 1235.6,
      y: 899.2
    },
    reactToSubmorphAnimations: false,
    submorphSettings: [['pack selection', {
      x: 'resize',
      y: 'resize'
    }], ['inventory', {
      x: 'move',
      y: 'move'
    }]]
  }),
  clipMode: 'hidden',
  submorphs: [
    part(PackSelection, {
      name: 'pack selection',
      extent: pt(1235.6, 899.2)
    }),
    part(Inventory, {
      name: 'inventory',
      position: pt(1259.3, 252.9)
    })
  ]
});
