import { part, ShadowObject, ConstraintLayout, component } from 'lively.morphic';
import { pt, rect } from 'lively.graphics/geometry-2d.js';
import { Text } from 'lively.morphic/text/morph.js';
import { Image, Ellipse } from 'lively.morphic/morph.js';
import { SystemButtonDark } from 'lively.components/buttons.cp.js';
import { Color } from 'lively.graphics/color.js';
import { TradeGameModel } from './trade-game.js';
import { VideoMorph } from 'lively.components/video.js';
import { projectAsset } from 'lively.project';

const ATradeGame = component({
  defaultViewModel: TradeGameModel,
  clipMode: 'hidden',
  bindings: [{
    handler: 'buy',
    signal: 'onMouseUp',
    target: 'buy button'
  }, {
    handler: 'resetInventory',
    signal: 'onMouseUp',
    target: 'reset button'
  }, {
    handler: 'done',
    signal: 'onMouseUp',
    target: 'done button'
  }],
  extent: pt(1074.0000, 649.6000),
  fill: Color.rgb(234, 216, 193),
  position: pt(156.0000, 57.0000),
  respondsToVisibleWindow: true,
  submorphs: [{
    type: VideoMorph,
    name: 'background video',
    muted: true,
    autoplay: true,
    loop: true,
    position: pt(-17.3000, -14.6000),
    blur: 10,
    extent: pt(1131.3000, 685.7000),
    src: projectAsset('scenes/taghaza.mp4')
  }, {
    type: Text,
    name: 'offer text',
    borderRadius: 26,
    padding: rect(20, 0, 0, 0),
    fill: Color.rgba(255, 255, 255, 0.4),
    fontFamily: '"EB Garamond"',
    fontSize: 55,
    position: pt(10.0000, 10.0000),
    textAndAttributes: ['Placeholder', null]
  }, {
    type: Ellipse,
    name: 'seller frame',
    scale: 1.5,
    dropShadow: new ShadowObject({ distance: 14.422205101855956, rotation: 33.690067525979785, color: Color.black, blur: 56 }),
    clipMode: 'hidden',
    extent: pt(167.9000, 166.9000),
    position: pt(66.1000, 173.7000),
    submorphs: [{
      type: Image,
      name: 'seller image',
      imageUrl: projectAsset('seller.jpeg'),
      extent: pt(515.3000, 819.1000),
      position: pt(-186.1000, -145.2000)
    }]
  }, {
    type: Text,
    name: 'inventory text',
    borderRadius: 18,
    fill: Color.rgba(255, 255, 255, 0.4017),
    padding: rect(30, 30, 0, 38),
    fontFamily: '"EB Garamond"',
    fontSize: 30,
    position: pt(785.9000, 43.3000),
    textAlign: 'center',
    textAndAttributes: ['Inventory\n\
shells: 250\n\
waterSkins: 20\n\
salt: 5\n\
gold: 15\n\
beads: 22', null]
  }, {
    type: Image,
    name: 'goods image',
    imageUrl: projectAsset('salt-sack.svg'),
    extent: pt(290.0000, 290.0000),
    position: pt(438.5000, 149.4000)
  }, {
    type: Text,
    name: 'buy button',
    borderRadius: 91,
    padding: rect(20, 0, 5, 5),
    fill: Color.rgb(198, 40, 40),
    fontColor: Color.rgb(255, 255, 255),
    fontFamily: '"EB Garamond"',
    nativeCursor: 'pointer',
    fontSize: 35,
    position: pt(620.9000, 423.6000),
    textAndAttributes: ['Buy', null]
  }, {
    type: Text,
    name: 'done button',
    borderRadius: 91,
    fill: Color.rgba(48, 48, 48, 0.5692),
    fontColor: Color.rgb(255, 255, 255),
    fontFamily: '"EB Garamond"',
    fontSize: 35,
    nativeCursor: 'pointer',
    padding: rect(20, 0, 5, 5),
    position: pt(910.6000, 565.8000),
    textAndAttributes: ['Finish', null]
  }, {
    type: Text,
    name: 'reset button',
    borderRadius: 91,
    fill: Color.rgba(48, 48, 48, 0.5692),
    fontColor: Color.rgb(255, 255, 255),
    fontFamily: '"EB Garamond"',
    fontSize: 35,
    nativeCursor: 'pointer',
    padding: rect(20, 0, 5, 5),
    position: pt(809.4000, 329.4000),
    textAndAttributes: ['Reset', null]
  }]
});

export { ATradeGame };
