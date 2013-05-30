(function () {

    var pubnub = PUBNUB.init({
        subscribe_key : "sub-c-0329d2b6-bd99-11e2-b58e-02ee2ddab7fe"
    });

    pubnub.subscribe({
        channel : "candybox",
        message : update
    });

    function update(msg) {
        $("#date").text((new Date()).toUTCString());

        $("#_NumberOfSaves").text(msg._NumberOfSaves);
        $("#TotalCandies").text(msg.TotalCandies);
        $("#CandiesPerSecond").text(msg.CandiesPerSecond);
        $("#TotalLollipops").text(msg.TotalLollipops);
        $("#LollipopsPerSecond").text(msg.LollipopsPerSecond);

        var SwordOfLife = msg.NumberOfSwords ? msg["Sword of Life"] / msg.NumberOfSwords : 0;
        var SwordOfFlames = msg.NumberOfSwords ? msg["Sword of Flames"] / msg.NumberOfSwords : 0;
        var SwordOfSummoning = msg.NumberOfSwords ? msg["Sword of Summoning"] / msg.NumberOfSwords : 0;
        $("#SwordOfLife").text(SwordOfLife + "%");
        $("#SwordOfFlames").text(SwordOfFlames + "%");
        $("#SwordOfSummoning").text(SwordOfSummoning + "%");

        var MultiplyCandies = msg.NumberOfWishes ? msg.MultiplyCandies / msg.NumberOfWishes : 0;
        var MultiplyLollipops = msg.NumberOfWishes ? msg.MultiplyLollipops / msg.NumberOfWishes : 0;
        var ScrollsAndPotions = msg.NumberOfWishes ? msg.ScrollsAndPotions / msg.NumberOfWishes : 0;
        $("#MultiplyCandies").text(MultiplyCandies + "%");
        $("#MultiplyLollipops").text(MultiplyLollipops + "%");
        $("#ScrollsAndPotions").text(ScrollsAndPotions + "%");

        $("#AnsweredFrogsQuestions").text(msg.AnsweredFrogsQuestions);
        $("#KilledTheWhale").text(msg.KilledTheWhale);
        $("#FoundTheHorn").text(msg.FoundTheHorn);
        $("#KilledTheDevil").text(msg.KilledTheDevil);
        $("#FinishedTheGame").text(msg.FinishedTheGame);
        $("#EncounteredWoodPony").text(msg.EncounteredWoodPony);
        $("#AnnoyedCandyMerchant").text(msg.AnnoyedCandyMerchant);
    }

})();
