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

const glossaryItemFields = `
fragment glossaryItemFields on  GlossaryItem {
    id
    name
    description
    origin
    use
    category
    subcategory
    qualifiers
    culturalContext
    citations
    images {
      imageKey
      name
      material
      dimensions
      date
      caption
      collectionCitation
      url
      license
    }
}
`;


export const createGlossaryItemDef = `
mutation($item: CreateGlossaryItemInput!) {
  createGlossaryItem(newGlossaryItem: $item) {
    ...glossaryItemFields
  }
}
${glossaryItemFields}
`;

export const searchGlossaryItemsDef = `
query glossaryItemsQuery($search: String, $options: FindAllLimitAndSkip) {
  rows: findGlossaryItems(search: $search, options: $options) {
    ...glossaryItemFields
  }
  count: countGlossaryItems(search: $search)
}
${glossaryItemFields}
`;

export const updateGlossaryItemDef = `
mutation($id: String!, $updates: UpdateGlossaryItemInput!) {
  updateGlossaryItem(id: $id, updatedFields: $updates) {
    ...glossaryItemFields
  }
}
${glossaryItemFields}
`;

export const deleteGlossaryItemDef = `
mutation deleteItem($id: String!) {
  deletedItem: deleteGlossaryItem(id: $id) {
    ...glossaryItemFields
  }
}
${glossaryItemFields}
`;

export const findGlossaryItemDef = `
query($id: String!) {
  item: findGlossaryItem(id: $id) {
    ...glossaryItemFields
  }
}
${glossaryItemFields}
`