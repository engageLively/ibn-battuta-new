/* global Audio */
import { component, easings, ConstraintLayout, ShadowObject, ViewModel } from 'lively.morphic';
import { pt, rect } from 'lively.graphics/geometry-2d.js';
import { VideoMorph } from 'lively.components/video.js';
import { projectAsset } from 'lively.project';
import { part } from 'lively.morphic/components/core.js';
import { TrailLayer } from './trail-layer.cp.js';
import { Color } from 'lively.graphics/color.js';
import { num, promise } from 'lively.lang';
import { Text } from 'lively.morphic/text/morph.js';
import { signal } from 'lively.bindings';

class IntroSceneModel extends ViewModel {
  static get properties () {
    return {
      expose: {
        get () {
          return ['startIntroduction'];
        }
      },
      bindings: {
        get () {
          return [
            { signal: 'extent', handler: 'relayout' },
            { target: 'enter market pointer', signal: 'onMouseUp', handler: 'enterFez' }, // this is disabled on until three other places have been explored
            { target: 'fez jump portal', signal: 'onMouseUp', handler: 'showFez' }, // this is disabled on until three other places have been explored
            { target: 'sahara jump portal', signal: 'onMouseUp', handler: 'showSahara' },
            { target: 'caravan jump portal', signal: 'onMouseUp', handler: 'showCaravan' },
            { target: 'taghaza jump portal', signal: 'onMouseUp', handler: 'showTaghaza' },
            { target: 'timbuktu jump portal', signal: 'onMouseUp', handler: 'showTimbuktu' },
            { target: 'mansa musa jump portal', signal: 'onMouseUp', handler: 'showMansaMusa' },
            { target: 'benin jump portal', signal: 'onMouseUp', handler: 'showBenin' },
            { target: 'forest jump portal', signal: 'onMouseUp', handler: 'showForest' },

            { target: 'panorama viewer', signal: 'close', handler: 'returnToMap' }
          ];
        }
      }
    };
  }

  viewDidLoad () {
    this._visitedUrls = new Set();
    this.view.whenRendered().then(() => this.relayout());
  }

  clearAudioIfPlaying () {
    if (this._audioClip?.ended === false) this._audioClip.pause();
  }

  playAudio (url) {
    this.clearAudioIfPlaying();
    this._audioClip = new Audio(url);
    this._audioClip.play();
  }

  async startIntroduction () {
    this.view.getAllNamed(/.* portal/).forEach(m => m.reactsToPointer = false);
    this.ui.fezJumpPortal.reactsToPointer = false;
    this.ui.ibn.startPlaying();
    this._fezPromise = promise.deferred();
    await promise.delay(43000);
    // now animate the footsteps
    for (let step = 0; step < 10; step++) {
      this.ui.fezToTaghaza.progress = step / 10;
      await promise.delay(400);
    }
    await promise.delay(5000);
    for (let step = 0; step < 10; step++) {
      this.ui.taghazaToTimbuktu.progress = step / 10;
      await promise.delay(400);
    }
    await promise.delay(5000);
    for (let step = 0; step < 10; step++) {
      this.ui.timbuktuToBenin.progress = step / 10;
      await promise.delay(400);
    }

    this.view.getAllNamed(/.* portal/).forEach(m => m.reactsToPointer = true);
    await this._fezPromise.promise;
  }

  instructToEnterFez () {
    // show the enter fez sign
    this.ui.enterMarketPointer.visible = true;
  }

  enterFez () {
    this._fezPromise.resolve(true);
  }

  async returnToMap () {
    const { view } = this;
    const duration = 400;
    const easing = easings.inOutExpo;
    this.clearAudioIfPlaying();
    this.ui.sceneWrapper.animate({
      blur: 0.0001,
      opacity: 1,
      duration,
      easing
    });
    await this.ui.panoramaViewer.animate({
      scale: .5,
      opacity: 0,
      center: view.innerBounds().center(),
      duration,
      easing
    });
    this.ui.panoramaViewer.visible = false;
  }

  show360View (url) {
    this._visitedUrls.add(url); // this is somewhat of a hack, but works for now
    if (this._visitedUrls.size > 3) this.instructToEnterFez();
    const duration = 400;
    const { view } = this;
    const pv = this.ui.panoramaViewer;
    const easing = easings.inOutExpo;
    Object.assign(pv, {
      visible: true,
      scale: .8,
      opacity: 0,
      center: view.innerBounds().center(),
      panorama: url
    });
    this.ui.sceneWrapper.animate({
      blur: 2,
      opacity: .8,
      duration,
      easing
    });
    pv.animate({
      scale: 1,
      opacity: 1,
      center: view.innerBounds().center(),
      duration,
      easing
    });
    pv.start();
  }

  showFez () {
    this.show360View(projectAsset('scenes/fez.mp4'));
  }

  showTimbuktu () {
    // tbd
    this.show360View(projectAsset('scenes/timbuktu.mp4'));
  }

  showTaghaza () {
    // still requires a proper 360 degree link (how to turn shutterstock jpg into 360 degree view)?
    this.show360View(projectAsset('scenes/taghaza.mp4'));
  }

  showCaravan () {
    // open up the 360 degree view of the caravan
    this.show360View(projectAsset('scenes/caravan.mp4')); // caravan url (paid link)
  }

  showSahara () {
    // open up the 360 degree view of the sahara
    this.show360View(projectAsset('scenes/sahara.mp4'));
  }

  showMansaMusa () {
    // not yet implemented. Should somehow dispaly a 3D model of the king.
    this.show360View(projectAsset('scenes/mansa-musa.mp4'));
  }

  showBenin () {
    this.show360View(projectAsset('scenes/benin.mp4'));
  }

  showForest () {
    this.show360View(projectAsset('scenes/forest.mp4')); // forest url (paid link)
  }

  relayout () {
    const { view } = this;
    this.ui.sceneWrapper.scale = Math.max(view.width / this.ui.sceneWrapper.width, view.height / this.ui.sceneWrapper.height);
    this.ui.sceneWrapper.center = view.innerBounds().center();
    this.ui.panoramaViewer.extent = view.extent.subXY(100, 100);
    this.ui.panoramaViewer.center = view.innerBounds().center();
  }
}

class PanoramaViewerModel extends ViewModel {
  static get properties () {
    return {
      panorama: {},
      bindings: {
        get () {
          return [
            { target: 'close button', signal: 'onMouseUp', handler: 'close' }
          ];
        }
      },
      expose: { get () { return ['panorama', 'start']; } }
    };
  }

  start () {
    this.ui.panoramaView.startPlaying();
    this.ui.panoramaView.videoDomElement.onended = () => this.close();
  }

  onRefresh (prop) {
    if (prop === 'panorama') {
      this.ui.panoramaView.src = this.panorama;
    }
  }

  close () {
    signal(this.view, 'close');
    this.ui.panoramaView.stopPlaying();
  }
}

const PanoramaViewer = component({
  defaultViewModel: PanoramaViewerModel,
  extent: pt(705, 403.1),
  clipMode: 'hidden',
  borderRadius: 15,
  dropShadow: new ShadowObject({ distance: 10.63014581273465, rotation: 48.81407483429035, color: Color.rgba(0, 0, 0, 0.62), blur: 40 }),
  layout: new ConstraintLayout({
    lastExtent: {
      x: 705,
      y: 403.1
    },
    reactToSubmorphAnimations: false,
    submorphSettings: [['close button', {
      x: 'move',
      y: 'fixed'
    }], ['panorama view', {
      x: 'resize',
      y: 'resize'
    }]]
  }),
  submorphs: [{
    type: VideoMorph,
    name: 'panorama view',
    extent: pt(705.6, 404.3),
    codec: 'video/mp4',
    src: projectAsset('scenes/sahara.mp4')
  }, {
    type: Text,
    name: 'close button',
    nativeCursor: 'pointer',
    fontColor: Color.rgba(0, 0, 0, 0.5),
    padding: rect(7, 0, 0, 0),
    fontSize: 39,
    dynamicCursorColoring: true,
    fill: Color.rgba(255, 255, 255, 0),
    position: pt(650, 0),
    textAndAttributes: ['', {
      fontFamily: '"Font Awesome 6 Free", "Font Awesome 6 Brands"',
      fontWeight: '900'
    }]
  }]
});

export const IntroScene = component({
  extent: pt(1163.6, 634.1),
  defaultViewModel: IntroSceneModel,
  clipMode: 'hidden',
  fill: Color.black,
  submorphs: [
    {
      extent: pt(1163.1, 633.5),
      clipMode: 'hidden',
      name: 'scene wrapper',
      submorphs: [{
        type: VideoMorph,
        name: 'ibn',
        extent: pt(1166, 655.6),
        position: pt(-2.7, -12.5),
        codec: 'video/mp4',
        src: projectAsset('Ibn NEW MAP VIDEO 2.mp4'),
        submorphs: [part(TrailLayer, {
          name: 'fez to taghaza',
          extent: pt(119.2, 233.8),
          position: pt(204.5, 23.3),
          submorphs: [{
            name: 'footsteps trail',
            borderWidth: 0,
            position: pt(31.3, 49.4),
            extent: pt(51.8, 158.6),
            vertices: [({ position: pt(56.31015624999999, 0), isSmooth: true, controlPoints: { next: pt(-39.36563884489415, 91.5324828740593), previous: pt(0, 0) } }), ({ position: pt(0, 159.48828125), isSmooth: true, controlPoints: { next: pt(-1.3357970041407081, 1.132783406253409), previous: pt(91.32627308058605, -77.44656289838325) } })]
          }]
        }), part(TrailLayer, {
          name: 'taghaza to timbuktu',
          extent: pt(127.2, 157.6),
          position: pt(174, 236.5),
          submorphs: [{
            name: 'footsteps trail',
            borderWidth: 0,
            extent: pt(35, 119.1),
            position: pt(52.1, 10),
            vertices: [({ position: pt(0, 0), isSmooth: true, controlPoints: { next: pt(-39.148785941240384, 66.65053970988966), previous: pt(0, 0) } }), ({ position: pt(40.665625, 124.65078125000002), isSmooth: true, controlPoints: { next: pt(1.1220868598043388, 2.6188148310709862), previous: pt(-14.047985176464636, -32.78629600315074) } })]
          }]
        }), part(TrailLayer, {
          name: 'timbuktu to benin',
          fill: Color.rgba(255, 255, 255, 0),
          extent: pt(162.5, 182.5),
          position: pt(268.9, 376.7),
          submorphs: [{
            name: 'footsteps trail',
            borderWidth: 0,
            extent: pt(158.5, 164.2),
            position: pt(-1.1, 10.2),
            vertices: [({ position: pt(0, 0), isSmooth: true, controlPoints: { next: pt(-2.6818787442338277, 100.2940443835042), previous: pt(0, 0) } }), ({ position: pt(158.4890625, 164.19609375), isSmooth: true, controlPoints: { next: pt(0.43467235764763085, 2.817068782877238), previous: pt(-18.30595380827061, -118.63908552445054) } })]
          }]
        }), {
          name: 'fez jump portal',
          opacity: 0,
          nativeCursor: 'pointer',
          extent: pt(89.2, 104.2),
          position: pt(214.4, 34.2)
        }, {
          name: 'taghaza jump portal',
          opacity: 0,
          nativeCursor: 'pointer',
          extent: pt(219.8, 103.7),
          position: pt(65.7, 150)
        }, {
          name: 'timbuktu jump portal',
          opacity: 0,
          nativeCursor: 'pointer',
          extent: pt(82.3, 120.4),
          position: pt(228.2, 265.8)
        }, {
          name: 'benin jump portal',
          opacity: 0,
          nativeCursor: 'pointer',
          extent: pt(118.6, 143),
          position: pt(322.6, 468.9)
        }, {
          name: 'sahara jump portal',
          opacity: 0,
          nativeCursor: 'pointer',
          extent: pt(289.3, 109.1),
          position: pt(423.5, 212.5)
        }, {
          name: 'caravan jump portal',
          rotation: num.toRadians(-17.9),
          opacity: 0,
          nativeCursor: 'pointer',
          extent: pt(270.6, 84.3),
          position: pt(295.6, 164.9)
        }, {
          name: 'mansa musa jump portal',
          opacity: 0,
          nativeCursor: 'pointer',
          extent: pt(175.3, 181.1),
          position: pt(10, 330.9)
        }, {
          name: 'forest jump portal',
          opacity: 0,
          rotation: num.toRadians(3.3),
          extent: pt(166.3, 64.8),
          nativeCursor: 'pointer',
          position: pt(154.6, 500.5)
        }]
      }, {
        name: 'enter market pointer',
        type: 'image',
        nativeCursor: 'pointer',
        extent: pt(69, 113.1),
        position: pt(256.1, 4.8),
        imageUrl: projectAsset('Start-Here.png'),
        visible: false
      }]
    }, part(PanoramaViewer, {
      name: 'panorama viewer',
      extent: pt(1041.3, 539.4),
      visible: false,
      position: pt(66.8, 51.1)
    })
  ]
});
