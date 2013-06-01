var code = "";
var url = "http://candybox.pubnub.co";

function getPhpStuff(boolean){
    if(boolean == true) return 1;
    return 0;
}

function save() {
	//Debut de la fonction d'ajax
	$.ajax({
		type: "POST",//Envoi des données avec la méthode POST
		url: url + "/save",//à la page sauvegarde.php
		data: {
			code : ((code === undefined || code == null || code.length == "") ? 0 : code),
			swordName : sword.name,
			swordSpecialSword : getPhpStuff(sword.specialSword),
			swordSpecialPower : sword.specialPower,
			candiesNbrOwned : candies.nbrOwned,
			candiesNbrThrown : candies.nbrThrown,
			candiesNbrEaten : candies.nbrEaten,
			candiesNbrTotal : candies.nbrTotal,
			candiesCandiesPerSecond : candies.candiesPerSecond,
			candiesConverterActivated : getPhpStuff(candiesConverter.activated),
			cauldronBookPage : cauldron.bookPage,
			cauldronCandies : cauldron.candiesInTheCauldron,
			cauldronLollipops : cauldron.lollipopsInTheCauldron,
			chocolateBarsNbrOwned : chocolateBars.nbrOwned,
			farmLollipopsPlanted : farm.lollipopsPlanted,
			farmCurrentFlagIndex : farm.currentFlagIndex,
			farmPlantingButtonsStep : farm.plantingButtonsStep,
			forgeStep : forge.step,
			shopLollipopsButtonsShown : getPhpStuff(shop.buy10LollipopsButtonShown),
			shopShown : getPhpStuff(shop.shown),
			shopTicklingStep : shop.ticklingStep,
			shopClickingOnLollipopStep : shop.clickingOnLollipopStep,
			hutStep : hut.step,
			hutSpeech : hut.speech,
			inventoryMagicianHatLetter : inventory.magicianHatLetter,
			lollipopsNbrOwned : lollipops.nbrOwned,
			lollipopsNbrInStock : lollipops.nbrInStock,
			lollipopsNbrBought : lollipops.nbrBought,
			mainNbrOfSecondsSinceLastMinInterval : main.nbrOfSecondsSinceLastMinInterval,
			mainNbrOfSecondsSinceLastHourInterval : main.nbrOfSecondsSinceLastHourInterval,
			mainNbrOfSecondsSinceLastDayInterval : main.nbrOfSecondsSinceLastDayInterval,
			mountGoblinBasicChestProbability : mountGoblin.basicChestProbability,
			peacefulForestBasicChestProbability : peacefulForest.basicChestProbability,
			peacefulForestPoniesEncountered : peacefulForest.poniesEncountered,
			objectsHaveObjectKey : getPhpStuff(objects.list.key.have),
			objectsHaveObjectHutMap : getPhpStuff(objects.list.hutMap.have),
			objectsHaveObjectWellMap : getPhpStuff(objects.list.wellMap.have),
			objectsHaveObjectSwampMap : getPhpStuff(objects.list.swampMap.have),
			objectsHaveObjectBoots : getPhpStuff(objects.list.boots.have),
			objectsHaveObjectMagicianHat : getPhpStuff(objects.list.magicianHat.have),
			objectsHaveObjectPinkRing : getPhpStuff(objects.list.pinkRing.have),
			objectsHaveObjectForgeMap : getPhpStuff(objects.list.forgeMap.have),
			objectsHaveObjectCandiesConverter : getPhpStuff(objects.list.candiesConverter.have),
			objectsHaveObjectPlateArmour : getPhpStuff(objects.list.plateArmour.have),
			objectsHaveObjectCauldron : getPhpStuff(objects.list.cauldron.have),
			objectsHaveObjectMagicalHorn : getPhpStuff(objects.list.magicalHorn.have),
			objectsHaveObjectHornOfPlenty : getPhpStuff(objects.list.hornOfPlenty.have),
			objectsHaveObjectOldAmulet : getPhpStuff(objects.list.oldAmulet.have),
			potionsShownHealth : getPhpStuff(potions.list.health.shown),
			potionsShownEscape : getPhpStuff(potions.list.escape.shown),
			potionsShownBerserk : getPhpStuff(potions.list.berserk.shown),
			potionsShownFireScroll : getPhpStuff(potions.list.fireScroll.shown),
			potionsShownAcidRainScroll : getPhpStuff(potions.list.acidRainScroll.shown),
			potionsShownTeleportScroll : getPhpStuff(potions.list.teleportScroll.shown),
			potionsShownEarthquakeScroll : getPhpStuff(potions.list.earthquakeScroll.shown),
			potionsShownImpInvocationScroll : getPhpStuff(potions.list.impInvocationScroll.shown),
			potionsShownMajorHealth : getPhpStuff(potions.list.majorHealth.shown),
			potionsShownInvulnerability : getPhpStuff(potions.list.invulnerability.shown),
			potionsShownTurtle : getPhpStuff(potions.list.turtle.shown),
			potionsShownJelly : getPhpStuff(potions.list.jelly.shown),
			potionsShownSeed : getPhpStuff(potions.list.seed.shown),
			potionsShownCloning : getPhpStuff(potions.list.cloning.shown),
			potionsShownSuperman : getPhpStuff(potions.list.superman.shown),
			potionsShownGmooh : getPhpStuff(potions.list.gmooh.shown),
			potionsNbrOwnedHealth : potions.list.health.nbrOwned,
			potionsNbrOwnedEscape : potions.list.escape.nbrOwned,
			potionsNbrOwnedBerserk : potions.list.berserk.nbrOwned,
			potionsNbrOwnedFireScroll : potions.list.fireScroll.nbrOwned,
			potionsNbrOwnedAcidRainScroll : potions.list.acidRainScroll.nbrOwned,
			potionsNbrOwnedTeleportScroll : potions.list.teleportScroll.nbrOwned,
			potionsNbrOwnedEarthquakeScroll : potions.list.earthquakeScroll.nbrOwned,
			potionsNbrOwnedImpInvocationScroll : potions.list.impInvocationScroll.nbrOwned,
			potionsNbrOwnedMajorHealth : potions.list.majorHealth.nbrOwned,
			potionsNbrOwnedInvulnerability : potions.list.invulnerability.nbrOwned,
			potionsNbrOwnedTurtle : potions.list.turtle.nbrOwned,
			potionsNbrOwnedJelly : potions.list.jelly.nbrOwned,
			potionsNbrOwnedSeed : potions.list.seed.nbrOwned,
			potionsNbrOwnedCloning : potions.list.cloning.nbrOwned,
			potionsNbrOwnedSuperman : potions.list.superman.nbrOwned,
			potionsNbrOwnedGmooh : potions.list.gmooh.nbrOwned,
			questMaxLandOrder : quest.maxLandOrder,
			questTiredTime : quest.tiredTime,
			spellsFasterCandiesFibo1 : spells.fasterCandiesFiboPrev,
			spellsFasterCandiesFibo2 : spells.fasterCandiesFiboCurr,
			swampStep : swamp.step,
			tabsAnimation : tabs.animation,
			wishingWellSpeech : wishingWell.speech,
			wishingWellStep : wishingWell.step,
			yourselfCanSurpass : getPhpStuff(yourself.canSurpass),
			developperComputerWon : getPhpStuff(developperComputer.won)
		},
	   success: function(msg){//Une fois la requête terminée
			if(msg=="Erreur"){ //Si la sauvegarde à échouée

				// Alors on affiche un message
                                alert("There was a problem while saving. Please try again later :/");
				$("span#save").html("");

			}else{ // si la sauvegarde à fonctionnée

				// on affiche le lien de chargement
                                if(msg.substring(0,5) != "<br /"){
				code = msg.substring(0,5);
                                alert('You saved successfully under the name "' + code + '", don\'t forget this name, you may need it later !\nTo load your save, just click the link next to the Save button.\nYou can even put it in your bookmarks !');
                                $("span#save").html(" You can load your save later <a href=\"index.html?pass=" + code + "\">here</a>.");
						        }
                                else{
                                    alert("There was a problem while saving. Please try again later :/");
                                }
                        }
	   }
	});
	return false;
}

var stats = (function () {
    var currentUpdate = JSON.parse(localStorage.getItem(code)) || getDefaultStats(), lastUpdate = currentUpdate;

    function getDefaultStats() {
        return {
            'code' : "",
            'TotalCandies' : 0,
            'CandiesPerSecond' : 0,
            'TotalLollipops' : 0,
            'LollipopsPerSecond' : 0,
            'AnsweredFrogsQuestions' : 0,
            'KilledTheWhale' : 0,
            'FoundTheHorn' : 0,
            'KilledTheDevil' : 0,
            'FinishedTheGame' : 0,
            'EncounteredWoodPony' : 0,
            'AnnoyedCandyMerchant' : 0,

            'NumberOfSwords' : 0,
            'Sword of Life' : 0,
            'Sword of Flames' : 0,
            'Sword of Summoning' : 0,

            'NumberOfWishes' : 0,
            'MultiplyCandies' : 0,
            'MultiplyLollipops' : 0,
            'PotionsAndScrolls' : 0
        };
    }

    function getCurrentStats() {
        var current = {
            'code' : code,
            'TotalCandies' : candies.nbrOwned,
            'CandiesPerSecond' : candies.candiesPerSecond * (objects.list.oldAmulet.have ? 3 : 1),
            'TotalLollipops' : lollipops.nbrOwned,
            'LollipopsPerSecond' : Math.round(farm.lollipopsPerDay / 86400) * (objects.list.hornOfPlenty.have ? 3 : 1),
            'AnsweredFrogsQuestions' : (swamp.step >= 17) ? 1 : 0,
            'KilledTheWhale' : (quest.maxLandOrder >= 3) ? 1 : 0,
            'FoundTheHorn' : objects.list.hornOfPlenty.have ? 1 : 0,
            'KilledTheDevil' : (quest.maxLandOrder >= 7) ? 1 : 0,
            'FinishedTheGame' : developperComputer.won ? 1 : 0,
            'EncounteredWoodPony' : peacefulForest.poniesEncountered ? 1 : 0,
            'AnnoyedCandyMerchant' : (
                (shop.ticklingStep >= 3) &&
                (shop.clickingOnLollipopStep >= 5)
            ) ? 1 : 0,

            'NumberOfSwords' : 0,
            'Sword of Life' : 0,
            'Sword of Flames' : 0,
            'Sword of Summoning' : 0,

            'NumberOfWishes' : 0,
            'MultiplyCandies' : 0,
            'MultiplyLollipops' : 0,
            'PotionsAndScrolls' : 0
        };

        if ([ "Sword of Life", "Sword of Flames", "Sword of Summoning" ].indexOf(sword.name) >= 0)
            current[sword.name] = 1;

        if (wishingWell.step >= 2) {
            if (wishingWell.speech.indexOf("candies") > 0) current['MultiplyCandies'] = 1;
            else if (wishingWell.speech.indexOf("lollipops") > 0) current['MultiplyLollipops'] = 1;
            else if (wishingWell.speech.indexOf("potions") > 0) current['PotionsAndScrolls'] = 1;
        }

        current['NumberOfSwords'] = (current['Sword of Life'] || current['Sword of Flames'] || current['Sword of Summoning']) ? 1 : 0;
        current['NumberOfWishes'] = (current['MultiplyCandies'] || current['MultiplyLollipops'] || current['PotionsAndScrolls']) ? 1 : 0;

        return current;
    }

    function load() {
        currentUpdate = lastUpdate = JSON.parse(localStorage.getItem(code)) || getDefaultStats();
    }

    function update() {
        currentUpdate = getCurrentStats();
        if (lastUpdate['FinishedTheGame'] || (
            currentUpdate['FinishedTheGame'] && lastUpdate['code'] === ""
        )) return;

        var delta = {
            'code' : code
        };

        $.each(lastUpdate, function (k, v) {
            if (typeof(v) !== "string")
                delta[k] = currentUpdate[k] - v;
        });

        $.ajax({
            type: "POST",
            url: url + "/update",
            data: delta,
            success: function () {
                lastUpdate = currentUpdate;
                localStorage.setItem(code, JSON.stringify(lastUpdate));
            }
        });
    }

    return {
        'load' : load,
        'update' : update
    }
})();
