'format esm';
/* global Audio */
import { Image, World, HTMLMorph, Text, Morph, part, Ellipse } from 'lively.morphic';
import { pt, Color } from 'lively.graphics';
import { ButtonDefault } from 'lively.components/buttons.cp.js';
import { VideoMorph } from 'lively.components/video.js';

class GamePortal extends Morph {
  static get properties () {
    return { jumpEnabled: { defaultValue: false } };
  }

  onLoad () {
    this.jumpEnabled = false;
  }

  onMouseDown (evt) {
    if (this.jumpEnabled) {
      // const url = 'https://ultisim.github.io/Ibn-B/?q=f8twmc0xid#pw=RSLYoX4wWfAabMYhtU07sg';
      const url = 'https://engagelively.github.io/ibn-fez-new/';
      // window.open(url, '_blank');
      window.location.assign(url);
    }
  }
}

// new SaharaInternal().openInWorld()
export class SaharaInternal extends HTMLMorph {
  onLoad () {
    this.saharaWav = new Audio('https://matt.engagelively.com/assets/ITF/sahara.wav');
    this.panorama = 'https://www.360cities.net/paid_embed_iframe/b80adc67a0/sunrise-over-saharan-desert-erg-chebbi-morocco';
    this.whenRendered().then(_ => this.resetHTML());
  }

  resetHTML () {
    this.html = `<iframe src=${this.panorama} width=${this.width} height=${this.height}></iframe>`;
  }

  play () {
    this.saharaWav.play();
  }

  closeUp () {
    this.saharaWav.pause();
  }
}

// new SaharaPopup({extent: pt(1200, 800), scale: 0.5}).openInWorld()
export class SaharaPopup extends Morph {
  onLoad () {
    this.saharaInternal = new SaharaInternal({
      extent: this.extent.addPt(pt(0, -75)),
      position: pt(0, 75)
    });
    this.addMorph(this.saharaInternal);
    this.closeButton = part(ButtonDefault, {
      extent: pt(144, 52),
      name: 'close button',
      position: pt(this.extent.x - 160, 20),
      fill: Color.rgb(245, 124, 0)
    });
    this.addMorph(this.closeButton);
    this.fill = Color.rgb(0, 0, 0);
    const titleXPosition = Math.max(Math.min(this.extent.x - 668, this.extent.x / 2 - 254), 0);
    this.title = new Text({
      font: 'Garamond',
      fontSize: 60,
      fontColor: Color.white,
      textString: 'A 360° Panorama of the Sahara',
      position: pt(titleXPosition, 0),
      extent: pt(508, 50),
      fixedHeight: true,
      fixedWidth: true,
      borderWidth: 0,
      fill: Color.rgba(0, 0, 0, 0),
      name: 'title'

    });
    this.addMorph(this.title);

    const label = this.closeButton.getSubmorphNamed('label');
    label.fontFamily = 'Sans-serif';
    label.fontSize = 30;
    label.textString = 'Close';
    label.fontColor = Color.white;
    this.closeButton.viewModel.action = _ => { this.closeUp(); };
  }

  play () {
    this.saharaInternal.play();
  }

  closeUp () {
    this.saharaInternal.closeUp();
    if (this.owner && this.owner.closeSahara) {
      this.owner.closeSahara();
    }
  }
}

export class JumpPortal extends Morph {
  constructor (config) {
    super(config);
    this.action = config.action;
  }

  onLoad () {
    this.jumpEnabled = false;
    this.borderColor = Color.green;
  }

  enableJump () {
    this.jumpEnabled = true;
    this.nativeCursor = 'pointer';
  }

  onMouseDown (evt) {
    // window.open(this.url, '_blank');
    if (this.jumpEnabled) {
      this.action();
    }
  }
}

const optimalScaleToWindow = (morph, border = pt(0, 0)) => {
  const xScale = (window.innerWidth - border.x) / morph.extent.x;
  const yScale = (window.innerHeight - border.y) / morph.extent.y;
  return Math.min(xScale, yScale, 1);
};

// new InTheFootsteps().openInWorld()
export class InTheFootsteps extends Morph {
  get dots () {
    const waypoints = [
      { position: pt(499, 201), fill: Color.black, number: 0 },
      { position: pt(449, 387), fill: Color.black, number: 10 },
      { position: pt(520, 590), fill: Color.blue, number: 20 },
      { position: pt(656, 704), fill: Color.blue, number: 38 },
      { position: pt(757, 802), fill: Color.blue, number: 45 },
      { position: pt(775, 853), fill: Color.blue, number: 50 },
      { position: pt(754, 900), fill: Color.blue, number: 60 }

    ];
    const nextPoints = waypoints.slice(1);
    const dotArrays = nextPoints.map((point, index) => {
      const prev = waypoints[index];
      const numPoints = point.number - prev.number;

      const delta = point.position.subPt(prev.position).scaleBy(1 / numPoints);
      return [...Array(numPoints).keys()].map(n => {
        const pos = prev.position.addPt(delta.scaleBy(n));
        const offset = pt(Math.random() * 10, Math.random() * 10);
        return { position: pos.addPt(offset), fill: prev.fill };
      });
    });
    let result = dotArrays[0];
    dotArrays.slice(1).forEach(ar => {
      result = result.concat(ar);
    });
    return result;
  }

  clearDots () {
    if (this.dotMorphs) {
      this.dotMorphs.forEach(dotMorph => dotMorph.remove());
    }
    this.dotMorphs = [];
  }

  doDots () {
    this.clearDots();
    this.addDots();
  }

  clearPortals () {
    if (this.jumpPortals) {
      this.jumpPortals.forEach(portal => portal.borderWidth = 0);
    }
  }

  visited (aJumpPortal) {
    const allVisited = this.jumpPortals.reduce((visited, portal) => visited && portal.visited, true);
    if (allVisited) {
      this.fez.jumpEnabled = true;
      this.fez.borderWidth = 4;
      this.fez.borderColor = Color.green;
    }
  }

  addDots () {
    this.clearDots();
    this.dots.forEach(dot => this.addDot(dot));
  }

  makeHighlight (name, position, extent) {
    const result = new Morph({
      position: position,
      extent: extent,
      borderWidth: 0,
      fill: Color.rgba(0, 0, 0, 0),
      name: name
    });
    this.addMorph(result);
    return result;
  }

  addJumpPortal (config) {
    const jumpPortal = new JumpPortal(config);
    jumpPortal.fill = Color.rgba(0, 0, 0, 0);
    this.addMorph(jumpPortal);
    this.jumpPortals.push(jumpPortal);
  }

  onLoad () {
    // this.imageUrl = 'https://matt.engagelively.com/assets/ITF/new_ibn_map_small.png';
    this.extent = pt(1920, 1080);
    this.fill = Color.rgb(0, 0, 0, 0);
    this.timbuktu = this.makeHighlight('timbuktu', pt(491, 445), pt(74, 130));
    this.fez = new JumpPortal({
      position: pt(468, 76),
      extent: pt(121, 171),
      borderWidth: 4,
      borderColor: Color.green,
      fill: Color.rgba(0, 0, 0, 0),
      name: 'fez',
      action: _ => {
        this.openFez();
      }
    });

    this.ibn = new VideoMorph({
      src: 'https://matt.engagelively.com/assets/ITF/Ibn_Map_100.mp4',
      type: 'video/mp4',
      extent: pt(1920, 1080),
      position: pt(0, 0),
      name: 'ibn'
    });
    this.cover = new Morph({
      borderWidth: 60,
      fill: Color.rgba(0, 0, 0, 0),
      // borderColor: ' #DFD1A5',
      borderColor: Color.rgb(223, 209, 165),
      extent: pt(1920, 1080),
      position: pt(0, 0),
      name: 'cover'

    });
    this.addMorph(this.ibn);
    this.addMorph(this.cover);
    this.saharaPopup = new SaharaPopup({
      extent: this.extent,
      name: 'sahara',
      position: pt(0, 0)
    });
    this.ibn2 = new VideoMorph({
      src: 'https://matt.engagelively.com/assets/ITF/Ibn_Part_2.mp4',
      type: 'video/mp4',
      extent: pt(1920, 1080),
      position: pt(0, 0),
      name: 'ibn2'
    });
    this.fezHolder = new FezHolder();

    this.startButton = part(ButtonDefault);
    this.startButton.fill = Color.rgb(245, 124, 0);
    this.startButton.position = pt(1213, 496);
    this.startButton.extent = pt(144, 52);
    this.startButton.name = 'start';
    const label = this.startButton.getSubmorphNamed('label');
    label.fontFamily = 'Sans-serif';
    label.fontSize = 30;
    label.textString = 'Start';
    label.fontColor = Color.white;
    this.addMorph(this.startButton);
    this.startButton.viewModel.action = _ => { this.doShow(); };
    this.jumpPortals = [];

    this.addJumpPortal({
      name: 'sahara',
      position: pt(700, 393),
      extent: pt(483, 159),
      action: _ => { this.openSahara(); }
    });
    /* this.whenRendered().then(_ => {
      if (this.owner && this.owner != $world) {
        // not the top morph, let the owner rescale

      } else {
        const border = pt(400, 200);
        const scale = optimalScaleToWindow(this, border);
        this.scale = scale;
        this.position = border.scaleBy(0.5);
      }
    }); */
  }

  doShow () {
    this.ibn.startPlaying();
    this.jumpPortals.forEach(portal => {
      portal.borderColor = Color.green;
      portal.borderWidth = 0;
    });
    // this.get('timer').start();
    setTimeout(name => this.showItem(name), 43000, 'fez');
    setTimeout(name => this.showItem(name), 54000, 'timbuktu');
    // setTimeout(name => this.showItem(name), 65000, 'benin head');
    // setTimeout(name => this.showItem(name), 93000, 'timbuktu');
    // setTimeout(name => this.showItem(name), 93000, 'salt');
    // setTimeout(name => this.showItem(name), 72000, 'fez');
    // setTimeout(_ => this.getSubmorphNamed('fez').jumpEnabled = true, 72000);
    setTimeout(_ => {
      this.jumpPortals.forEach(portal => {
        portal.borderWidth = 4;
      });
    }, 96000);
    setTimeout(_ => this.getSubmorphNamed('sahara').enableJump(), 96000);
    this.clearDots();
    this.clearPortals();
    this.doTrail();
  }

  showItem (name) {
    this.getSubmorphNamed(name).show();
  }

  doTrail () {
    const timedDots = this.dots.map((dot, i) => {
      return { dot: dot, time: 43000 + 400 * i };
    }); // in milliseconds
    this.dotsToAdd = timedDots.slice().reverse();
    this.timer = 0;
    this.startStepping(400, 'addDotToTrail');
  }

  addDotToTrail () {
    this.timer += 400;
    if (this.dotsToAdd.length === 0) {
      this.stopStepping();
    } else {
      const nextDot = this.dotsToAdd[this.dotsToAdd.length - 1];
      if (this.timer >= nextDot.time) {
        this.addDot(nextDot.dot);
        this.dotsToAdd.pop();
      }
    }
  }

  addDot (dot) {
    if (!this.dotMorphs) {
      this.dotMorphs = [];
    }
    const morph = new Ellipse({
      position: dot.position,
      extent: pt(5, 5),
      fill: dot.fill
    });
    this.dotMorphs.push(morph);
    this.addMorph(morph);
  }

  test (n = this.dots.length) {
    this.clearDots();
    this.dots.slice(0, n).forEach(dot => this.addDot(dot));
  }

  reset () {
    this.clearDots();
    this.getSubmorphNmaed('fez').jumpEnabled = false;
  }

  openSahara () {
    this.removeAllMorphs();
    this.addMorph(this.saharaPopup);
    this.saharaPopup.play();
  }

  closeSahara () {
    this.removeAllMorphs();
    this.addMorph(this.ibn2);
    this.dotMorphs.forEach(m => this.addMorph(m));
    this.ibn2.startPlaying();
    setTimeout(_ => {
      /* this.ibn2.remove();
      this.addMorph(this.fezHolder);
      this.fezHolder.play(); */
      this.ibn2.stopPlaying();
      this.addMorph(this.fez);
      this.fez.enableJump();
    }, 3000);
  }

  openFez () {
    this.removeAllMorphs();
    this.addMorph(this.fezHolder);
    this.fezHolder.position = pt(0, 0);
    this.fezHolder.play();
  }
}

export class FezHolder extends Morph {
  get texts () {
    return [
      { text: 25, position: pt(72, 124) },
      { text: 15, position: pt(72, 175) },
      { text: 1, position: pt(72, 221) },
      { text: 25, position: pt(72, 271) },
      { text: 15, position: pt(72, 321) },
      { text: 1, position: pt(72, 371) },
      { text: 25, position: pt(72, 421) },
      { text: 15, position: pt(72, 471) },
      { text: 1, position: pt(72, 521) }
    ];
  }

  onLoad () {
    this.extent = pt(1000, 1000);

    this.background = new Image({
      // imageUrl: 'https://matt.engagelively.com/assets/ITF/Marketplace_Scene_5.png',
      imageUrl: 'https://matt.engagelively.com/assets/ITF/Intro-to-Fez-Background.png',
      autoResize: true,
      name: 'market',
      position: pt(0, 0),
      borderwidth: 0
    });
    this.startButton = part(ButtonDefault, {
      fill: Color.rgb(245, 124, 0),
      position: pt(899, 926),
      extent: pt(144, 52),
      name: 'start'
    });

    const label = this.startButton.getSubmorphNamed('label');
    label.fontFamily = 'Sans-serif';
    label.fontSize = 24;
    label.textString = 'Start Game';
    label.fontColor = Color.white;
    this.addMorph(this.startButton);
    this.startButton.viewModel.action = _ => { this.beginGame(); };

    this.addMorph(this.background);
    this.inventory = new Image({
      imageUrl: 'https://matt.engagelively.com/assets/ITF/Fez_Sim_Inventory_NEW-removebg-preview.png',
      fill: Color.rgba(0, 0, 0, 0),
      borderwidth: 0,
      autoResize: true,
      name: 'inventory',
      position: pt(1200, 200)
    });
    this.addMorph(this.inventory);
    this.addMorph(this.startButton);
    this.spiel = new Audio('https://matt.engagelively.com/assets/ITF/IBN_audio_for_Interim_page_inlcuding_Inventory_list.wav');
  }

  play () {
    this.spiel.play();
    this.showInventory();
  }

  showInventory () {
    this.index = 0;
    this.clearItems();
    this.startStepping(30000 / this.texts.length, 'showNextItem');
  }

  clearItems () {
    if (this.items) {
      this.items.forEach(item => item.remove());
    }
    this.items = [];
  }

  showNextItem () {
    if (this.index == this.texts.length) {
      this.stopStepping();
    } else {
      const item = new Text({
        textString: this.texts[this.index].text,
        position: this.texts[this.index].position,
        textAlign: 'center',
        fixedWidth: true,
        fixedHeight: true,
        borderWidth: 0,
        fill: Color.rgba(0, 0, 0, 0),
        extent: pt(24, 32),
        fontFamily: 'Garamond',
        fontSize: 17,
        fontColor: Color.rgb(152, 47, 10)
      });
      this.inventory.addMorph(item);
      this.items.push(item);
      this.index++;
    }
  }

  beginGame () {
    const url = 'https://engagelively.github.io/ibn-fez-new/';
    // window.open(url, '_blank');
    window.location.assign(url);
  }
}

// new InTheFootstepsHolder().openInWorld()

export class InTheFootstepsHolder extends Morph {
  onLoad () {
    // $world.fill = '#DFD1A5';
    this.fill = '#DFD1A5';
    this.inTheFootsteps = new InTheFootsteps();
    this.addMorph(this.inTheFootsteps);

    window.addEventListener('resize', _ => {
      this.reposition();
    });
    this.position = pt(0, 0);
    this.whenRendered().then(_ => {
      this.reposition();
    });
  }

  reposition () {
    const xScale = Math.min(window.innerWidth / this.inTheFootsteps.extent.x, 1);
    const yScale = Math.min(window.innerHeight / this.inTheFootsteps.extent.y, 1);
    const scale = Math.min(xScale, yScale);
    this.inTheFootsteps.scale = scale;

    const pixels = this.inTheFootsteps.extent.scaleBy(scale);
    this.extent = pt(window.innerWidth, window.innerHeight);
    const border = this.extent.subPt(pixels).scaleBy(0.5);
    this.inTheFootsteps.position = border;
    this.position = pt(0, 0);
  }
}

export class InTheFootstepsWorld extends World {
}

export async function main () {
  new InTheFootstepsHolder().openInWorld();
}

export const WORLD_CLASS = InTheFootstepsWorld;
