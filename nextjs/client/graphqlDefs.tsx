export const entryFields = `
fragment items on MentionedItemsObject {
	quantity
  qualifier
  item
}

fragment money on PoundsShillingsPence {
  pounds
  shilling
  pence
}

fragment entryFields on Entry {
  id
  accountHolder {
    accountFirstName
    accountLastName
    prefix
    suffix
    profession
    location
    reference
    debitOrCredit
    accountHolderID
  }
  meta {
    ledger
    reel
    owner
    store
    year
    folioPage
    entryID
    comments
  }
  dateInfo {
    day
    month
    year
    fullDate
  }
  folioRefs
  ledgerRefs
  itemEntries {
    perOrder
    percentage
    itemsOrServices {
      quantity
      qualifier
      variants
      item
      category
      subcategory
      unitCost {
        ...money
      }
      itemCost {
        ...money
      }
    }
    itemsMentioned {
      ...items
    }
  }
  tobaccoEntry {
    entry
    marks {
      markID
      markName
    }
    notes {
      noteNum
      totalWeight
      barrelWeight
      tobaccoWeight
    }
    money {
      moneyType
      tobaccoAmount
      rateForTobacco {
        ...money
      }
      casksInTransaction
      tobaccoSold{
        ...money
      }
      casksSoldForEach{
        ...money
      }
    }
    tobaccoShaved
  }
  regularEntry {
    entry
    tobaccoMarks {
      markID
      markName
    }
    itemsMentioned {
      ...items
    }
  }
  people {
    name
    id
  }
  places {
    name
    id
  }
  entry
  money {
    commodity
    colony
    quantity
    currency {
      ...money
    }
    sterling {
      ...money
    }
  }
}
`;