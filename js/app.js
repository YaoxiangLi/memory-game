/*
 * Create a list that holds all of your cards
 */
let list = ['diamond', 'diamond',
            'paper-plane-o', 'paper-plane-o',
            'anchor', 'anchor',
            'bolt', 'bolt',
            'cube', 'cube',
            'leaf', 'leaf',
            'bicycle', 'bicycle',
            'bomb', 'bomb']
// A stack that storing the opened cards for compare
let opened = [];
// Indicate the number of moves till now
let moves = 0;
// Indicate the number of correct matches till now
let matchFound = 0;
// The time elapsed by seconds
let sec = 0;
// Game stars difficulty setup
const highRank = list.length / 2 + 4;
const lowRank = list.length / 2 + 12;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function initialGame(){
    // Clean the deck
    $('.deck').empty();
    // Shuffle the list of cards
    let cards = shuffle(list);
    // Add each card's HTML to the page
    for (let i = 0; i < cards.length; i++) {
        $('.deck').append($('<li class="card"><i class="fa fa-' + cards[i] + '"></i></li>'))
    }
    // Reset the indicator moves and matches
    moves = 0;
    matchFound = 0;
    // Reset moves panel
    $('.moves').text('0');
    // Reset stars panel
    $('.stars i').removeClass('fa-star-o').addClass('fa-star');
    // Add the card listener
    cardListener()
    // Add the timer
    startTimer();
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Start timer on the first card click
function startTimer() {
        let clicks = 0;
        $(".card").on("click", function() {
        clicks += 1;
        if (clicks === 1) {
            sec = 0;
            function time ( val ) { return val > 9 ? val : "0" + val; }
            timer = setInterval( function(){
            $(".minutes").html(time(parseInt(sec / 60, 10)));
            $(".seconds").html(time(++sec % 60));
            }, 1000);
        }
    })
}

// Card listener
function cardListener() {
    $(".card").on("click", function() {
        // Check whether this card matched opened or showed
        if ($(this).hasClass("match") || $(this).hasClass("open") || $(this).hasClass("show")) { return; }

        $(this).addClass('open show');
        opened.push($(this).html());

        if (opened.length > 1) {
            if ($(this).html() === opened[0]){
                $('.deck').find('.open').addClass('match animated infinite rubberBand');
                setTimeout(function() {
                    $('.deck').find('.match').removeClass('open show animated infinite rubberBand');
                }, 500);
                matchFound++;
            } else {
                $('.deck').find('.open').addClass('notmatch animated infinite wobble');
                setTimeout(function() {
                    $('.deck').find('.open').removeClass('animated infinite wobble');
                }, 500);
                setTimeout(function() {
                    $('.deck').find('.open').removeClass('open show notmatch animated infinite wobble');
                }, 500);
            }
            opened = [];
            moves++;
            setRating(moves);
            $('.moves').html(moves);
        }

        // Check the win condition
        if (list.length / 2 === matchFound) {
            setRating(moves);
            let score = setRating(moves);
            setTimeout(function() {
                endGame(moves, score);
            }, 500);
            clearInterval(timer);
            $(".minutes").html("00");
            $(".seconds").html("00");
        }
    });
};

// End Game
function endGame(moves, score) {
	swal({
		title: 'Congratulations! You Won!',
		text: 'With ' + moves + ' Moves and ' + score + ' Stars.\n The time you cost is: ' + parseInt(sec / 60, 10) + ':' + sec % 60 ,
		type: 'success',
		confirmButtonColor: '#02ccba',
		confirmButtonText: 'Play again!'
	}).then(function(isConfirm) {
		if (isConfirm) {
			initialGame();
		}
	})
}

// Set Rating
function setRating(moves) {
	let rating = 3;
	if (moves > highRank && moves < lowRank) {
		$('.stars i').eq(2).removeClass('fa-star').addClass('fa-star-o');
		rating = 2;
	} else if (moves >= lowRank) {
		$('.stars i').eq(1).removeClass('fa-star').addClass('fa-star-o');
		rating = 1;
	}
	return rating;
};

// Restart
$('.restart').bind('click', function() {
    swal({
        title: 'Are you sure?',
        text: 'Your progress will be Lost!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#02ccba',
        cancelButtonColor: '#f95c3c',
        confirmButtonText: 'Yes, Restart!'
    }).then(function(isConfirm) {
        if (isConfirm) {
            clearInterval(timer);
            $(".minutes").html("00");
            $(".seconds").html("00");
            initialGame();
        }
    })
});

initialGame()
