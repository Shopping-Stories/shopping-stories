import { CategoryModel } from './categories.schema';
import { PersonModel } from './person.schema';
import { PlaceModel } from './place.schema';
import { TobaccoMarkModel } from './tobaccoMarks.schema';

export default async function parseSpreadsheetObj(spreadsheetObj: any[]) {
	let res = [];
	let meta = [];
	let accHold = [];
	let errorCode = [];
	let dates = [];
	let money = [];
	let people = [];
	let places = [];
	for (let i = 0; i < spreadsheetObj.length; i++) {
		const entry = spreadsheetObj[i];
		errorCode[i] = 0;
		res[i] = {
			tobaccoEntry: null,
			itemEntry: null,
			regEntry: null,
		};

		let type = Number(entry.EntryType);
		if (entry.EntryType === null) {
			type = 0;
		}

		console.log(type);

		try {
			if (entry.Entry) {
				if (type === 1) {
					//console.log('Id: ' + entry._id + ' is a tobacco');

					res[i].tobaccoEntry = await updatedTobaccoEntry(entry);
				} else if (type === 2) {
					//console.log('Id: ' + entry._id + ' is a item');
					res[i].itemEntry = await updatedItemEntry(entry);
				} else {
					//console.log('Id: ' + entry._id + ' is a regular');
					res[i].regEntry = await updatedRegEntry(entry);
				}
			}
			people[i] = await peopleIDs(entry);
			places[i] = await placesIDs(entry);
			// console.log(people[i]);
			money[i] = await formatMoney(entry);
			dates[i] = await newDateObject(entry.Day, entry.Month, entry.Year);
			meta[i] = await makeMetaDataObject(entry, 'C_1760');
			accHold[i] = await makeAccountHolderObject(entry);
		} catch (err) {
			console.log('EntryID:' + entry.EntryID + '   ' + err);
			meta[i] = await makeMetaDataObject(entry, 'C_1760');
			accHold[i] = await makeAccountHolderObject(entry);
			if (err) {
				res[i] = err;
			} else {
				res[i] = entry.Entry;
			}

			errorCode[i] = 1;
		}
	}

	let ret: any = [];

	let testFlag = 0;
	if (testFlag === 0) {
		for (let i = 0; i < res.length; i++) {
			ret.push({
				Entry: spreadsheetObj[i].Entry,
				NewEntry: res[i],
				AccHolder: accHold[i],
				People: people[i],
				Places: places[i],
				Meta: meta[i],
				DateInfo: dates[i],
				Money: money[i],
				ErrorCode: errorCode[i],
			});
		}
	} else {
		for (let i = 0; i < res.length; i++) {
			if (errorCode[i] === 1) {
				ret.push({
					Entry: spreadsheetObj[i].Entry,
					NewEntry: res[i],
					//AccHolder: accHold[i],
					People: people[i],
					Meta: meta[i],
					//DateInfo: dates[i],
					Money: money[i],
					ErrorCode: errorCode[i],
				});
			}
		}
	}

	return ret;
	// await client.db('shoppingstories').collection('test2f').drop();
	// await client.db('shoppingstories').createCollection('test2f');
	// for (let i = 0; i < res.length; i++) {
	// 	await client
	// 		.db('shoppingstories')
	// 		.collection('test2f')
	// 		.insertOne({
	// 			_id: spreadsheetObj[i]._id,
	// 			Entry: spreadsheetObj[i].Entry,
	// 			NewEntry: res[i],
	// 			AccHolder: accHold[i],
	// 			People: people[i],
	// 			Meta: meta[i],
	// 			DateInfo: dates[i],
	// 			Money: money[i],
	// 			ErrorCode: errorCode[i],
	// 		});
	// }
}
async function formatMoney(entry: any) {
	try {
		let SL: any =
			entry.SL !== (null || '')
				? entry.SL.toString().replace(/[^0-9.]/g, '')
				: 0;
		let SS: any =
			entry.SS !== (null || '')
				? entry.SS.toString().replace(/[^0-9.]/g, '')
				: 0;
		let SD: any =
			entry.SD !== (null || '')
				? entry.SD.toString().replace(/[^0-9.]/g, '')
				: 0;
		let CL: any =
			entry.CL !== (null || '')
				? entry.CL.toString().replace(/[^0-9.]/g, '')
				: 0;
		let CS: any =
			entry.CS !== (null || '')
				? entry.CS.toString().replace(/[^0-9.]/g, '')
				: 0;
		let CD: any =
			entry.CD !== (null || '')
				? entry.CD.toString().replace(/[^0-9.]/g, '')
				: 0;

		let colony =
			entry.Colony !== (null || '' || '-')
				? entry.Colony.toString().replace(/[^a-zA-z\s]/g, '')
				: null;
		let commodity =
			entry.Commodity !== (null || '' || '-')
				? entry.Commodity.toString().replace(/[^a-zA-z\s]/g, '')
				: null;
		let quantity =
			entry.Quantity !== (null || '' || '-')
				? entry.Quantity.toString().replace(/[^0-9.]/g, '')
				: null;

		let sterling = {
			Pounds: Number(SL),
			Shilling: Number(SS),
			Pence: Number(SD),
		};
		let currency = {
			Pounds: Number(CL),
			Shilling: Number(CS),
			Pence: Number(CD),
		};
		let res = {
			Quantity: quantity,
			Commodity: commodity,
			Colony: colony,
			Sterling: sterling,
			Currency: currency,
		};

		//console.log(sterling, currency);
		return res;
	} catch (err) {
		console.log(err);
		throw 'Sterling or Currency coloumns are not formatted properly';
	}
}

async function placesIDs(entry: any) {
	let places =
		entry.Places !== (null || '' || '-') ? entry.Places.toString() : null;
	if (places === '') {
		return [];
	}
	let split = [];
	let res = [];
	if (places.includes('//')) {
		split = places.split('//');
	} else {
		split[0] = places;
	}
	for (let i = 0; i < split.length; i++) {
		let temp: any = split[i].trim().toString();
		let object = {
			Name: null,
			ID: null,
		};
		let placeID = null;
		try {
			console.log(temp);
			placeID = await PlaceModel.findOne({ $text: { $search: temp } }, {
				score: { $meta: 'textScore' },
			} as any).sort({ score: { $meta: 'textScore' } });
			placeID = placeID._id;
			console.log('found id: ' + placeID);
		} catch {
			placeID = null;
		}
		object.Name = temp;
		object.ID = placeID;
		res[i] = object;
	}
	return res;
}
async function peopleIDs(entry: any) {
	let people =
		entry.People !== (null || '' || '-') ? entry.People.toString() : null;
	//console.log(people);
	if (people === '') {
		return [];
	}
	let split = [];
	let res = [];
	if (people.includes('//')) {
		split = people.split('//');
	} else {
		split[0] = people;
	}
	for (let i = 0; i < split.length; i++) {
		let temp: any = split[i].trim().toString();

		//console.log('looking for ' + temp);
		let object = {
			Name: null,
			ID: null,
		};
		if (
			temp.toUpperCase().includes('FNU') ||
			temp.toUpperCase().includes('LNU') ||
			temp.toUpperCase().includes('CASH')
		) {
			object = {
				Name: temp,
				ID: null,
			};
		} else {
			let personID: any = '';
			try {
				console.log(temp);
				personID = await PersonModel.findOne({ $text: { $search: temp } }, {
					score: { $meta: 'textScore' },
				} as any).sort({ score: { $meta: 'textScore' } });
				personID = personID._id;
				console.log('found id: ' + personID);
			} catch {
				personID = null;
			}
			object = {
				Name: temp,
				ID: personID,
			};
		}
		res[i] = object;
		//console.log(res[i]);
	}
	//console.log(res);
	return res;
}
async function makeAccountHolderObject(entryObj: any) {
	try {
		const cursor = entryObj;
		let prefix =
			typeof cursor.Prefix === 'string'
				? cursor.Prefix.replace(/[^a-zA-z\s]/g, '')
				: '';
		let fName = cursor.AccountFirstName.replace(/[^a-zA-z\s]/g, '');
		let lName = cursor.AccountLastName.replace(/[^a-zA-z\s]/g, '');
		let suffix =
			cursor.Suffix !== null
				? cursor.Suffix.toString().replace(/[^a-zA-z\s]/g, '')
				: '';
		let profession =
			cursor.Profession !== (null || '-' || '')
				? cursor.Profession.toString().replace(/[^a-zA-z\s]/g, '')
				: '';
		let location =
			cursor.Location !== (null || '-' || '')
				? cursor.Location.toString().replace(/[^a-zA-z\s]/g, '')
				: '';
		let reference =
			cursor.Reference !== (null || '-' || '')
				? cursor.Reference.toString().replace(/[^a-zA-z\s]/g, '')
				: '';
		let debitOrCredit =
			cursor.DrCr !== (null || '-' || '') ? cursor.DrCr : 'Dr';
		if (debitOrCredit.toUpperCase() === 'DR') {
			debitOrCredit = 1;
		} else {
			debitOrCredit = 0;
		}
		let accID = null;
		let search = (prefix + ' ' + fName + ' ' + lName + ' ' + suffix).trim();
		//console.log(search);
		try {
			accID = await PersonModel.findOne(
				{ $text: { $search: search } },
				{ score: { $meta: 'textScore' } },
			).sort({ score: { $meta: 'textScore' } });
			accID = accID._id;
		} catch {
			accID = null;
		}
		//console.log(accID);
		let res = {
			Prefix: prefix,
			AccountFirstName: fName,
			AccountLastName: lName,
			Suffix: suffix,
			Profession: profession,
			Location: location,
			Reference: reference,
			DrCr: debitOrCredit,
			accHolderID: accID,
		};
		return res;
	} catch (err) {
		throw 'error making acc holder data';
	}
}
async function makeMetaDataObject(entryObj: any, ledger: any) {
	try {
		const cursor = entryObj;
		//console.log(cursor);
		let res = {
			Ledger: ledger,
			Reel: cursor.Reel,
			FolioPage: cursor.FolioPage,
			Year: cursor.Year,
			Owner: cursor.Owner,
			Store: cursor.Store,
			EntryID: cursor.EntryID.toString(),
		};
		return res;
	} catch (err) {
		throw 'cant make meta data object';
	}
}

async function newDateObject(day: any, month: any, year: any) {
	try {
		day = day.toString().replace(/[^1-9.]/g, '');
		month = month.toString().replace(/[^1-9.]/g, '');
		year = year.toString().replace(/[^0-9.]/g, '');
		let res: any = '';
		if (month == 0 || month == '') {
			month = 1;
		}
		if (day == 0 || day == '') {
			day = 1;
		}
		if (year == 0 || year == '') {
			res = null;
		} else {
			res = new Date(Number(year), Number(month - 1), Number(day));
		}
		let finalRes = {
			DateObject: res,
			Day: day,
			Month: month,
			Year: year,
		};
		return finalRes;
	} catch (err) {
		throw 'Date could not be created';
	}
}

async function calculateUnitCost(money: any, quantity: any) {
	try {
		let L = money.Pounds; //Pounds
		let S = money.Shilling; //Shilling
		let D = money.Shilling; //Pence
		let res: any = '';

		let unitPound = Math.floor(L / quantity);
		let poundLeftOver = L % quantity;
		let convertedPounds = poundLeftOver * 20 + S;

		let unitShilling = Math.floor(convertedPounds / quantity);
		let shillingLeftOver = convertedPounds % quantity;

		let unitPence = (shillingLeftOver * 12 + D) / quantity;
		res = {
			Pounds: unitPound,
			Shilling: unitShilling,
			Pence: unitPence,
		};
		return res;
	} catch (err) {
		throw 'error calculating unit cost';
	}
}
async function moneyConversion(money: any) {
	try {
		let L = 0;
		let S = 0;
		let D = 0;
		//console.log(money);
		if (!money) {
			let res2 = {
				Pounds: 0,
				Shilling: 0,
				Pence: 0,
			};
			return res2;
		}
		//money = money.toString();
		if (money.includes('d')) {
			//console.log(`just pence\n`);
			let splitCost = money.split('d');
			let currentItemCost = parseInt(splitCost[0]);
			while (currentItemCost >= 12) {
				S++;
				currentItemCost = currentItemCost - 12;
			}
			D = currentItemCost;
		} else if (money.includes('/:')) {
			//console.log(`contains just shilling\n`);
			let splitCost = money.split('/:');
			let currentItemCost = parseInt(splitCost[0]);
			while (currentItemCost >= 20) {
				L++;
				currentItemCost = currentItemCost - 20;
			}
			S = currentItemCost;
		} else if (money.includes('/')) {
			//console.log(`contains both shilling and pence\n`);
			let splitCost = money.split('/');
			let tempPence = parseInt(splitCost[1]);
			let tempShill = parseInt(splitCost[0]);
			while (tempPence >= 12) {
				tempShill++;
				tempPence = tempPence - 12;
			}
			while (tempShill >= 20) {
				L++;
				tempShill = tempShill - 20;
			}
			S = tempShill;
			D = tempPence;
		} else if (money.includes('..')) {
			//putting pounds, shilling, and pence into an array
			let splitCost = money.split('..');

			let tempPounds = parseInt(splitCost[0].trim()); //holds pounds
			let tempShill = parseInt(splitCost[1].trim()); //holds shillings
			let tempPence = parseInt(splitCost[2].trim()); //holds pence

			let tempShill2 = 0;
			let tempPence2 = 0;

			//using 1 pound, 21 shillings, and 13 pence
			tempPence2 = Math.floor(tempPence / 12); // (13 / 12) = 1
			tempPence = tempPence % 12; // (12%12) = 1 D

			tempShill2 = Math.floor((tempShill + tempPence2) / 20); //(21 + 1) / 20 = 1
			tempShill = (tempShill + tempPence2) % 20; //(21 + 1) % 20 = 2 S

			tempPounds = tempPounds + tempShill2; // 1 + 1 = 1

			L = tempPounds; // "global" variable for Pounds is set
			S = tempShill; // "global" variable for Shillings are set
			D = tempPence; // "global" variable for Pence is set
		}
		if (!L) {
			L = 0;
		}
		if (!S) {
			S = 0;
		}
		if (!D) {
			D = 0;
		}
		let res2 = {
			Pounds: L,
			Shilling: S,
			Pence: D,
		};
		return res2;
	} catch (err) {
		throw 'cant convert money';
	}
}

async function calculateTotalCostTobacco(quantity: any, money: any) {
	//will get the total currency each tobacco is sold for in tobacco transactions, finalized?
	try {
		let tobaccodivided = quantity / 100;
		let L = money.Pounds;
		let S = money.Shilling;
		let D = money.Pence;

		L = L * tobaccodivided + Math.floor((S * tobaccodivided) / 20);
		S = ((S * tobaccodivided) % 20) + Math.floor((D * tobaccodivided) / 12);
		D = (D * tobaccodivided) % 12;
		//simplify
		S = S + Math.round((L % 1) * 20);
		L = Math.floor(L);
		D = D + Math.round((S % 1) * 12);
		S = Math.floor(S);

		let res = {
			Pounds: L,
			Shilling: S,
			Pence: D,
		};
		return res;
	} catch (err) {
		throw 'cant calculate total cost of tobacco';
	}
}

async function calculateTobaccoMoney(MoneyEntry: any) {
	//finalized version
	let brokenMoney = [];
	if (MoneyEntry.includes('{')) {
		brokenMoney = MoneyEntry.trim().split('{');
		brokenMoney = await removeWhiteSpaceFromArray(brokenMoney);
	} else {
		brokenMoney = [MoneyEntry];
	}

	let res = [];
	let moneyCount = 0;
	let tobaccoSoldFor: any = [0, 0, 0];

	for (let i = 0; i < brokenMoney.length; i++) {
		console.log(brokenMoney[i]);
		let caskQuantity = 0;
		let caskCost = { Pounds: 0, Shilling: 0, Pence: 0 };
		let poundsOfTobacco = 0;
		let tobaccoRate: any = '';
		let workingString = brokenMoney[i].toUpperCase();
		let moneyName = ''; //to hold the name of what is being traded for other then currency and sterling
		if (brokenMoney[i].includes('CASK')) {
			caskQuantity = 1;
		}
		if (brokenMoney[i].includes('CURRENCY')) {
			moneyName = 'Currency';
			workingString = workingString.replace('[CURRENCY]', '').trim();
		} else if (brokenMoney[i].includes('STERLING')) {
			moneyName = 'Sterling';
			workingString = workingString.replace('[STERLING]', '').trim();
		} else if (workingString != '' && workingString.includes(']')) {
			let tempTradeItem = workingString.split('[');
			tempTradeItem = tempTradeItem[1].split(']');
			moneyName = tempTradeItem[0];
			workingString = workingString.replace('[' + moneyName + ']', '').trim();
			moneyName =
				moneyName.charAt(0).toUpperCase() + moneyName.slice(1).toLowerCase();
		}
		if (workingString.includes('&')) {
			let tempString = workingString.split('&');
			for (i = 0; i < tempString.length; i++) {
				if (tempString[i].includes('AT')) {
					let tempArray = tempString[i].split('AT');
					poundsOfTobacco = Number(tempArray[0]);
					tobaccoRate = await moneyConversion(tempArray[1].trim());
					tobaccoSoldFor = await calculateTotalCostTobacco(
						poundsOfTobacco,
						tobaccoRate,
					);
				} else if (tempString[i].includes(',')) {
					let tempArray = tempString[i].split(',');
					poundsOfTobacco = Number(tempArray[0]);
					tobaccoRate = await moneyConversion(tempArray[1].trim());
					tobaccoSoldFor = await calculateTotalCostTobacco(
						poundsOfTobacco,
						tobaccoRate,
					);
				} else if (!tempString[i].includes('CASK')) {
					poundsOfTobacco = Number(tempString[i]);
					tobaccoRate = {
						Pounds: 0,
						Shilling: 0,
						Pence: 0,
					};
					tobaccoSoldFor = {
						Pounds: 0,
						Shilling: 0,
						Pence: 0,
					};
				}
				if (tempString[i].includes('CASK')) {
					if (tempString[i].includes('FOR')) {
						workingString = tempString[i].split('CASK').shift().trim();
						let caskInfo = workingString.split('FOR');
						caskCost = await moneyConversion(caskInfo[0].trim());
						if (caskInfo[1].length > 0) {
							caskQuantity = Number(caskInfo[1]);
						}
					} else {
					}
				}
			}
		} else {
			if (workingString.includes('AT')) {
				//console.log('here');
				let tempArray = workingString.split('AT');
				//console.log(tempArray);
				poundsOfTobacco = Number(tempArray[0]);
				tobaccoRate = await moneyConversion(tempArray[1].trim());
				tobaccoSoldFor = await calculateTotalCostTobacco(
					poundsOfTobacco,
					tobaccoRate,
				);
				//console.log(tobaccoSoldFor);
			} else if (workingString.includes(',')) {
				let tempArray = workingString.split(',');
				poundsOfTobacco = Number(tempArray[0]);
				tobaccoRate = await moneyConversion(tempArray[1].trim());
				tobaccoSoldFor = await calculateTotalCostTobacco(
					poundsOfTobacco,
					tobaccoRate,
				);
			} else if (!workingString.includes('CASK')) {
				poundsOfTobacco = Number(workingString);
				tobaccoRate = {
					Pounds: 0,
					Shilling: 0,
					Pence: 0,
				};
				tobaccoSoldFor = {
					Pounds: 0,
					Shilling: 0,
					Pence: 0,
				};
			}
			if (workingString.includes('CASK')) {
				if (workingString.includes('FOR')) {
					workingString = workingString.split('CASK').shift().trim();
					let caskInfo = workingString.split('FOR');
					caskCost = await moneyConversion(caskInfo[0].trim());
					if (caskInfo[1].length > 0) {
						caskQuantity = Number(caskInfo[1]);
					}
				} else {
					caskCost = {
						Pounds: 0,
						Shilling: 0,
						Pence: 0,
					};
				}
			}
		}
		let moneyInfo = {
			moneyType: moneyName,
			tobaccoAmount: poundsOfTobacco,
			rateForTobacco: tobaccoRate,
			caskInTransaction: caskQuantity,
			tobaccoSold: tobaccoSoldFor,
			casksSoldForEach: caskCost,
		};
		if (moneyInfo.moneyType != '') {
			res[moneyCount] = moneyInfo;
			moneyCount++;
		}
	}
	return res;
}

async function tobaccoNote(string: any) {
	//nearly finalized?
	let intsb4b4 = string.toString().replace(/[\W_]+/g, ' ');
	var intsbefore = intsb4b4.split(' ');
	var ints = intsbefore.filter((el: any) => {
		return el != null && el != '' && el != 'N';
	});
	//console.log(ints);
	if (!ints[0]) {
		ints[0] = 0;
	}
	if (!ints[1]) {
		ints[1] = 0;
	}
	if (!ints[2]) {
		ints[2] = 0;
	}
	if (!ints[3]) {
		ints[3] = 0;
	}
	let parseAsJson2 = {
		NoteNum: parseInt(ints[0]),
		TotalWeight: parseInt(ints[1]),
		BarrelWeight: parseInt(ints[2]),
		TobaccoWeight: parseInt(ints[3]),
	};

	return parseAsJson2;
}

async function updatedTobaccoEntry(entryObj: any) {
	//nearly finalized
	const cursor = entryObj;
	let entry = await cursor.Entry.toString();
	let brokenEntry = await entry.split('//');
	let moneyInfo: any = [];
	let NoteInfor = [];
	let markInfo = {
		markID: null,
		markString: null,
	};
	let entryInfo = '';
	let tobaccoShavedOff = 0;
	let noteCount = 0;
	for (let i = 0; i < brokenEntry.length; i++) {
		console.log(brokenEntry[i]);
		if (brokenEntry[i].toUpperCase().includes('[MONEY]')) {
			let tempMoneyInfo: any = brokenEntry[i]
				.trim()
				.toUpperCase()
				.split('[MONEY]');
			moneyInfo = await calculateTobaccoMoney(tempMoneyInfo[1].trim());
		} else if (brokenEntry[i].includes('[TM') || brokenEntry[i].includes('{')) {
			//brokenEntry[i] = brokenEntry[i].replace("N","");
			if (brokenEntry[i].includes('TM')) {
				console.log('found TM');
				let tempMarkInfo = await brokenEntry[i].split(']');
				let tempNoteInfo = tempMarkInfo[1].trim();
				tempMarkInfo = await tempMarkInfo[0].split(':');
				markInfo.markString = tempMarkInfo[1].trim();
				tempNoteInfo = tempNoteInfo.split('{');
				for (let j = 1; j < tempNoteInfo.length; j++) {
					tempNoteInfo[j];
					NoteInfor[noteCount] = await tobaccoNote(
						tempNoteInfo[j].replace('N', ''),
					);
					noteCount++;
				}
			} else {
				let tempNoteInfo = await brokenEntry[i].split('{');
				for (let j = 1; j < tempNoteInfo.length; j++) {
					console.log('here');
					NoteInfor[noteCount] = await tobaccoNote(tempNoteInfo[j]);
					noteCount++;
				}
			}
		} else if (brokenEntry[i].toUpperCase().includes('OFF')) {
			let workingString = brokenEntry[i]
				.toUpperCase()
				.replace('OFF', '')
				.trim();
			tobaccoShavedOff += Number(workingString);
		} else {
			entryInfo += brokenEntry[i];
		}
	}
	let finishedRes = {
		Entry: entryInfo.trim(),
		Mark: markInfo,
		Notes: NoteInfor,
		Money: moneyInfo,
		tobaccoShaved: tobaccoShavedOff,
	};
	return finishedRes;
}

async function updatedItemEntry(entryObj: any) {
	//not finished
	console.log(updatedItemEntry);
	const cursor = entryObj;
	//console.log(cursor.EntryID);
	//console.log(cursor.Entry);
	let entry = cursor.Entry.toString();
	let brokenEntry = entry.split('//');
	let transactions = [];

	for (let i = 0; i < brokenEntry.length; i++) {
		let workingString = brokenEntry[i].trim();
		let mainItemString: any = '';

		let miniItems: any = [];
		let mainItems = [];
		let itemFormat = {
			perOrder: 0,
			Percentage : 0,
			itemsOrServices: [] as any[],
			itemsMentioned: [] as any[],
		};
		if (workingString.includes('[')) {
			let tempItems = [];
			let minis = workingString.split('[');
			mainItemString = minis[0];
			minis.shift();
			let itemCount = 0;
			for (let j = 0; j < minis.length; j++) {
				const regex = /]/g;
				let miniString = minis[j].replace(regex, '').trim();
				miniString = miniString.split('&');
				for (let k = 0; k < miniString.length; k++) {
					let parts = miniString[k].split(',');
					tempItems[itemCount] = {
						Quantity: Number(parts[0]),
						Qualifier: parts[1].trim(),
						Item: parts[2].trim(),
					};
					itemCount++;
				}
			}
			miniItems = tempItems;
		} else {
			miniItems.items = [];
			mainItemString = workingString;
		}

		mainItemString = mainItemString.trim().split(',');
		//console.log(mainItemString);
		let item: any = {};
		let item2: any = {};
		if (mainItemString.length > 6) {
			let itemCosts: any = await moneyConversion(mainItemString[9]);
			itemCosts = await calculateUnitCost(itemCosts, 2);
			let categories = await findCategories(mainItemString[3], workingString);
			let categories2 = await findCategories(mainItemString[7], workingString);
			item2 = {
				Quantity: Number(mainItemString[4].replace('&', '')),
				Qualifier: mainItemString[5],
				Variant: mainItemString[6].split('*'),
				Item: mainItemString[7],
				Category: categories2.Category,
				Subcategory: categories2.Subcategory,
				UnitCost: await calculateUnitCost(
					itemCosts,
					Number(mainItemString[4].replace('&', '')),
				),
				ItemCost: itemCosts,
			};
			item = {
				Quantity: Number(mainItemString[0]),
				Qualifier: mainItemString[1],
				Variant: mainItemString[2].split('*'),
				Item: mainItemString[3],
				Category: categories.Category,
				Subcategory: categories.Subcategory,
				UnitCost: await calculateUnitCost(itemCosts, Number(mainItemString[0])),
				ItemCost: itemCosts,
			};
		} else {
			try {
				let categories = await findCategories(mainItemString[3], workingString);
				item = {
					Quantity: null,
					Qualifier: mainItemString[1],
					Variant: mainItemString[2].split('*'),
					Item: mainItemString[3],
					Category: categories.Category,
					Subcategory: categories.Subcategory,
					UnitCost: await moneyConversion(mainItemString[4]),
					ItemCost: await moneyConversion(mainItemString[5]),
				};
				item2 = null;
			} catch (err) {
				throw mainItemString + ' has error: ' + err;
			}
		}
		if (mainItemString[0].includes('%')) {
			itemFormat.Percentage = 1;
			item.Quantity = Number(mainItemString[0].replace('%', ''));
		} else {
			item.Quantity = Number(mainItemString[0]);
		}

		if (mainItemString[0].toUpperCase().includes('PER')) {
			itemFormat.perOrder = 1;
			mainItemString[0] = mainItemString[0].replace(/[^0-9\.]+/g, '');
		}

		mainItems.push(item);
		mainItems.push(item2);
		itemFormat.itemsOrServices = mainItems;
		itemFormat.itemsMentioned = miniItems;

		transactions[i] = itemFormat;
	}
	//console.log(transactions);
	return transactions;
}

async function removeWhiteSpaceFromArray(array: any) {
	return array.filter((item: any) => item != ' ');
}

async function updatedRegEntry(entryObj: any) {
	const cursor = entryObj;
	let entry = cursor.Entry;
	//console.log(entry);
	
	let tmObject = {
		MarkName: null,
		MarkID: null,
	};
	let tmArray = [tmObject];
	let res = {
		Entry: '',
		TM: tmObject,
		Items: [] as any[],
	};
	let finalEntry = '';
	if (entry.includes('[')) {
		entry = entry.split('[');
		finalEntry += entry[0];
		for (let i = 1; i < entry.length; i++) {
			if (entry[i].replace(/\s+/g, '').includes('TM:')) {
				let TMstring = entry[i];
				console.log(TMstring);
				TMstring = entry[i].split(']');
				finalEntry += TMstring[1];
				TMstring = TMstring[0];
				TMstring = TMstring.split(':').pop().trim();
				console.log(`TM NAME: ${TMstring}`);
				tmObject.MarkName = TMstring;
				console.log(tmObject);
				TMstring = TMstring.trim().split(' ')[0];
				TMstring = TMstring.replace(/^0+/, '');
				console.log(TMstring);
				let tempID = null;
				try {
					tempID = await findTMid(TMstring);
				} catch (exception_var) {
					tempID = null;
				} finally {
					tmObject.MarkID = tempID;
				}
				tmArray.push(tmObject);
				
			} else {
				let itemString = entry[i];
				itemString = itemString.split(']').shift();
				console.log(itemString);
				itemString = itemString.split('&');
				for (let j = 0; j < itemString.length; j++) {
					let tempItemString = itemString[j].split(',');
					let temp = {
						Quantity: Number(tempItemString[0]),
						Qualifier: tempItemString[1],
						Item: tempItemString[0],
					};
					res.Items.push(temp);
				}
			}
		}
	}
	res.Entry = finalEntry.trim();
	return res;
}
async function findTMid(id: any) {
	const res = await TobaccoMarkModel.findOne({ TM_ID: id });
	if (res) {
		return res._id;
	} else {
		return null;
	}
}
async function findCategories(item: any, inputString: string) {
	if (!item) {
		let resMessage = `${inputString}  :no item in entry or entry inproperly formatted`;
		throw resMessage;
	}
	let res = {
		Category: null,
		Subcategory: null,
	};
	let cursor = await CategoryModel.findOne({ $text: { $search: item } });
	if (cursor != null) {
		res.Category = cursor.Category;
		res.Subcategory = cursor.Subcategory;
	}

	return res;
}
