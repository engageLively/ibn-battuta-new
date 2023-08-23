import { component, part, TilingLayout, ViewModel, ShadowObject } from 'lively.morphic';
import { projectAsset } from 'lively.project';
import { pt } from 'lively.graphics/geometry-2d.js';
import { num } from 'lively.lang';
import { Color } from 'lively.graphics/color.js';
import { Text } from 'lively.morphic/text/morph.js';

class InventoryModel extends ViewModel {
  static get properties () {
    return {
      shells: {
        defaultValue: 150
      },
      contents: {
        defaultValue: [
          { type: 'camels', shells: 20 },
          { type: 'saddles', shells: 5 },
          { type: 'guides', shells: 12 },
          { type: 'water skins', shells: 3 },
          { type: 'food', shells: 5 },
          { type: 'islamic book', shells: 15 },
          { type: 'glass beads', shells: 5 },
          { type: 'spices', shells: 9 },
          { type: 'swords', shells: 7 }
        ]
      }
    };
  }

  viewDidLoad () { super.viewDidLoad(); this.onRefresh('contents'); }

  onRefresh (prop) {
    if (prop === 'contents') {
      const list = this.ui.inventoryContentsList;
      list.submorphs = this.contents.map((entry, i) => {
        return part(InventoryEntry, { name: 'entry ' + i, viewModel: entry });
      });
      list.submorphs.forEach(renderedEntry => {
        list.layout.setResizePolicyFor(renderedEntry, { height: 'fixed', width: 'fill' });
      });
      list.layout = list.layout.copy(); // FIXME: the layout should be blocked as soon as we start setting a resize policy after the fact. It should not be overwritten by the style policies any more.
    }
  }
}

// FIXME: this could really be done with template variables instead
//        there is nothing interesting about this behavior which is a pure param
//        -> view property mapping
class InventoryEntryModel extends ViewModel {
  static get properties () {
    return {
      type: { defaultValue: null },
      shells: { defaultValue: 0 }
    };
  }

  onRefresh () {
    this.ui.shellCounter.textString = this.shells;
    this.ui.entryName.textString = this.type.toUpperCase();
  }
}

const InventoryEntry = component({
  extent: pt(289.4, 50),
  layout: new TilingLayout({
    hugContentsVertically: true,
    orderByIndex: true,
    resizePolicies: [['label', {
      height: 'fixed',
      width: 'fill'
    }]]
  }),
  fill: Color.rgba(255, 255, 255, 0),
  submorphs: [{
    name: 'total',
    fill: Color.rgba(255, 255, 255, 0),
    borderColor: Color.rgb(0, 0, 0),
    borderWidth: {
      bottom: 0,
      left: 0,
      right: 1,
      top: 1
    },
    extent: pt(36.8, 49.2),
    position: pt(6.6, 1.5)
  }, {
    name: 'label',
    layout: new TilingLayout({
      align: 'center',
      axisAlign: 'center',
      orderByIndex: true
    }),
    fill: Color.rgba(255, 255, 255, 0),
    borderColor: Color.rgb(0, 0, 0),
    borderWidth: {
      bottom: 0,
      left: 0,
      right: 0,
      top: 1
    },
    extent: pt(67.4000, 49.6000),
    position: pt(89.9, 1.7),
    submorphs: [{
      type: Text,
      name: 'entry name',
      fontSize: 20,
      fontFamily: '"EB Garamond"',
      dynamicCursorColoring: true,
      fill: Color.rgba(255, 255, 255, 0),
      position: pt(14.6, 9.5),
      textAndAttributes: ['CAMELS', null]

    }]
  }, {
    name: 'shells',
    layout: new TilingLayout({
      align: 'center',
      axisAlign: 'center',
      orderByIndex: true,
      spacing: 5
    }),
    fill: Color.rgba(255, 255, 255, 0),
    borderColor: Color.rgb(0, 0, 0),
    borderWidth: {
      bottom: 0,
      left: 1,
      right: 0,
      top: 1
    },
    extent: pt(64.4, 49.6),
    position: pt(171.5, 0.9),
    submorphs: [
      {
        type: Text,
        name: 'shell counter',
        fontColor: Color.rgb(211, 84, 0),
        dynamicCursorColoring: true,
        fill: Color.rgba(255, 255, 255, 0),
        fontFamily: '"EB Garamond"',
        fontSize: 20,
        position: pt(10.9, 9.8),
        textAndAttributes: ['10', null]

      }, {
        type: 'image',
        name: 'shell',
        extent: pt(17.5, 26),
        position: pt(36.4, 11.4),
        imageUrl: projectAsset('shell.png')
      }
    ]
  }]
});

const Inventory = component({
  name: 'inventory',
  type: 'image',
  defaultViewModel: InventoryModel,
  dropShadow: new ShadowObject({
    distance: 4.242640687119285,
    rotation: -45,
    color: Color.rgba(0, 0, 0, 0.52),
    blur: 38
  }),
  rotation: num.toRadians(-270.0),
  extent: pt(630, 502.8),
  imageUrl: projectAsset('papyrus-scroll.png'),
  submorphs: [{
    type: Text,
    name: 'title',
    fontSize: 30,
    fontFamily: '"EB Garamond"',
    dynamicCursorColoring: true,
    fill: Color.rgba(255, 255, 255, 0),
    position: pt(17.1, 345.9),
    rotation: -1.570796326794897,
    textAndAttributes: ['INVENTORY', null]
  }, {
    name: 'inventory contents list',
    layout: new TilingLayout({
      axis: 'column',
      orderByIndex: true
    }),
    fill: Color.rgba(255, 255, 255, 0),
    borderColor: Color.rgb(0, 0, 0),
    borderWidth: 1,
    extent: pt(291.3, 471.8),
    position: pt(77.2, 407.4),
    rotation: -1.570796326794897
  }]
});

export { Inventory };
