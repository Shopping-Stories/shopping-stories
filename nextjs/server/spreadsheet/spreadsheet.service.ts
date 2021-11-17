import { EntryModel } from 'server/entry/entry.schema';
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

        //console.log(spreadsheetObj[i]);

        try {
            people[i] = await peopleIDs(entry);
            places[i] = await placesIDs(entry);
            money[i] = await formatMoney(entry);
            dates[i] = await newDateObject(
                entry.Day,
                entry.Month,
                entry.Year_1,
            );
            meta[i] = await makeMetaDataObject(entry, 'C_1760');
            references[i] = await folioReferences(entry);
            accountHolder[i] = await makeAccountHolderObject(entry);
            if (entry.Entry) {
                if (type === 1) {
                    //console.log('Id: ' + entry._id + ' is a tobacco');

                    entries[i].tobaccoEntry = await updatedTobaccoEntry(
                        entry,
                        money[i],
                    );
                } else if (type === 2) {
                    //console.log('Id: ' + entry._id + ' is a item');
                    entries[i].itemEntries = await updatedItemEntry(entry);
                } else {
                    //console.log('Id: ' + entry._id + ' is a regular');
                    entries[i].regularEntry = await updatedRegEntry(entry);
                }
            }
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
    //flag set to 1 will return less data, set errorCode[i] = 1 to only return entries that error out
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
            if (errorCode[i] === 0) {
                ret.push({
                    entry: spreadsheetObj[i].Entry,
                    ...entries[i],
                    AccHolder: accountHolder[i],
                    people: people[i],
                    meta: meta[i],
                    DateInfo: dates[i],
                    money: money[i],
                    errorCode: errorCode[i],
                    errorMessage: errorMessage[i],
                });
            }
        }
    }

    return ret;
}

export async function generalSearch(searchString: string) {
    //just a general text index
    const res: any = await EntryModel.find(
        { $text: { $search: searchString } },
        { score: { $meta: 'textScore' } },
    ).sort({ score: { $meta: 'textScore' } });
    return res;
}
export async function advancedSearch(searchObj: any) {
    console.log(searchObj);
    //advanced search
    //need to pull fields supplied from the search input
    //if the field is apart of the entry text index, add it to the search string, else
    //we need to create the fields to search for the entry

    //regexes to use (?i) for case insensitivity
    //regular regex to match things such as numbers for tobacco marks

    let searchString = '';
    let indexFlag = 0;
    let temp: any = {};
    if (searchObj.people !== undefined) {
        console.log('people undefined');
        searchString += searchObj.people.toString();
    }
    if (searchObj.reel !== undefined) {
        temp['meta.reel'] = searchObj.reel.toString();
    }
    if (searchObj.storeOwner != undefined) {
        let owner = searchObj.storeOwner.toString();

        temp['meta.owner'] = { $regex: owner, $options: 'i' };
    }
    if (searchObj.folioYear != undefined) {
        let folioYear = searchObj.folioYear.toString();
        temp['meta.year'] = { $regex: folioYear };
    }
    if (searchObj.folioPage != undefined) {
        let folioPage = searchObj.folioPage.toString();
        temp['meta.folioPage'] = { $regex: folioPage };
    }
    if (searchObj.entryID != undefined) {
        let entryID = searchObj.entryID.toString();
        temp['meta.entryID'] = { $regex: entryID, $options: 'i' };
    }
    if (searchObj.accountHolderName != undefined) {
        searchString += searchObj.accountHolderName.trim().toString();
    }
    if ((searchObj.date != undefined) && (searchObj.date2 != undefined)) {
        let date = new Date(searchObj.date);
        let date2 = new Date(searchObj.date2);
        console.log(date, date2);
        temp['dateInfo.fullDate'] = { $gte: date, $lt: date2 };
    }
    if (searchObj.people != undefined) {
        searchString += searchObj.people;
    }
    if (searchObj.places != undefined) {
        searchString += searchObj.places;
    }
    if (searchObj.colony != undefined) {
        let colony = searchObj.colony;
        temp['money.colony'] = { $regex: colony, $option: 'i' };
    }
    if (searchObj.itemEntry != null) {
        let entry = searchObj.itemEntry;
        if (entry.perOrder === 1) {
            temp['itemEntries.perOrder'] = 1;
        }
        if (entry.items != undefined) {
            let entryItems = entry.items.toString();

            temp['itemEntries.itemsOrServices.item'] = { $regex: new RegExp(entryItems, 'i') };
        }
        if (entry.category != undefined) {
            temp['itemEntries.itemsOrServices.category'] = entry.category.toString();
        }
        if (entry.subcategory != undefined) {
            temp['itemEntries.itemsOrServices.subcategory'] = entry.subcategory.toString();
        }
        if (entry.variant != undefined) {
            let variantString = entry.variant.toString();
            temp['itemEntries.itemsOrServices.variants'] = { $regex: variantString, $options: 'i' };
        }
        console.log(entry);
    }
    if (searchObj.tobaccoEntry != null) {
        let entry = searchObj.tobaccoEntry;
        console.log(entry);
        if (entry.description != undefined) {
            let description = entry.description.toString();
            temp['tobaccoEntry.entry'] = { $regex: description, $options: 'i' };
        }
        if (entry.tobaccoMarkName != undefined) {
            let name = entry.tobaccoMarkName.toString();
            temp['tobaccoEntry.marks.markName'] = { $regex: name, $options: 'ix' };
        }
        if (entry.noteNumber != undefined) {
            temp['tobaccoEntry.notes.noteNum'] = entry.noteNumber;
        }
        if (entry.moneyType != undefined) {
            let money = entry.moneyType.toString();
            temp['tobaccoEntry.money.moneyType'] = { $regex: money, $options: 'ix' };
        }
    }
    if (searchObj.regularEntry != null) {
        let entry = searchObj.regularEntry;
        console.log(entry);
        if (entry.entryDescription != undefined) {
            let description = entry.entryDescription.toString();
            temp['regularEntry.entry'] = { $regex: description, $options: 'ix' };
        }
        if (entry.tobaccoMarkName != undefined) {
            let name = entry.tobaccoMarkName.toString();
            temp['regularEntry.tobaccoMarks.markName'] = { $regex: name, $options: 'ix' };
        }
    }

    console.log(searchString);
    if (searchString !== '') {
        let searchJson = {
            $search: searchString,
        };
        temp['$text'] = searchJson;
        indexFlag = 1;
    }

    console.log(temp);
    //general fields
    //fields Reel, StoreOwner, FolioYear,FolioPage,Entry ID, Account holder name (one field),
    //Date using date picker, people, places, commodity, colony

    /*for item entry forms
    per order(yes or no, 1 for yes, 0 for no), items, category, subcategory, variant
    */

    /*for tobacco entry forms
    entry discription, tobacco mark name, note number, money type
    */

    /*for regular entry
    entry discription, tobacoo mark name
    */

    //append search fields to temp like temp[tobaccoEntry.marks.markName] = "blahblah"
    let res: any = [];

    if (indexFlag === 1) {
        console.log('using index');
        res = await EntryModel.find(temp, {
            score: { $meta: 'textScore' },
        }).sort({ score: { $meta: 'textScore' } });
    } else {
        console.log('not using index');
        res = await EntryModel.find(temp);
    }

    //console.log(res);
    return res;
}
async function formatMoney(entry: any) {
    //formats money coloumns of the spreadsheets
    //L = pounds, S = shilling, D = pence
    //SL = sterling pounds, CL = colony currency pounds
    //colony, commodity, quantity coloumns are directly copied over
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
        //formatted to objects here
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
    let folios: any = entry.FolioReference.toString()
        .replace(/[-]/g, '')
        .split('//');
    let ledgers: any = entry.Ledger.toString().replace(/[-]/g, '').split('//');
    let res = {
        folioRefs: folios,
        ledgerRefs: ledgers,
    };
    return res;
}

async function placesIDs(entry: any) {
    //place coloumns is split into an array based off the token "//", from here it goes through every index of the array,
    //searches the places masterlist in the database and pulls a
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
        if(placeID === null){
            let object = {
                name: temp
          };
          res[i] = object;
        }else{
            let object = {
                name: temp,
                id : placeID
            };
            res[i] = object;
        }
        
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

        if (
            temp.toUpperCase().includes('FNU') ||
            temp.toUpperCase().includes('LNU') ||
            temp.toUpperCase().includes('CASH') || 
            temp === "" ||
            temp === " "
        ) {
            let object = {
                name: temp
                
            };
            res[i] = object;
        } else {
            let personID: any = '';
            try {
                console.log(temp);
                personID = await PersonModel.findOne(
                    { $text: { $search: temp } },
                    {
                        score: { $meta: 'textScore' },
                    } as any,
                ).sort({ score: { $meta: 'textScore' } });
                personID = personID._id;
                console.log('found id: ' + personID);
            } catch {
                personID = null;
            }
            let object = {
                name: temp,
                id: personID,
            };
            res[i] = object;
        }
        
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
        if(accID === null){
            delete res.accountHolderID;
        }
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
        day = day.toString().replace(/[^0-9.]/g, '');
        month = month.toString().replace(/[^0-9.]/g, '');
        year = year.toString().replace(/[^0-9.]/g, '');
        let res: any = null;
        if (month == 0 || month == '') {
            month = 1;
        }
        if (day == 0 || day == '') {
            day = 1;
        }
        if (year == 0 || year == '') {
            year = 1760;

        } else {
            res = new Date(Number(year), Number(month - 1), Number(day));
        }
        let finalRes = {
            fullDate: res,
            day: day && typeof day === 'string' ? parseInt(day) : day,
            month: month && typeof month === 'string' ? parseInt(month) : month,
            year: year ? parseInt(year) : year,
        };
        return finalRes;
    } catch (err) {
        throw 'Date could not be created';
    }
}

async function calculateUnitCost(money: any, quant: any) {
    try {
        let quantity = Number(quant);
        const { pounds: pounds, shilling: shilling, pence: pence } = money;

        let res: any = '';

        let unitPound = Math.floor(pounds / quantity);
        let poundLeftOver = pounds % quantity;
        let convertedPounds = poundLeftOver * 20 + shilling;

        let unitShilling = Math.floor(convertedPounds / quantity);
        let shillingLeftOver = convertedPounds % quantity;

        let unitPence = (shillingLeftOver * 12 + pence) / quantity;
        res = {
            pounds: Math.floor(unitPound),
            shilling: Math.floor(unitShilling),
            pence: Math.floor(unitPence),
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
        if (money === '') {
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

async function calculateTotalCostTobacco(quantity: any, rate: any) {
    //will get the total currency each tobacco is sold for in tobacco transactions, finalized?
    try {
        //the rate for tobacco is per 100 pounds so we divide by 100
        let tobaccoDivided = quantity / 100;
        let L = rate.pounds;
        let S = rate.shilling;
        let D = rate.pence;

        /*we start with pounds, then shilling, then pence and calculate what the quantity of tobacco times the rate is, plus
        //converting a shilling or pence upwards
        // if we have
        // rate = {
                pounds: 0
                shilling: 11
                pence : 8
        }
            with a quantity of 500, that is (11 shilling and 8 pence() per 100 pounds so (11 shilling and 8 pence) times 5

            pounds = (0 pounds * 5) + ((11 shilling * 5)/20) while dropping the left over when converting shillings to pounds
            shillings = ((11 shilling * 5) % 20) + ((8 pence * 5)/12) we take the leftovers shillings dropped from before
            and convert pence to shilling
        */
        L = L * tobaccoDivided + Math.floor((S * tobaccoDivided) / 20);
        S = ((S * tobaccoDivided) % 20) + Math.floor((D * tobaccoDivided) / 12);
        D = (D * tobaccoDivided) % 12;
        console.log(L, S, D);

        //simplify the numbers using the leftovers so 2.5 pounds =  2 pounds and 10 shilling
        //and 10.5 shillings = 10 shillings and 6 pence
        //just drop partial pence
        S = S + Math.floor((L % 1) * 20);
        L = Math.floor(L);
        D = Math.floor(D) + Math.floor((S % 1) * 12);
        S = Math.floor(S) + Math.floor(D / 12);
        D = D % 12;
        L = L + Math.floor(S / 20);
        S = S % 20;

        console.log(L, S, D);
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

async function calculateTobaccoMoney(MoneyEntry: any, colony: any, money: any) {
    //finalized version
    let brokenMoney = [];
    let colonyName = '';
    if (colony !== '') {
        colonyName =
            colony.charAt(0).toUpperCase() + colony.slice(1).toLowerCase();
    }
    console.log(money);
    if (MoneyEntry.includes('{')) {
        brokenMoney = MoneyEntry.toString().trim().split('{');
        brokenMoney = await removeWhiteSpaceFromArray(brokenMoney);
    } else {
        brokenMoney = [MoneyEntry];
    }
    console.log(brokenMoney);
    let res = [];

    let tobaccoSoldFor: any = [0, 0, 0];
    if (brokenMoney[0] === '') {
        brokenMoney.shift();
    }
    console.log(brokenMoney);
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
            workingString = workingString
                .replace('[' + moneyName + ']', '')
                .trim();
            moneyName =
                moneyName.charAt(0).toUpperCase() +
                moneyName.slice(1).toLowerCase();
        } else {
            moneyName = colonyName;
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

                    tobaccoRate = await calculateUnitCost(
                        money,
                        poundsOfTobacco,
                    );
                    tobaccoSoldFor = money;
                }
                if (tempString[i].includes('CASK')) {
                    if (tempString[i].includes('FOR')) {
                        workingString = tempString[i]
                            .split('CASK')
                            .shift()
                            .trim();
                        let caskInfo = workingString.split('FOR');
                        caskCost = await moneyConversion(caskInfo[0].trim());
                        if (caskInfo[1].length > 0) {
                            caskQuantity = Number(caskInfo[1]);
                        }
                    }
                }
            }
        } else {
            if (workingString.includes('AT')) {
                //console.log('here');
                let tempArray = workingString.split('AT');
                console.log(tempArray);
                poundsOfTobacco = Number(tempArray[0]);
                tobaccoRate = await moneyConversion(tempArray[1].trim());
                console.log();
                if (tempArray[1] === '') {
                    tobaccoSoldFor = {
                        pounds: 0,
                        shilling: 0,
                        pence: 0,
                    };
                } else {
                    tobaccoSoldFor = await calculateTotalCostTobacco(
                        poundsOfTobacco,
                        tobaccoRate,
                    );
                }

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
                console.log(money, poundsOfTobacco);
                tobaccoRate = await calculateUnitCost(money, poundsOfTobacco);
                tobaccoSoldFor = money;
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
        if(moneyInfo != null){
            res.push(moneyInfo);
        }
        //res[i] = moneyInfo;
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

async function updatedTobaccoEntry(entryObj: any, money: any) {
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
            if (cursor.Colony.toString().replace(/[^a-zA-Z]/, '') === '') {
                console.log();
                moneyInfo = await calculateTobaccoMoney(
                    tempMoneyInfo[1].trim(),
                    cursor.Colony.toString(),
                    money.sterling,
                );
            } else {
                moneyInfo = await calculateTobaccoMoney(
                    tempMoneyInfo[1].trim(),
                    cursor.Colony.toString(),
                    money.currency,
                );
            }
        } else if (
            brokenEntry[i].includes('[TM') ||
            brokenEntry[i].includes('{')
        ) {
            //brokenEntry[i] = brokenEntry[i].replace("N","");
            if (brokenEntry[i].includes('TM')) {
                console.log('found TM');

                let tempMarkInfo = await brokenEntry[i].split(']');
                let tempNoteInfo = tempMarkInfo[1].trim();
                tempMarkInfo = await tempMarkInfo[0].split(':');
                let finalMarkName = tempMarkInfo[1].trim();
                let finalMarkID = await findTMid(tempMarkInfo[1].trim());
                if(finalMarkID === null){
                    let markInfo = {
                        markName : finalMarkName
                    };
                    markArray.push(markInfo);
                }else{
                    let markInfo = {
                        markName : finalMarkName,
                        markID : finalMarkID
                    };
                    markArray.push(markInfo);
                }
                
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
            entryInfo += brokenEntry[i].replace(/[^\s*0-9a-zA-Z]/, '');
        }
    }

    let finishedRes = {
        entry: entryInfo.toString().trim(),
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
        if (brokenEntry[i].toUpperCase().includes('PER')) {
            itemFormat.perOrder = 1;
            workingString = brokenEntry[i]
                .trim()
                .replace(/\bPER ORDER\b/gi, '');
        } else {
            itemFormat.perOrder = 0;
        }
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
                    if (parts.length > 3) {
                        tempItems[itemCount] = {
                            quantity: Number(parts[0]),
                            qualifier: parts[1].trim(),
                            item: parts[parts.length - 1].trim(),
                        };
                    } else {
                        tempItems[itemCount] = {
                            quantity: Number(parts[0]),
                            qualifier: parts[1].trim(),
                            item: parts[2].trim(),
                        };
                    }

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
            let itemCosts: any = await moneyConversion(
                mainItemString[mainItemString.length - 1],
            );
            itemCosts = await calculateUnitCost(itemCosts, 2);
            let categories = await findCategories(
                mainItemString[3],
                workingString,
            );
            let categories2 = await findCategories(
                mainItemString[mainItemString.length - 3],
                workingString,
            );
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
                unitCost: await calculateUnitCost(
                    itemCosts,
                    Number(mainItemString[0]),
                ),
                itemCost: itemCosts,
            };
        } else {
            try {
                console.log(mainItemString);
                let unitCost = await moneyConversion(
                    mainItemString[mainItemString.length - 2],
                );
                let itemCost = await moneyConversion(
                    mainItemString[mainItemString.length - 1],
                );
                let categories = await findCategories(
                    mainItemString[3],
                    workingString,
                );
                console.log(categories);
                if (mainItemString[mainItemString.length - 2] === '') {
                    if (mainItemString[0] === '') {
                        unitCost = await calculateUnitCost(itemCost, 1);
                    } else {
                        unitCost = await calculateUnitCost(
                            itemCost,
                            mainItemString[0],
                        );
                    }
                } else if (
                    mainItemString[mainItemString.length - 1] === '' &&
                    mainItemString[mainItemString.length - 2] !== ''
                ) {
                    itemCost = await calculateTotalCostTobacco(
                        mainItemString[0] * 100,
                        unitCost,
                    );
                }
                item = {
                    quantity: null,
                    qualifier: mainItemString[1],
                    variants: mainItemString[2].split('*'),
                    item: mainItemString[3],
                    category: categories.category,
                    subcategory: categories.subcategory,
                    unitCost: unitCost,
                    itemCost: itemCost,
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

        mainItems.push(item);
        if(item2 !== null){
            mainItems.push(item2);
        }
        
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
                
                let TMstring = entry[i];

                TMstring = entry[i].split(']');
                finalEntry += TMstring[1];
                TMstring = TMstring[0];
                TMstring = TMstring.split(':').pop().trim();
                console.log(`TM NAME: ${TMstring}`);
                
                let finalString = TMstring;
                TMstring = TMstring.trim().split(' ')[0];
                TMstring = TMstring.replace(/^0+/, '');

                let tempID = null;
                try {
                    tempID = await findTMid(TMstring);
                } catch (exception_var) {
                    tempID = null;
                } finally {
                    if(tempID === null){
                        let tempObject = {
                            markName: finalString
                        };
                        tmArray.push(tempObject);
                    }
                    else {
                        let tempObject = {
                            markName: finalString,
                            markID : tempID
                        };
                        tmArray.push(tempObject);
                    }
                    
                }

                
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
        res.category = cursor.category;
        res.subcategory = cursor.subcategory;
    }

    return res;
}
