function* generatePoker() {
    const points = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];

    yield* points.map(p => ['♠️', p]);
    yield* points.map(p => ['♣️', p]);
    yield* points.map(p => ['♥️', p]);
    yield* points.map(p => ['♦️', p]);
}

const cards = generatePoker();

class PickedCards {
    constructor(key, storage = localStorage) {
        this.key = key;
        this.storage = storage;
        this.cards = JSON.parse(storage.getItem(key)) || [];
        this.cardSet = new Set(this.cards.map(card => card.join('')));
    }

    add(card) {
        this.cards.push(card);
        this.cardSet.add(card.join(''));
        this.storage.setItem(this.key, JSON.stringify(this.cards));
    }

    has(card) {
        return this.cardSet.has(card.join(''));
    }

    clear() {
        this.storage.clear();
    }
}

const pickedCards = new PickedCards('pickedCards');

function* shuffle(cards, pickedCards) {
    cards = [...cards];
    cards = cards.filter(card => !pickedCards.has(card));
    let len = cards.length;
    while (len) {
        const i = Math.floor(Math.random() * len);
        pickedCards.add(cards[i]);
        yield (cards[i].join(''));
        [cards[i], cards[len - 1]] = [cards[len - 1], cards[i]];
        len--;
    }

}

let a = shuffle(cards, pickedCards);

let c = [];
for(let v of a){
    c.push(v);
}

let dom = [];
for(let i = 0; i < c.length; i++){
    dom.push(`<div>${c[i]}</div>`);
}
document.querySelectorAll("body")[0].innerHTML = `<div>${dom}</div>`;
console.log(c);