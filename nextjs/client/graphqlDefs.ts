export const EntryFields = `
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

const GlossaryItemFields = `
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


export const CreateGlossaryItemDef = `
mutation($item: CreateGlossaryItemInput!) {
  createGlossaryItem(newGlossaryItem: $item) {
    ...glossaryItemFields
  }
}
${GlossaryItemFields}
`;

export const FetchGlossaryItemsDef = `
query glossaryItemsQuery($search: String, $options: FindAllLimitAndSkip) {
  rows: findGlossaryItems(search: $search, options: $options) {
    ...glossaryItemFields
  }
  count: countGlossaryItems(search: $search)
}
${GlossaryItemFields}
`;

export const UpdateGlossaryItemDef = `
mutation($id: String!, $updates: UpdateGlossaryItemInput!) {
  updateGlossaryItem(id: $id, updatedFields: $updates) {
    ...glossaryItemFields
  }
}
${GlossaryItemFields}
`;

export const DeleteGlossaryItemDef = `
mutation deleteItem($id: String!) {
  deletedItem: deleteGlossaryItem(id: $id) {
    ...glossaryItemFields
  }
}
${GlossaryItemFields}
`;

export const FetchGlossaryItemDef = `
query($id: String!) {
  item: findGlossaryItem(id: $id) {
    ...glossaryItemFields
  }
}
${GlossaryItemFields}
`

export const DocumentFields = `
fragment documentFields on DocumentInfo {
  id
  name
  description
  fileKey
}
`;

export const CreateDocumentDef = `
mutation createDocument($doc: CreateDocumentInput!) {
  createDocument(newDocument: $doc) {
    ...documentFields
  }
}
${DocumentFields}
`;

export const FetchDocumentsDef = `
query fetchDocuments($search: String, $options: FindAllLimitAndSkip) {
  rows: findDocuments(search: $search, options: $options) {
  	...documentFields
  }
  count: countDocuments(search: $search)
}
${DocumentFields}
`;

export const UpdateDocumentDef = `
mutation updateDocument($id: String!, $updates: UpdateDocumentInput!) {
  updateDocument(id: $id, updatedFields: $updates) {
    ...documentFields
  }
}
${DocumentFields}
`;

export const DeleteDocumentDef = `
mutation deleteDocument($id: String!) {
  deleteDocument(id: $id) {
    ...documentFields
  }
}
${DocumentFields}
`;