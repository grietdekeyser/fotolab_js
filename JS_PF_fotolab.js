//array van kleuren, object per kleur
var aoKleuren = [
	{naam:"kleur",prijs:1.02,eenheid:"stuk"},
	{naam:"retro",prijs:1.75,eenheid:"stuk"},
	{naam:"sepia",prijs:1.20,eenheid:"stuk"},
	{naam:"zwart-wit",prijs:0.95,eenheid:"stuk"}
]

//array van formaten, array per formaat
var aaFormaten = [
	["A4",1.95,"stuk"],
	["A3",3.55,"stuk"],
	["A1",5,"stuk"],
	["10x15 cm",0.89,"stuk"],
	["20x30 cm",1.29,"stuk"],
	["10x15 cm",9.20,"dozijn"],	
	["20x30 cm",11.45,"dozijn"]
]

//array van afwerking, object per afwerking
var aoAfwerking = [
	{naam:"glans",prijs:0.20},
	{naam:"mat",prijs:0},
	{naam:"pearl",prijs:1.25}
]


window.onload = function() {

	//DOM-ELEMENTEN
	var eForm = document.frmBestel;
	var eFotos = document.frmBestel.foto;
	var eKleur = document.getElementById('kleur');
	var eFormaat = document.getElementById('formaat');
	var eAfwerking = document.getElementById('afwerking');
	var eAantal = document.getElementById('aantal');
	var eToevoegen = document.getElementById('toevoegen');
	var eContainermand = document.getElementById('containermand');

	//KEUZELIJSTEN OPVULLEN
	//keuzelijst kleuren
	eKleur.appendChild(keuzelijstOpvullen(aoKleuren,"naam","prijs","eenheid"));

	//keuzelijst formaten
	eFormaat.appendChild(keuzelijstOpvullen(aaFormaten,0,1,2));

	//keuzelijst afwerking
	eAfwerking.appendChild(keuzelijstOpvullen(aoAfwerking,"naam","prijs"));

	//EVENT HANDLER
	eToevoegen.addEventListener('click', function() {
		//formulierwaarden aflezen
		var sFoto = undefined;
		for (var i=0; i<eFotos.length; i++){
			if(eFotos[i].checked == true){
				sFoto = eFotos[i].value;
        	}
        }
		var sKleur = waardeSplitsen(eKleur,0);
		var sFormaat = waardeSplitsen(eFormaat,0);
		var sEenheid = waardeSplitsen(eFormaat,1)
		var sAfwerking = eAfwerking.value;
		var nAantal = parseInt(eAantal.value);

		//VALIDATIE
		var aFoutBoodschappen = []
		//verplichte velden (kleur, formaat, afwerking)
		if (sKleur == "") {
			sFout = "Kies een kleur."
			aFoutBoodschappen.push(sFout);
		}
		if (sFormaat == "") {
			sFout = "Kies een formaat."
			aFoutBoodschappen.push(sFout);
		}
		if (sAfwerking == "") {
			sFout = "Kies een afwerking."
			aFoutBoodschappen.push(sFout);
		}

		//geldig getal, groter dan 0 (aantal)
		if (isNaN(nAantal) || nAantal <= 0) {
			sFout = "Kies een geldig aantal, groter dan 0."
			aFoutBoodschappen.push(sFout);
		}

		if (aFoutBoodschappen.length>0) {
			//foutmeldingen tonen
			var sFoutboodschappen = "";
			for (var i=0;i<aFoutBoodschappen.length;i++) {
				sFoutboodschappen += aFoutBoodschappen[i];
				sFoutboodschappen += "\n";
			}
			window.alert(sFoutboodschappen);
		}
		else {
			//WINKELMANDJE VULLEN
			tabelInvullen(sFoto,sKleur,sFormaat,sEenheid,sAfwerking,nAantal);
		}
	});
}

function keuzelijstOpvullen(array,b,c,d) {
	/* keuzelijsten opvullen o.b.v. array
	array: array met input
	b, c: index/waarde van benodigde gegevens uit array (van arrays/objecten)
	d: index/waarde van benodigde gegevens uit array (van arrays/objecten), indien aanwezig
	*/
	var eDfOptions = document.createDocumentFragment();
	for (var i=0;i<array.length;i++) {
		var rij = array[i];
		var eOption = document.createElement('option');
		var sTekst = rij[b] + " (" + rij[c] + " €";
		eOption.value = rij[b];
		if (d != undefined) {
			sTekst += "/" + rij[d];
			eOption.value += "_" + rij[d];
		}
		sTekst += ")";
		eOption.innerHTML = sTekst;
		eDfOptions.appendChild(eOption);
	}
	return eDfOptions;
}

function waardeSplitsen(elem,index) {
	/* splitst waarde van een element o.b.v. separator('_') in een array*/
	var sElem = elem.value;
	var aElem = sElem.split('_');
	var sIndex = aElem[index];
	return sIndex;
}

function tabelInvullen(foto,kl,formaat,eenheid,afw,n) {
	/* maakt tabel (indien tabel nog niet bestaat)
	foto: string, gekozen foto
	kl: string, gekozen kleur
	formaat: string, gekozen formaat
	eenheid: string, gekozen eenheid
	afw: string, gekozen afwerking
	n: number, gekozen aantal
	*/
	var eContainermand = document.getElementById('containermand');
	var eTabel = eContainermand.querySelector('table');
	if (eTabel) {
		//tabel bestaat
		var idRij = foto + kl + formaat + eenheid + afw;
		var bestaandeRij = document.getElementById(idRij);
		if (bestaandeRij) {
			//rij bestaat
			//aantal wijzigen
			var rijAantal = bestaandeRij.querySelector('.aantal');
			var nieuwAantal = parseInt(rijAantal.innerHTML) + parseInt(n);
			rijAantal.innerHTML = nieuwAantal;

			//subtotaal wijzigen
			var rijTotaal = bestaandeRij.querySelector('.subtotaal');
			rijTotaal.innerHTML = subtotaalBerekenen(kl,formaat,eenheid,afw,nieuwAantal);
		}
		else {
			//nieuwe rij
			eTabel.innerHTML += rijToevoegen(foto,kl,formaat,eenheid,afw,n);
		}
	}
	else {
		//tabel maken
		eContainermand.removeChild(eContainermand.querySelector('p'));
		eTabel = document.createElement('table');
		//kolomtitels
		var eHead = eTabel.createTHead();
		eHead.innerHTML = "<tr> <th>foto</th> <th>kleur</th> <th class='thformaat'>formaat</th> <th>afwerking</th> <th>aantal</th> <th>totaal</th> </tr>";
		
		//rij toevoegen
		eTabel.innerHTML += rijToevoegen(foto,kl,formaat,eenheid,afw,n);

		//tabel toevoegen aan container
		eContainermand.appendChild(eTabel);

		//algemeen totaal
		var eFoot = eTabel.createTFoot();
		eFoot.innerHTML += "<tr><td></td><td></td><td></td><td></td><td></td><td class='eindtotaal'></td></tr>";
	}
	var eEindtotaal = eTabel.querySelector('.eindtotaal');
	eEindtotaal.innerHTML = eindtotaalBerekenen();
}

function rijToevoegen(foto,kl,formaat,eenheid,afw,n) {
	/* voegt rijen toe
	foto: string, gekozen foto
	kl: string, gekozen kleur
	formaat: string, gekozen formaat
	eenheid: string, gekozen eenheid
	afw: string, gekozen afwerking
	n: number, gekozen aantal
	*/
	var nieuwId = foto + kl + formaat + eenheid + afw;
	var nieuweRij = "<tr id='" + nieuwId + "''>";
	nieuweRij += "<td>" + fotoToevoegen(foto,kl) + "</td>"; //cel foto
	nieuweRij += "<td>" + kl + "</td>"; //cel kleur
	nieuweRij += "<td>" + formaat + " (" + eenheid + ")" + "</td>"; //cel formaat
	nieuweRij += "<td>" + afw + "</td>"; //cel afwerking
	nieuweRij += "<td class='aantal'>" + n + "</td>"; //cel aantal
	nieuweRij += "<td class='subtotaal'>"+ subtotaalBerekenen(kl,formaat,eenheid,afw,n) + "</td>"; //cel subtotaal
	nieuweRij +="</tr>";
	return nieuweRij;
}

function fotoToevoegen(foto,kl) {
	/*voegt foto toe
	foto: string, gekozen foto
	kl: string, gekozen kleur
	*/
	var aFoto = foto.split('.');
	var bronFoto = foto;
	if (kl == "zwart-wit") {
		kl = "zwartwit";
	}
	if (kl != "kleur") {
		bronFoto = aFoto[0] + "_" + kl + ".png";
	}
	var eImg = "<img src='" + bronFoto + "'>";
	return eImg;
}

function subtotaalBerekenen(kl,formaat,eenheid,afw,n) {
	/* berekent subtotaal
	kl: string, gekozen kleur
	formaat: string, gekozen formaat
	eenheid: string, gekozen eenheid
	afw: string, gekozen afwerking
	n: number, aantal
	*/
	//prijs gekozen kleur
	var prijsKl = prijsBerekenen(aoKleuren,"naam",kl,"prijs");

	//prijs gekozen formaat
	var prijsFormaat = prijsBerekenenEenheid(aaFormaten,0,formaat,2,eenheid,1);
	//prijs per dozijn?
	var prijsPer = 1;
	if (eenheid == "dozijn") {
		prijsPer = 12;
	}

	//prijs gekozen afwerking
	var prijsAfw = prijsBerekenen(aoAfwerking,"naam",afw,"prijs")

	//subtotaal berekenen
	var subtotaal = (((prijsKl * prijsFormaat) + (prijsAfw * prijsPer)) * n).toFixed(2);
	return subtotaal;
}

function prijsBerekenen(array,b,c,prijs) {
	/* berekent prijs van geselecteerde optie
	array: array van arrays of objecten
	b: index/waarde optie in array van arrays/objecten
	c: gekozen optie
	prijs: index/waarde prijs array van arrays/objecten
	*/
	for (var i=0;i<array.length;i++) {
		var rij = array[i];
		if (rij[b] == c) {
			var prijs = rij[prijs];
		}
	}
	return prijs;
}

function prijsBerekenenEenheid(array,b,c,d,eenheid,prijs) {
	/* berekent prijs van geselecteerde optie, rekening houdend met de eenheid
	array: array van arrays of objecten
	b: index/waarde optie in array van arrays/objecten
	c: gekozen optie
	d: index eenheid in array van arrays
	eenheid: gekozen eenheid
	prijs: index/waarde prijs array van arrays/objecten
	*/
	for (var i=0;i<array.length;i++) {
		var rij = array[i];
		if (rij[b] == c && rij[d] == eenheid) {
			var prijs = rij[prijs];
		}
	}
	return prijs;
}

function eindtotaalBerekenen() {
	/* berekent eindtotaal */
	var aTotalen = document.querySelectorAll('.subtotaal');
	var nEindtotaal = 0;
	for (var i=0;i<aTotalen.length;i++) {
		nEindtotaal += parseFloat(aTotalen[i].innerHTML);
	}
	nEindtotaal = nEindtotaal.toFixed(2);
	return nEindtotaal;
}
