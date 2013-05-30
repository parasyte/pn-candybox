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

        $("#SwordOfLife").text(msg.NumberOfSwords["Sword of Life"]);
        $("#SwordOfFlames").text(msg.NumberOfSwords["Sword of Flames"]);
        $("#SwordOfSummoning").text(msg.NumberOfSwords["Sword of Summoning"]);

        $("#MultiplyCandies").text(msg.NumberOfWishes.MultiplyCandies);
        $("#MultiplyLollipops").text(msg.NumberOfWishes.MultiplyLollipops);
        $("#ScrollsAndPotions").text(msg.NumberOfWishes.ScrollsAndPotions);

        $("#AnsweredFrogsQuestions").text(msg.AnsweredFrogsQuestions);
        $("#KilledTheWhale").text(msg.KilledTheWhale);
        $("#FoundTheHorn").text(msg.FoundTheHorn);
        $("#KilledTheDevil").text(msg.KilledTheDevil);
        $("#FinishedTheGame").text(msg.FinishedTheGame);
        $("#EncounteredWoodPony").text(msg.EncounteredWoodPony);
        $("#AnnoyedCandyMerchant").text(msg.AnnoyedCandyMerchant);
    }

})();
