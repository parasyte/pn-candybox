(function () {

    var pubnub = PUBNUB.init({
        subscribe_key : "sub-c-0329d2b6-bd99-11e2-b58e-02ee2ddab7fe"
    });

    pubnub.subscribe({
        channel : "candybox",
        message : update
    });

    function safe_div(numer, denom) {
        return denom ? numer / denom : 0;
    }

    function avg(sum, count) {
        return Math.round(safe_div(sum, count) * 1000) / 1000;
    }

    function pct(fraction, total) {
        return (Math.round(safe_div(fraction, total) * 10000) / 100) + "%";
    }

    function update(msg) {
        $("#date").text((new Date()).toUTCString());

        $("#_NumberOfSaves").text(msg._NumberOfSaves);
        $("#TotalCandies").text(msg.TotalCandies);
        $("#CandiesPerSecond").text(avg(msg.CandiesPerSecond, msg._NumberOfSaves));
        $("#TotalLollipops").text(msg.TotalLollipops);
        $("#LollipopsPerSecond").text(avg(msg.LollipopsPerSecond, msg._NumberOfSaves));

        $("#SwordOfLife").text(pct(msg["Sword of Life"], msg.NumberOfSwords));
        $("#SwordOfFlames").text(pct(msg["Sword of Flames"], msg.NumberOfSwords));
        $("#SwordOfSummoning").text(pct(msg["Sword of Summoning"], msg.NumberOfSwords));

        $("#MultiplyCandies").text(pct(msg.MultiplyCandies, msg.NumberOfWishes));
        $("#MultiplyLollipops").text(pct(msg.MultiplyLollipops, msg.NumberOfWishes));
        $("#PotionsAndScrolls").text(pct(msg.PotionsAndScrolls, msg.NumberOfWishes));

        $("#AnsweredFrogsQuestions").text(msg.AnsweredFrogsQuestions);
        $("#KilledTheWhale").text(msg.KilledTheWhale);
        $("#FoundTheHorn").text(msg.FoundTheHorn);
        $("#KilledTheDevil").text(msg.KilledTheDevil);
        $("#FinishedTheGame").text(msg.FinishedTheGame);
        $("#EncounteredWoodPony").text(msg.EncounteredWoodPony);
        $("#AnnoyedCandyMerchant").text(msg.AnnoyedCandyMerchant);
    }

})();
