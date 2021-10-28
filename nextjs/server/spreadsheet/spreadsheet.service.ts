import { CategoryModel } from '../category/category.schema';
import { PersonModel } from '../person/person.schema';
import { PlaceModel } from '../place/place.schema';
import { TobaccoMarkModel } from '../tobaccoMark/tobaccoMark.schema';

export default async function parseSpreadsheetObj(spreadsheetObj: any[]) {
	let entries = [];
	let meta = [];
	let accountHolder = [];
	let errorCode = [];
	let errorMessage = [];
	let dates = [];
	let money = [];
	let people = [];
	let places = [];
	let references = [];
	for (let i = 0; i < spreadsheetObj.length; i++) {
		const entry = spreadsheetObj[i];
		errorCode[i] = 0;
		errorMessage[i] = null;
		entries[i] = {
			tobaccoEntry: null,
			itemEntries: null,
			regularEntry: null,
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

					entries[i].tobaccoEntry = await updatedTobaccoEntry(entry);
				} else if (type === 2) {
					//console.log('Id: ' + entry._id + ' is a item');
					entries[i].itemEntries = await updatedItemEntry(entry);
				} else {
					//console.log('Id: ' + entry._id + ' is a regular');
					entries[i].regularEntry = await updatedRegEntry(entry);
				}
			}
			people[i] = await peopleIDs(entry);
			places[i] = await placesIDs(entry);
			money[i] = await formatMoney(entry);
			dates[i] = await newDateObject(entry.Day, entry.Month, entry.Year);
			meta[i] = await makeMetaDataObject(entry, 'C_1760');
			references[i] = await folioReferences(entry);
			accountHolder[i] = await makeAccountHolderObject(entry);
		} catch (err) {
			console.log('EntryID:' + entry.EntryID + '   ' + err);
			meta[i] = await makeMetaDataObject(entry, 'C_1760');
			accountHolder[i] = await makeAccountHolderObject(entry);
			if (err) {
				errorMessage[i] = err;
			} else {
				entries[i] = entry.Entry;
			}
			errorCode[i] = 1;
		}
	}

	let ret: any = [];

	let testFlag = 0;
	if (testFlag === 0) {
		for (let i = 0; i < entries.length; i++) {
			ret.push({
				entry: spreadsheetObj[i].Entry,
				...entries[i],
				...references[i],
				accountHolder: accountHolder[i],
				people: people[i],
				places: places[i],
				meta: meta[i],
				dateInfo: dates[i],
				money: money[i],
				errorCode: errorCode[i],
				errorMessage: errorMessage[i],
			});
		}
	} else {
		for (let i = 0; i < entries.length; i++) {
			if (errorCode[i] === 1) {
				ret.push({
					entry: spreadsheetObj[i].Entry,
					...entries[i],
					//AccHolder: accHold[i],
					people: people[i],
					meta: meta[i],
					//DateInfo: dates[i],
					money: money[i],
					errorCode: errorCode[i],
					errorMessage: errorMessage[i],
				});
			}
		}
	}

	return ret;
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
			pounds: Number(SL),
			shilling: Number(SS),
			pence: Number(SD),
		};
		let currency = {
			pounds: Number(CL),
			shilling: Number(CS),
			pence: Number(CD),
		};
		let res = {
			quantity,
			commodity,
			colony,
			sterling,
			currency,
		};

		return res;
	} catch (err) {
		console.log(err);
		throw 'Sterling or Currency coloumns are not formatted properly';
	}
}

async function folioReferences(entry: any) {
	let folios: any = entry.FolioReference.toString().split('//');
	let ledgers: any = entry.Ledger.toString().split('//');
	let res = {
		folioRefs: folios,
		ledgerRefs: ledgers,
	};
	return res;
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
			name: null,
			id: null,
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
		object.name = temp;
		object.id = placeID;
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
			name: null,
			id: null,
		};
		if (
			temp.toUpperCase().includes('FNU') ||
			temp.toUpperCase().includes('LNU') ||
			temp.toUpperCase().includes('CASH')
		) {
			object = {
				name: temp,
				id: null,
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
				name: temp,
				id: personID,
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
			prefix,
			accountFirstName: fName,
			accountLastName: lName,
			suffix: suffix,
			profession,
			location,
			reference,
			debitOrCredit,
			accountHolderID: accID,
		};
		return res;
	} catch (err) {
		throw 'error making account holder data';
	}
}
async function makeMetaDataObject(entryObj: any, ledger: any) {
	try {
		const cursor = entryObj;
		let yearNum: any = cursor.Year.toString();
		//console.log(cursor);
		if (cursor.Year.includes('/')) {
			yearNum = cursor.Year.split('/');
			yearNum = yearNum[0].toString();
		}
		let res = {
			ledger: ledger.toString(),
			reel: cursor.Reel.toString(),
			folioPage: cursor.FolioPage.toString(),
			year: yearNum,
			owner: cursor.Owner.toString(),
			store: cursor.Store.toString(),
			entryID: cursor.EntryID.toString(),
			comments: cursor.Final.toString(),
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
			fullDate: res,
			day: day && typeof day === 'string' ? parseInt(day) : day,
			month: month && typeof month === 'string' ? parseInt(month) : month,
			year: year ? year.toString() : year,
		};
		return finalRes;
	} catch (err) {
		throw 'Date could not be created';
	}
}

async function calculateUnitCost(money: any, quantity: any) {
	try {
		const { Pounds: pounds, Shilling: shilling, Pence: pence } = money;

		let res: any = '';

		let unitPound = Math.floor(pounds / quantity);
		let poundLeftOver = pounds % quantity;
		let convertedPounds = poundLeftOver * 20 + shilling;

		let unitShilling = Math.floor(convertedPounds / quantity);
		let shillingLeftOver = convertedPounds % quantity;

		let unitPence = (shillingLeftOver * 12 + pence) / quantity;
		res = {
			pounds: unitPound,
			shilling: unitShilling,
			pence: unitPence,
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
			return {
				pounds: 0,
				shilling: 0,
				pence: 0,
			};
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
		return {
			pounds: L,
			shilling: S,
			pence: D,
		};
	} catch (err) {
		throw "can't convert money";
	}
}

async function calculateTotalCostTobacco(quantity: any, money: any) {
	//will get the total currency each tobacco is sold for in tobacco transactions, finalized?
	try {
		let tobaccoDivided = quantity / 100;
		let L = money.Pounds;
		let S = money.Shilling;
		let D = money.Pence;

		L = L * tobaccoDivided + Math.floor((S * tobaccoDivided) / 20);
		S = ((S * tobaccoDivided) % 20) + Math.floor((D * tobaccoDivided) / 12);
		D = (D * tobaccoDivided) % 12;
		//simplify
		S = S + Math.round((L % 1) * 20);
		L = Math.floor(L);
		D = D + Math.round((S % 1) * 12);
		S = Math.floor(S);

		let res = {
			pounds: L,
			shilling: S,
			pence: D,
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
		let caskCost = { pounds: 0, shilling: 0, pence: 0 };
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
						pounds: 0,
						shilling: 0,
						pence: 0,
					};
					tobaccoSoldFor = {
						pounds: 0,
						shilling: 0,
						pence: 0,
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
					pounds: 0,
					shilling: 0,
					pence: 0,
				};
				tobaccoSoldFor = {
					pounds: 0,
					shilling: 0,
					pence: 0,
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
						pounds: 0,
						shilling: 0,
						pence: 0,
					};
				}
			}
		}
		let moneyInfo = {
			moneyType: moneyName,
			tobaccoAmount: poundsOfTobacco,
			rateForTobacco: tobaccoRate,
			casksInTransaction: caskQuantity,
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
		noteNum: parseInt(ints[0]),
		totalWeight: parseInt(ints[1]),
		barrelWeight: parseInt(ints[2]),
		tobaccoWeight: parseInt(ints[3]),
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
	let markArray = [];
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
				let markInfo = {
					markID: null,
					markName: null,
				};
				let tempMarkInfo = await brokenEntry[i].split(']');
				let tempNoteInfo = tempMarkInfo[1].trim();
				tempMarkInfo = await tempMarkInfo[0].split(':');
				markInfo.markName = tempMarkInfo[1].trim();
				markInfo.markID = await findTMid(tempMarkInfo[1].trim());
				markArray.push(markInfo);
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
		entry: entryInfo.trim(),
		marks: markArray,
		notes: NoteInfor,
		money: moneyInfo,
		tobaccoShaved: tobaccoShavedOff,
	};
	return finishedRes;
}

async function updatedItemEntry(entryObj: any) {
	//not finished
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
			percentage: 0,
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
						quantity: Number(parts[0]),
						qualifier: parts[1].trim(),
						item: parts[2].trim(),
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
				quantity: Number(mainItemString[4].replace('&', '')),
				qualifier: mainItemString[5],
				variants: mainItemString[6].split('*'),
				item: mainItemString[7],
				category: categories2.category,
				subcategory: categories2.subcategory,
				unitCost: await calculateUnitCost(
					itemCosts,
					Number(mainItemString[4].replace('&', '')),
				),
				itemCost: itemCosts,
			};
			item = {
				quantity: Number(mainItemString[0]),
				qualifier: mainItemString[1],
				variants: mainItemString[2].split('*'),
				item: mainItemString[3],
				category: categories.category,
				subcategory: categories.subcategory,
				unitCost: await calculateUnitCost(itemCosts, Number(mainItemString[0])),
				itemCost: itemCosts,
			};
		} else {
			try {
				let categories = await findCategories(mainItemString[3], workingString);
				item = {
					quantity: null,
					qualifier: mainItemString[1],
					variants: mainItemString[2].split('*'),
					item: mainItemString[3],
					category: categories.category,
					subcategory: categories.subcategory,
					unitCost: await moneyConversion(mainItemString[4]),
					itemCost: await moneyConversion(mainItemString[5]),
				};
				item2 = null;
			} catch (err) {
				throw mainItemString + ' has error: ' + err;
			}
		}
		if (mainItemString[0].includes('%')) {
			itemFormat.percentage = 1;
			item.quantity = Number(mainItemString[0].replace('%', ''));
		} else {
			item.quantity = Number(mainItemString[0]);
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
	let entry = cursor.Entry.toString();
	//console.log(entry);
	let tmArray: any = [];
	let res = {
		entry: '',
		tobaccoMarks: [] as any[],
		itemsMentioned: [] as any[],
	};
	let finalEntry = '';
	if (entry.includes('[')) {
		entry = entry.split('[');
		finalEntry += entry[0];
		for (let i = 1; i < entry.length; i++) {
			if (entry[i].replace(/\s+/g, '').includes('TM:')) {
				let tempObject = {
					markName: null,
					markID: null,
				};
				let TMstring = entry[i];

				TMstring = entry[i].split(']');
				finalEntry += TMstring[1];
				TMstring = TMstring[0];
				TMstring = TMstring.split(':').pop().trim();
				console.log(`TM NAME: ${TMstring}`);
				tempObject.markName = TMstring;

				TMstring = TMstring.trim().split(' ')[0];
				TMstring = TMstring.replace(/^0+/, '');

				let tempID = null;
				try {
					tempID = await findTMid(TMstring);
				} catch (exception_var) {
					tempID = null;
				} finally {
					tempObject.markID = tempID;
				}

				tmArray.push(tempObject);
			} else {
				let itemString = entry[i];
				itemString = itemString.split(']').shift();
				console.log(itemString);
				itemString = itemString.split('&');
				for (let j = 0; j < itemString.length; j++) {
					let tempItemString = itemString[j].split(',');
					let temp = {
						quantity: Number(tempItemString[0]),
						qualifier: tempItemString[1],
						item: tempItemString[0],
					};
					res.itemsMentioned.push(temp);
				}
			}
		}
	} else {
		finalEntry = entry;
	}
	res.tobaccoMarks = tmArray;
	res.entry = finalEntry.trim();
	return res;
}
async function findTMid(id: any) {
	let temp: any = id.trim().split(' ');
	temp = temp[0];
	temp = temp.replace(/\D|^0+/g, '');
	console.log(temp);
	const res = await TobaccoMarkModel.findOne({ tobaccoMarkId: temp });
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
		category: null,
		subcategory: null,
	};
	let cursor = await CategoryModel.findOne({ $text: { $search: item } });
	if (cursor != null) {
		res.category = cursor.Category;
		res.subcategory = cursor.Subcategory;
	}

	return res;
}
