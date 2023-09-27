import { SystemButtonDark } from 'lively.components/buttons.cp.js';
import { Morph, part, Text, Image } from 'lively.morphic';
import { pt, Color } from 'lively.graphics';

class TradeGame extends Morph {
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
        sellerImage: 'https://c8.alamy.com/comp/2ABK48E/a-signare-or-woman-slave-trader-of-st-louis-senegal-18th-century-signar-were-mulatto-french-african-creole-women-famous-for-their-fashion-and-culture-a-signara-or-woman-of-colour-of-st-louis-after-rene-claude-geoffroy-de-villeneuves-lafrique-paris-1814-handcoloured-stipple-copperplate-engraving-from-frederic-shoberls-the-world-in-miniature-africa-a-description-of-the-manners-and-customs-moors-of-the-sahara-and-of-the-negro-nations-r-ackermann-england-1821-2ABK48E.jpg',
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

  onLoad () {
    this.backgroundImage = new Image({
      imageUrl: this.backgroundImageUrl,
      extent: pt(800, 600),
      position: pt(15, 80),
      name: 'background image'
    });
    this.sellerImage = new Image({
      imageUrl: this.sellerImageUrl,
      extent: pt(150, 500),
      position: pt(100, 150),
      name: 'seller image'
    });

    this.extent = pt(1200, 700);
    this.position = pt(10, 10);
    this.fill = Color.fromString('#ead8c1');
    // pluralize if perUnit > 1

    this.offerText = new Text({
      textString: 'Placeholder',
      fontFamily: 'EB Garamond',
      fontColor: Color.rgb(0, 0, 0),
      fontSize: 55,
      position: pt(10, 10),
      extent: pt(250, 60),
      name: 'offer text'
    });

    this.inventoryText = new Text({
      textString: 'Placeholder',
      fontFamily: 'EB Garamond',
      fontColor: Color.rgb(0, 0, 0),
      fontSize: 30,
      position: pt(860, 50),
      extent: pt(250, 330),
      textAlign: 'center',
      name: 'inventory'

    });

    this.buyButton = part(SystemButtonDark, {
      name: 'buy button',
      isLayoutable: false,
      position: pt(800, 400),
      extent: pt(94.9000, 34.8000),
      submorphs: [{
        name: 'label',
        textAndAttributes: ['Buy', null]
      }]
    });

    this.resetButton = part(SystemButtonDark, {
      name: 'reset button',
      isLayoutable: false,
      position: pt(800, 450),
      extent: pt(94.9000, 34.8000),
      submorphs: [{
        name: 'label',
        textAndAttributes: ['Reset', null]
      }]
    });

    this.doneButton = part(SystemButtonDark, {
      name: 'done button',
      isLayoutable: false,
      position: pt(800, 500),
      extent: pt(94.9000, 34.8000),
      submorphs: [{
        name: 'label',
        textAndAttributes: ['Done', null]
      }]
    });

    this.setInventory(this.dummyInventory);

    this.addMorph(this.offerText);
    this.addMorph(this.backgroundImage);
    this.addMorph(this.sellerImage);
    this.addMorph(this.inventoryText);
    this.addMorph(this.buyButton);
    this.addMorph(this.doneButton);
    this.addMorph(this.resetButton);
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
    this.inventoryText.textString = text;
  }

  init (placeName = 'taghaza') {
    const config = this.config[placeName];
    this.backgroundImage.imageUrl = config.backgroundImage;
    this.sellerImage.imageUrl = config.sellerImage;
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
    this.offerText.textString = textString;
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


// const foo = new TradeGame().openInWorld(); foo.init('taghaza')
