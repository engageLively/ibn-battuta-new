import { SystemButtonDark } from 'lively.components/buttons.cp.js';
import { Morph, ViewModel, part, Text, Image } from 'lively.morphic';
import { pt, Color } from 'lively.graphics';
import { projectAsset } from 'lively.project';

export class TradeGameModel extends ViewModel {
  static get properties () {
    return {
      respondsToVisibleWindow: { get () { return true; } },
      bindings: {
        get () {
          return [
            { target: 'buy button', signal: 'onMouseUp', handler: 'buy' },
            { target: 'reset button', signal: 'onMouseUp', handler: 'resetInventory' },
            { target: 'done button', signal: 'onMouseUp', handler: 'done' }
          ];
        }
      }
    };
  }

  /**
   * Construct with the parameters
   * backgroundImage: url of the background image (e.g., Tagahaza, Timbuktu)
   * sellerImage: url of the image of the seller
   * offeredGood: good the seller is offering
   * goodDesired: good the seller wants in return
   * unitPrice: quantity of goodDesired per good the seller wants
   * priceReversed: In general, the seller will demand x goods for 1 of what
   *                he's got to sell; if priceReversed is true, the seller will
   *                offer x goods for 1 of what he wants
   */
  get config () {
    return {
      taghaza: {
        backgroundImage: 'https://alchetron.com/cdn/taghaza-6df90031-db01-4017-9809-ca21842e337-resize-750.jpg',
        sellerImage: projectAsset('seller.jpeg'),
        offeredGood: 'salt',
        goodDesired: 'shells',
        unitPrice: 4,
        priceReversed: false
      }
    };
  }

  get dummyInventory () {
    return {
      shells: 250, waterSkins: 20, salt: 5, gold: 15, beads: 22
    };
  }

  setInventory (inventory) {
    this.originalInventory = { ...inventory };
    this.inventory = inventory;
    this.displayInventory();
  }

  displayInventory () {
    let text = 'Inventory';
    Object.keys(this.inventory).forEach(key => {
      text += `\n${key}: ${this.inventory[key]}`;
    });
    this.ui.inventoryText.textString = text;
  }

  viewDidLoad () {
    this.init();
  }

  init (placeName = 'taghaza') {
    const { backgroundImage, sellerImage, offerText } = this.ui;
    const config = this.config[placeName];
    // backgroundImage.imageUrl = config.backgroundImage;
    // sellerImage.imageUrl = config.sellerImage;
    this.offeredGood = {
      good: config.offeredGood,
      amount: config.priceReversed ? config.unitPrice : 1
    };
    this.goodDesired = {
      good: config.goodDesired,
      amount: config.priceReversed ? 1 : config.unitPrice
    };
    const getGood = good => `${good.amount} ${good.good}`;
    const textString = `Get ${getGood(this.offeredGood)} for ${getGood(this.goodDesired)}`;
    offerText.textString = textString;
    this.setInventory(this.dummyInventory);
  }

  buy () {
    if (this.inventory[this.goodDesired.good] >= this.goodDesired.amount) {
      this.inventory[this.offeredGood.good] += this.offeredGood.amount;
      this.inventory[this.goodDesired.good] -= this.goodDesired.amount;
      this.displayInventory();
    }
  }

  resetInventory () {
    this.inventory = this.originalInventory;
    this.displayInventory();
  }

  done () {
    // send a message that we're done
  }
}
