import { CategoryModel } from './categories.schema';
import { PersonModel } from './person.schema';
import { TobaccoMarkModel } from './tobaccoMarks.schema';

export default async function parseSpreadsheetObj(spreadsheetObj: any[]) {
	let res = [];
	let meta = [];
	let accHold = [];
	let errorCode = [];
	let dates = [];
	let money = [];
	let people = [];
	for (let i = 0; i < spreadsheetObj.length; i++) {
		const entry = spreadsheetObj[i];
		errorCode[i] = 0;
		let type = Number(entry.EntryType);
		console.log(type);
		try {
			if (entry.Entry) {
				if (type === 1) {
					console.log('Id: ' + entry._id + ' is a tobacco');
					res[i] = await updatedTobaccoEntry(entry);
				} else if (type === 2) {
					console.log('Id: ' + entry._id + ' is a item');
					res[i] = await updatedItemEntry(entry);
				} else {
					console.log('Id: ' + entry._id + ' is a regular');
					res[i] = await updatedRegEntry(entry);
				}
			}
			people[i] = await peopleIDs(entry);
			console.log(people[i]);
			money[i] = await formatMoney(entry);
			dates[i] = await newDateObject(entry.Day, entry.Month, entry.Year);
			meta[i] = await makeMetaDataObject(entry, 'C_1760');
			accHold[i] = await makeAccountHolderObject(entry);
		} catch (err) {
			meta[i] = await makeMetaDataObject(entry, 'C_1760');
			accHold[i] = await makeAccountHolderObject(entry);
			if (err) {
				res[i] = err;
			} else {
				res[i] = entry.Entry;
			}

			errorCode[i] = 1;
			//throw err;
		}
	}
	console.log(money, res, accHold, people, meta, dates)

	let ret: any = [];
	for (let i = 0; i < res.length; i++) {
		ret.push({
			Entry: spreadsheetObj[i].Entry,
			NewEntry: res[i],
			AccHolder: accHold[i],
			People: people[i],
			Meta: meta[i],
			DateInfo: dates[i],
			Money: money[i],
			ErrorCode: errorCode[i],
		});
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
		let SL = entry.SL.replace(/[^0-9.]/g, '');
		let SS = entry.SS.replace(/[^0-9.]/g, '');
		let SD = entry.SD.replace(/[^0-9.]/g, '');
		let CL = entry.CL.replace(/[^0-9.]/g, '');
		let CS = entry.CS.replace(/[^0-9.]/g, '');
		let CD = entry.CD.replace(/[^0-9.]/g, '');
		let colony = entry.Colony.replace(/[^a-zA-z\s]/g, '');
		let commodity = entry.Commodity.replace(/[^a-zA-z\s]/g, '');
		let quantity = entry.Quantity.replace(/[^0-9.]/g, '');
		if (commodity === '') {
			commodity = null;
			quantity = null;
		}

		if (colony === '') {
			colony = null;
		}
		if (SL === '') {
			SL = 0;
		}
		if (SS === '') {
			SS = 0;
		}
		if (SD === '') {
			SD = 0;
		}
		if (CL === '') {
			CL = 0;
		}
		if (CS === '') {
			CS = 0;
		}
		if (CD === '') {
			CD = 0;
		}
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
async function peopleIDs(entry: any) {
	let people = entry.People;
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
		let temp = split[i].trim();

		console.log('looking for ' + temp);
		let object = {
			Name: null,
			ID: null,
		};
		if (temp.toUpperCase.includes('FNU' || 'LNU' || 'CASH')) {
			object = {
				Name: temp,
				ID: null,
			};
		} else {
			let personID: any = '';
			try {
				console.log('trying to find');
				personID = await PersonModel.findOne({ $text: { $search: temp } }, {
					score: { $meta: 'textScore' },
				} as any);
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
	console.log(res);
	return res;
}
async function makeAccountHolderObject(entryObj: any) {
	const cursor = entryObj;
	let prefix =
		typeof cursor.Prefix === 'string'
			? cursor.Prefix.replace(/[^a-zA-z\s]/g, '')
			: cursor.Prefix;
	let fName = cursor.AccountFirstName.replace(/[^a-zA-z\s]/g, '');
	let lName = cursor.AccountLastName.replace(/[^a-zA-z\s]/g, '');
	let suffix = cursor.Suffix.replace(/[^a-zA-z\s]/g, '');
	let profession = cursor.Profession.replace(/[^a-zA-z\s]/g, '');
	let location = cursor.Location.replace(/[^a-zA-z\s]/g, '');
	let reference = cursor.Reference.replace(/[^a-zA-z\s]/g, '');
	let debitOrCredit = cursor.DrCr;
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
		);
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
}
async function makeMetaDataObject(entryObj: any, ledger: any) {
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
}

async function newDateObject(day: any, month: any, year: any) {
	try {
		day = day.replace(/[^1-9.]/g, '');
		month = month.replace(/[^1-9.]/g, '');
		year = year.replace(/[^0-9.]/g, '');
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
}
async function moneyConversion(money: any) {
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
}

async function calculateTotalCostTobacco(quantity: any, money: any) {
	//will get the total currency each tobacco is sold for in tobacco transactions, finalized?

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
		} else if (workingString != '') {
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
				let tempArray = workingString.split('AT');
				poundsOfTobacco = Number(tempArray[0]);
				tobaccoRate = await moneyConversion(tempArray[1].trim());
				tobaccoSoldFor = await calculateTotalCostTobacco(
					poundsOfTobacco,
					tobaccoRate,
				);
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
	let entry = await cursor.Entry;
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
		if (brokenEntry[i].toUpperCase().includes('[MONEY]')) {
			let tempMoneyInfo: any = brokenEntry[i]
				.trim()
				.toUpperCase()
				.split('[MONEY]');
			moneyInfo = await calculateTobaccoMoney(tempMoneyInfo[1].trim());
		} else if (brokenEntry[i].includes('[TM') || brokenEntry[i].includes('{')) {
			//brokenEntry[i] = brokenEntry[i].replace("N","");
			if (brokenEntry[i].includes('TM')) {
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
	const cursor = entryObj;
	let entry = cursor.Entry;
	let brokenEntry = entry.split('//');
	let transactions = [];

	for (let i = 0; i < brokenEntry.length; i++) {
		let workingString = brokenEntry[i].trim();
		let mainItemString: any = '';

		let miniItems: any = [];
		let mainItems = [];
		let itemFormat = {
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
			let categories = await findCategories(mainItemString[3]);
			let categories2 = await findCategories(mainItemString[7]);
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
				perOrder: 0,
				Percentage: 0,
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
			let categories = await findCategories(mainItemString[3]);
			item = {
				perOrder: 0,
				Percentage: 0,
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
		}

		if (mainItemString[0].toUpperCase().includes('PER')) {
			item.perOrder = 1;
			mainItemString[0] = mainItemString[0].replace(/[^0-9\.]+/g, '');
		}
		if (mainItemString[0].includes('%')) {
			item.Percentage = 1;
			item.Quantity = Number(mainItemString[0].replace('%', ''));
		} else {
			item.Quantity = Number(mainItemString[0]);
		}
		mainItems.push(item);
		mainItems.push(item2);
		itemFormat.itemsOrServices = mainItems;
		itemFormat.itemsMentioned = miniItems;

		transactions[i] = itemFormat;
	}
	return transactions;
}

async function removeWhiteSpaceFromArray(array: any) {
	return array.filter((item: any) => item != ' ');
}

async function updatedRegEntry(entryObj: any) {
	const cursor = entryObj;
	let entry = cursor.Entry;
	console.log(entry);
	let tmCount = 0;
	let tmObject = [
		{
			MarkName: '',
			MarkID: null,
		},
	];
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
				TMstring = entry[i].split(']');
				finalEntry += TMstring[1];
				TMstring = TMstring[0];
				TMstring = TMstring.split(':').pop().trim();
				tmObject[tmCount].MarkName = TMstring;
				TMstring = TMstring.trim().split(' ')[0];
				TMstring = TMstring.replace(/^0+/, '');
				let tempID = null;
				try {
					tempID = await findTMid(TMstring);
				} catch (exception_var) {
					tempID = null;
				} finally {
					tmObject[tmCount].MarkID = tempID;
				}
				tmCount++;
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
async function findCategories(item: any) {
	if (!item) {
		throw 'no item in entry or entry inproperly formatted';
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