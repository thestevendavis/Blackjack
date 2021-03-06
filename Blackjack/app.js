﻿var $deck, $playerHand1, $dealerHand, $credits, $bet, $playerHand2, $playerHand3, $playerHand4;

$(document).ready(function () {
    //setup the game
    $deck = new Stack();
    $credits = 500;
    $deck.makeDeck(6);
    $deck.shuffleDeck(1);
    $('.credits-total').html('Credits: ' + $credits);
    $('.button-area').html('<input id="dealButton" type="button" value="Deal" />')
    $('#numericcontrol input[type="text"]').val("15");

    //handles the counter control
    $val = $('#numericcontrol input[type="text"]').val();
    $('#numericcontrol a.plus').click(function () {
        $val++;
        $(this).parent('div#numericcontrol').find('input[type="text"]').val($val);
    });
    $('#numericcontrol a.minus').click(function () {

        if ($val > 1) {
            $val--;
            $(this).parent('div#numericcontrol').find('input[type="text"]').val($val);
        }
        else {
            alert("Value can't be less then 0");
        }
    });

    $(document).on('click', '#dealButton', function () {
        $('.dealer-area').html('');        //clears the board
        $('.player-area').html('');
        $bet = parseInt($val);
        $credits = $credits - $bet;
        $('.credits-total').html('Credits: ' + $credits);
        $playerHand1 = new Hand();       //sets up the game
        $dealerHand = new Hand();
        $dealerHand.dealer = true;
        var topCard = new Card();

        topCard = $deck.drawDeck(0);      //deals out 4 cards
        $playerHand1.addCard(topCard);
        var imageString = getCardImage(topCard);
        displayCard($playerHand1, imageString);
        $playerHand1.numberOfCards++;

        topCard = $deck.drawDeck(0);
        $dealerHand.addCard(topCard);
        //no need to do getCardImage
        displayCard($dealerHand, imageString);
        $dealerHand.numberOfCards++;

        topCard = $deck.drawDeck(0);
        $playerHand1.addCard(topCard);
        imageString = getCardImage(topCard);
        displayCard($playerHand1, imageString);
        $playerHand1.numberOfCards++;

        topCard = $deck.drawDeck(0);
        $dealerHand.addCard(topCard);
        imageString = getCardImage(topCard);
        displayCard($dealerHand, imageString);
        $dealerHand.numberOfCards++;

        $playerHand1.getHandValue();
        $dealerHand.getHandValue();

        if (checkForBlackjack($dealerHand) == true) {
            if (checkForBlackjack($playerHand1 == true)) {            //both players have blackjack
                var creditChange = 0;
                doCreditChange(creditChange);
                imageString = getCardImage(dh.cards[0]);
                $('.face-down').attr('src', imageString);
                $('.button-area').html('<input id="dealButton" type="button" value="Deal" />')
            }
            else {                                 //dealer has blackjack
                var creditChange = -1;
                doCreditChange(creditChange);
                imageString = getCardImage(dh.cards[0]);
                $('.face-down').attr('src', imageString);
                $('.button-area').html('<input id="dealButton" type="button" value="Deal" />')
            }
        }
        else {
            doPlayerTurn($playerHand1, $dealerHand);
        }
    });

    $(document).on('click', '#hitButton', function () {
        var topCard = new Card();
        topCard = $deck.drawDeck(0);
        $playerHand1.addCard(topCard);
        var imageString = getCardImage(topCard);
        displayCard($playerHand1, imageString);
        $playerHand1.numberOfCards++;

        $playerHand1.getHandValue();

        doPlayerTurn($playerHand1, $dealerHand);
    });

    $(document).on('click', '#standButton', function () {
        doDealerTurn($dealerHand);
        doScoring($playerHand1, $dealerHand);
    });

    $(document).on('click', '#splitButton', function () {
        //increase a count numTimesSplit
        //make a new hand named on how many
        //take a card from playerHand
    });
});

function Card(rank, suit) {
    this.rank = rank;
    this.suit = suit;
}

function Stack() {
    //creates a new empty array of cards
    this.cards = new Array();

    this.makeDeck = stackMakeDeck;
    this.shuffleDeck = stackShuffle;
    this.drawDeck = stackDraw;
    this.countCards = stackCardCount;
    this.addCard = stackAddCard;
    this.combineCards = stackCombine;
}

function Hand() {
    this.cards = new Array();
    this.total = 0;      //total value of hand
    this.numberOfCards = 0;       //total number of cards in hand
    this.dealer = false;        //whether the hand belongs to the player or dealer
    this.aceCount = 0;

    this.countCards = stackCardCount;
    this.addCard = stackAddCard;
    this.combineCards = stackCombine;
    this.getHandValue = stackGetSum;
}

function stackMakeDeck(n) {
    //creates a stack containing n decks
    var ranks = new Array('A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K');
    var suits = new Array('C', 'D', 'H', 'S');
    var i, j, k;
    var m;

    m = ranks.length * suits.length;

    this.cards = new Array(n * m);

    for (i = 0; i < n; i++) {
        for (j = 0; j < suits.length; j++) {
            for (k = 0; k < ranks.length; k++) {
                this.cards[i * m + j * ranks.length + k] = new Card(ranks[k], suits[j]);
            }
        }
    }
}

function stackShuffle(n) {
    var i, j, k;
    var temp;

    //Shuffle the stack 'n' times.

    for (i = 0; i < n; i++) {
        for (j = 0; j < this.cards.length; j++) {
            k = Math.floor(Math.random() * this.cards.length);
            temp = this.cards[j];
            this.cards[j] = this.cards[k];
            this.cards[k] = temp
        }
    }
}

function stackDraw(n) {
    //returns the card from position n and removes it from the stack
    var card;

    if (n >= 0 && n < this.cards.length) {
        card = this.cards[n];
        this.cards.splice(n, 1);
    }
    else {
        card = null;
    }
    return card;
}

function stackCardCount() {
    //returns the number of cards in the stack
    return this.cards.length;
}

function stackAddCard(card) {
    //add a card to the end of a stack
    this.cards.push(card);
}

function stackCombine(stack) {
    //combines this stack with the parameter stack and overwrites the parameter stack with a new stack
    this.cards = this.cards.concat(stack.cards);
    stack.cards = new Array();
}

function stackGetSum() {
    //manipulates the ranks of all the cards in a hand to numbers and sums them up
    var i = 0;
    this.total = 0;
    this.aceCount = 0;
    while (i < this.numberOfCards) {
        switch (this.cards[i].rank) {
            case 'A':
                this.total = this.total + 11;
                i++;
                this.aceCount++;
                break;
            case 'J':
                this.total = this.total + 10;
                i++;
                break;
            case 'Q':
                this.total = this.total + 10;
                i++;
                break;
            case 'K':
                this.total = this.total + 10;
                i++;
                break;
            default:
                this.total = this.total + parseInt(this.cards[i].rank);
                i++;
        }
    }
}

function getCardImage(card) {
    //returns a string of an image based on card suit and rank
    switch (card.suit) {
        case 'C':
            switch (card.rank) {
                case 'A':
                    return '/Images/1.png';
                    break;
                case 'K':
                    return '/Images/5.png';
                    break;
                case 'Q':
                    return '/Images/9.png';
                    break;
                case 'J':
                    return '/Images/13.png';
                    break;
                case '10':
                    return '/Images/17.png';
                    break;
                case '9':
                    return '/Images/21.png';
                    break;
                case '8':
                    return '/Images/25.png';
                    break;
                case '7':
                    return '/Images/29.png';
                    break;
                case '6':
                    return '/Images/33.png';
                    break;
                case '5':
                    return '/Images/37.png';
                    break;
                case '4':
                    return '/Images/41.png';
                    break;
                case '3':
                    return '/Images/45.png';
                    break;
                case '2':
                    return '/Images/49.png';
                    break;
            }
        case 'S':
            switch (card.rank) {
                case 'A':
                    return '/Images/2.png';
                    break;
                case 'K':
                    return '/Images/6.png';
                    break;
                case 'Q':
                    return '/Images/10.png';
                    break;
                case 'J':
                    return '/Images/14.png';
                    break;
                case '10':
                    return '/Images/18.png';
                    break;
                case '9':
                    return '/Images/22.png';
                    break;
                case '8':
                    return '/Images/26.png';
                    break;
                case '7':
                    return '/Images/30.png';
                    break;
                case '6':
                    return '/Images/34.png';
                    break;
                case '5':
                    return '/Images/38.png';
                    break;
                case '4':
                    return '/Images/42.png';
                    break;
                case '3':
                    return '/Images/46.png';
                    break;
                case '2':
                    return '/Images/50.png';
                    break;
            }
        case 'H':
            switch (card.rank) {
                case 'A':
                    return '/Images/3.png';
                    break;
                case 'K':
                    return '/Images/7.png';
                    break;
                case 'Q':
                    return '/Images/11.png';
                    break;
                case 'J':
                    return '/Images/15.png';
                    break;
                case '10':
                    return '/Images/19.png';
                    break;
                case '9':
                    return '/Images/23.png';
                    break;
                case '8':
                    return '/Images/27.png';
                    break;
                case '7':
                    return '/Images/31.png';
                    break;
                case '6':
                    return '/Images/35.png';
                    break;
                case '5':
                    return '/Images/39.png';
                    break;
                case '4':
                    return '/Images/43.png';
                    break;
                case '3':
                    return '/Images/47.png';
                    break;
                case '2':
                    return '/Images/51.png';
                    break;
            }
        case 'D':
            switch (card.rank) {
                case 'A':
                    return '/Images/4.png';
                    break;
                case 'K':
                    return '/Images/8.png';
                    break;
                case 'Q':
                    return '/Images/12.png';
                    break;
                case 'J':
                    return '/Images/16.png';
                    break;
                case '10':
                    return '/Images/20.png';
                    break;
                case '9':
                    return '/Images/24.png';
                    break;
                case '8':
                    return '/Images/28.png';
                    break;
                case '7':
                    return '/Images/32.png';
                    break;
                case '6':
                    return '/Images/36.png';
                    break;
                case '5':
                    return '/Images/40.png';
                    break;
                case '4':
                    return '/Images/44.png';
                    break;
                case '3':
                    return '/Images/48.png';
                    break;
                case '2':
                    return '/Images/52.png';
                    break;
            }
    }
}

function displayCard(hand, string) {
    //adds the image to the appropriate div
    if (hand.dealer == false) {
        $('.player-area').append('<img src="' + string + '" class="card" />');
    }
    else {
        if (hand.numberOfCards == 0) {        //if it's the dealer's first card, display the card face down image
            $('.dealer-area').append('<img src="/Images/b1fv.png" class="card face-down">');
        }
        else {
            $('.dealer-area').append('<img src="' + string + '" class="card" />');
        }
    }
}

function checkForBlackjack(hand) {
    if (hand.total == 21) {
        return true;
    }
    else {
        return false;
    }
}

function doPlayerTurn(ph, dh) {
    //determine the game state and provide options
    if (ph.numberOfCards == 2) {
        if (ph.cards[0].rank == ph.cards[1].rank) {         //player has two cards of same rank
            //make sure that you haven't already split 3 times - if so do not show the button, if not show the button
            $('.button-area').html('<input id="standButton" type="button" value="Stand" /><input id="hitButton" type="button" value="Hit" /><input id="splitButton" type="button" value="Split" /><input id="ddButton" type="button" value="Double" />')
        }
        else if (ph.total < 21) {                                  //player has two cards less than 21
            $('.button-area').html('<input id="standButton" type="button" value="Stand" /><input id="hitButton" type="button" value="Hit" /><input id="ddButton" type="button" value="Double" />')
        }
        else {                                                             //player has blackjack
            var creditChange = parseInt($bet * 2.5);
            doCreditChange(creditChange);
            var imageString;
            imageString = getCardImage(dh.cards[0]);
            $('.face-down').attr('src', imageString);
            $('.button-area').html('<input id="dealButton" type="button" value="Deal" />')
        }
    }
    else {
        if (ph.total < 21) {            //player has more than two cards less than 21
            $('.button-area').html('<input id="standButton" type="button" value="Stand" /><input id="hitButton" type="button" value="Hit" />')
        }
        else if (ph.total > 21) {               //check for aces
            if (ph.aceCount > 0) {              //player has over 21, but has an ace
                ph.total = ph.total - 10;
                ph.aceCount--;
                doPlayerTurn(ph, dh);
            }
            else {                                     //player has over 21 with no ace
                var creditChange = -1;
                doCreditChange(creditChange);
                var imageString;
                imageString = getCardImage(dh.cards[0]);
                $('.face-down').attr('src', imageString);
                $('.button-area').html('<input id="dealButton" type="button" value="Deal" />')
            }
        }
        else {                              //player has 21
            doDealerTurn(dh);
            doScoring(ph, dh);
        }
    }
}

function doDealerTurn(dh) {
    var endTurn = false;
    var imageString;
    imageString = getCardImage(dh.cards[0]);
    $('.face-down').attr('src', imageString);
    while (endTurn == false) {
        if (dh.total < 17) {
            var topCard = $deck.drawDeck(0);
            imageString = getCardImage(topCard);
            displayCard(dh, imageString);
            dh.addCard(topCard);
            dh.numberOfCards++;
            dh.getHandValue();
        }
        else if (dh.total == 17) {
            if (dh.aceCount == 0) {
                endTurn = true;
            }
            else {          
                var topCard = $deck.drawDeck(0);
                imageString = getCardImage(topCard);
                displayCard(dh, imageString);
                dh.addCard(topCard);
                dh.numberOfCards++;
                dh.getHandValue();
            }
        }
        else if (dh.total > 21) {
            if (dh.aceCount > 0) {
                dh.total = dh.total - 10;
                dh.aceCount--;
            }
            else {
                endTurn = true;
            }
        }
        else {
            endTurn = true;
        }
    }
}

function doScoring(ph, dh) {
    if (dh.total > 21) {         //dealer busts
        var creditChange = parseInt($bet * 2);
        doCreditChange(creditChange);
        $('.button-area').html('<input id="dealButton" type="button" value="Deal" />')
    }
    else if (ph.total > dh.total) {      //player score higher
        var creditChange = parseInt($bet * 2);
        doCreditChange(creditChange);
        $('.button-area').html('<input id="dealButton" type="button" value="Deal" />')
    }
    else if (ph.total == dh.total) {   //push
        var creditChange = 0;
        doCreditChange(creditChange);
        $('.button-area').html('<input id="dealButton" type="button" value="Deal" />')
    }
    else {                                           //dealer score higher
        var creditChange = -1;
        doCreditChange(creditChange);
        $('.button-area').html('<input id="dealButton" type="button" value="Deal" />')
    }
}

function doCreditChange(cc) {
    if (cc > 0) {
        $credits = $credits + cc;
        $('.credits-total').html('Credits: ' + $credits);
        $('.credits-total').append('<br />+ ' + cc);
    }
    else if (cc < 0) {
        $('.credits-total').html('Credits: ' + $credits);
        $('.credits-total').append('<br />- ' + $bet);
    }
    else {
        $credits = $credits + $bet;
        $('.credits-total').html('Credits: ' + $credits);
        $('.credits-total').append('<br />Push');
    }
}