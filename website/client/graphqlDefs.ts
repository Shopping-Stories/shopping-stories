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
`;

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
  doc: createDocument(newDocument: $doc) {
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
  doc: updateDocument(id: $id, updatedFields: $updates) {
    ...documentFields
  }
}
${DocumentFields}
`;

export const DeleteDocumentDef = `
mutation deleteDocument($id: String!) {
  doc: deleteDocument(id: $id) {
    ...documentFields
  }
}
${DocumentFields}
`;

export const FetchPeopleQuery = `
query FetchPeople($search: String!, $options: FindAllLimitAndSkip) {
  people: findPeople(search: $search, options: $options) {
    id
    firstName
    lastName
    name: fullName
  }
}
`;

export const FetchPlacesQuery = `
query searchPlaces($search: String!, $options: FindAllLimitAndSkip) {
  places: findPlaces(search: $search, options: $options) {
    id
    name: location
  }
}
`;

export const FetchTobaccoMarks = `
query FetchMarks($search: String!, $options: FindAllLimitAndSkip) {
  marks: findTobaccoMarks(search: $search, options: $options) {
    id
    markID: id
    # markName: description
    markName: tobaccoMarkId
  }
}
`;

export const CategoryFieldsDef = `
fragment categoryFields on Category {
  id
  item
  category
  subcategory
}
`;

export const CreateCategoryDef = `
mutation createCategory($category: CreateCategoryInput!) {
  createCategory(category: $category) {
    ...categoryFields
  }
}
${CategoryFieldsDef}
`;

export const SearchCategoryDef = `
query CategoriesQuery($search: String, $options: FindAllLimitAndSkip) {
  rows: findCategories(search: $search, options: $options) {
  	...categoryFields
  }
  count: countCategories(search: $search)
}
${CategoryFieldsDef}
`;

export const UpdateCategoryDef = `
mutation updateCategory($id: String!, $updates: UpdateCategoryInput!) {
  updateCategory(id: $id, updatedFields: $updates) {
    ...categoryFields
  }
}
${CategoryFieldsDef}
`;

export const DeleteCategoryDef = `
mutation deleteCategory($id: String!) {
  deleteCategory(id: $id) {
    ...categoryFields
  }
}
${CategoryFieldsDef}
`;

export const ItemFields = `
fragment itemsFields on  Item {
  id
  item
  variants
}
`;

export const CreateItemDef = `
mutation createItem($item: CreateItemInput!) {
  createItem(item: $item) {
    ...itemsFields
  }
}
${ItemFields}
`;

export const SearchItemsDef = `
query itemsQuery($search: String, $options: FindAllLimitAndSkip) {
  rows: findItems(search: $search, options: $options) {
  	...itemsFields
  }
  count: countItems(search: $search)
}
${ItemFields}
`;

export const UpdateItemDef = `
mutation updateItem($id: String!, $updates: UpdateItemInput!) {
  updateItem(id: $id, updatedFields: $updates) {
    ...itemsFields
  }
}
${ItemFields}
`;

export const DeleteItemDef = `
mutation deleteItem($id: String!) {
  deleteItem(id: $id) {
    ...itemsFields
  }
}
${ItemFields}
`;

export const PersonFields = `
fragment personFields on Person {
  id
  account
  enslaved
  firstName
  lastName
  gender
  location
  prefix
  suffix
  profession
  professionCategory
  professionQualifier
  reference
  store
  variations
}
`;

export const CreatePersonDef = `
mutation createPerson($person: CreatePersonInput!) {
  createPerson(person: $person) {
    ...personFields
  }
}
${PersonFields}
`;

export const FetchPersonQuery = `
query FetchPerson($id: String!) {
  person: findOnePerson(id: $id) {
    ...personFields
  }
}
${PersonFields}
`;

export const SearchPeopleDef = `
query peopleQuery($search: String, $options: FindAllLimitAndSkip) {
  rows: findPeople(search: $search, options: $options) {
  	...personFields
  }
  count: countPeople(search: $search)
}
${PersonFields}
`;

export const UpdatePersonDef = `
mutation updatePerson($id: String!, $updates: UpdatePersonInput!) {
  updatePerson(id: $id, updatedFields: $updates) {
    ...personFields
  }
}
${PersonFields}
`;

export const DeletePersonDef = `
mutation deletePerson($id: String!) {
  deletePerson(id: $id) {
    ...personFields
  }
}
${PersonFields}
`;

export const PlaceFields = `
fragment placeFields on Place {
  id
  location
  alias
  descriptor
}
`;

export const FetchPlaceQuery = `
query FetchPlace($id: String!) {
  place: findOnePlace(id: $id) {
    ...placeFields
  }
}
${PlaceFields}
`;

export const CreatePlaceDef = `
mutation createPlace($place: CreatePlaceInput!) {
  createPlace(place: $place) {
    ...placeFields
  }
}
${PlaceFields}
`;

export const SearchPlacesDef = `
query placesQuery($search: String, $options: FindAllLimitAndSkip) {
  rows: findPlaces(search: $search, options: $options) {
  	...placeFields
  }
  count: countPlaces(search: $search)
}
${PlaceFields}
`;

export const UpdatePlaceDef = `
mutation updatePlace($id: String!, $updates: UpdatePlaceInput!) {
  updatePlace(id: $id, updatedFields: $updates) {
    ...placeFields
  }
}
${PlaceFields}
`;

export const DeletePlaceDef = `
mutation deletePlace($id: String!) {
  deletePlace(id: $id) {
    ...placeFields
  }
}
${PlaceFields}
`;

export const TobaccoMarkFields = `
fragment markFields on TobaccoMark {
  id
  description
  image
  netWeight
  note
  notes
  tobaccoMarkId
  warehouse
  where
  whoRepresents
  whoUnder
}
`;

export const FetchTobaccoMarkQuery = `
query FetchMark($id: String!) {
  mark: findOneTobaccoMark(id: $id) {
    ...markFields
  }
}
${TobaccoMarkFields}
`;

export const CreateTobaccoMarkDef = `
mutation createTobaccoMark($mark: CreateTobaccoMarkInput!) {
  createTobaccoMark(tobaccoMark: $mark) {
    ...markFields
  }
}
${TobaccoMarkFields}
`;

export const SearchTobaccoMarksDef = `
query tobaccoMarksQuery($search: String, $options: FindAllLimitAndSkip) {
  rows: findTobaccoMarks(search: $search, options: $options) {
    ...markFields
  }
  count: countTobaccoMarks(search: $search)
}
${TobaccoMarkFields}
`;

export const UpdateTobaccoMarkDef = `
mutation updateTobaccoMark($id: String!, $updates: UpdateTobaccoMarkInput!) {
  updateTobaccoMark(id: $id, updatedFields: $updates) {
    ...markFields
  }
}
${TobaccoMarkFields}
`;

export const DeleteTobaccoMarkDef = `
mutation deleteTobaccoMark($id: String!) {
  deleteTobaccoMark(id: $id) {
    ...markFields
  }
}
${TobaccoMarkFields}
`;

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
    populate @include(if: $populate) {
        ...personFields
    }
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
      populate @include(if: $populate) {
        ...markFields
      }
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
      populate @include(if: $populate) {
        ...markFields
      }
    }
    itemsMentioned {
      ...items
    }
  }
  people {
    name
    id
    populate @include(if: $populate) {
      ...personFields
    }
  }
  places {
    name
    id
    populate @include(if: $populate) {
      ...placeFields
    }
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
${PersonFields}
${PlaceFields}
${TobaccoMarkFields}
`;

export const SearchEntryDef = `
query entriesQuery($search: String, $options: FindAllLimitAndSkip, $populate: Boolean!) {
  rows: findEntries(search: $search, options: $options) {
  	...entryFields
  }
  count: countEntries(search: $search)
}
${EntryFields}
`;

export const AdvancedSearchEntryDef = `
query AdvancedSearch($advanced: AdvancedSearchInput, $options: FindAllLimitAndSkip, $populate: Boolean!) {
  rows: advancedFindEntries(search: $advanced, options: $options) {
    ...entryFields
  }
  count: advancedCountEntries(search: $advanced)
}
${EntryFields}
`;

export const ListUsersQuery = `
query listUsers {
  rows: listUsers
 }
`;

export const AddUserToGroupDef = `
mutation addUserToGroup($groupname: String!, $username: String!) {
  addUserToGroup(groupname: $groupname, username: $username)
}
`;

export const RemoveUserFromGroupDef = `
mutation removeUserFromGroup($groupname: String!, $username: String!) {
  removeUserFromGroup(groupname: $groupname, username: $username)
}
`;

export const EnableUserDef = `
mutation enableUser($username: String!) {
  enableUser(username: $username)
}
`;

export const DisableUserDef = `
mutation disableUser($username: String!) {
  disableUser(username: $username)
}
`;

export const ListGroupsForUserDef = `
query listGroupsForUser($username: String!) {
  oldgroups: listGroupsForUser(username: $username)
}
`;

export const ParsedEntryFields = `
fragment items on ParsedMentionedItemsObject {
	quantity
  qualifier
  item
}

fragment money on ParsedPoundsShillingsPence {
  pounds
  shilling
  pence
}

fragment entryFields on ParsedEntry {
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
    populate @include(if: $populate) {
        ...personFields
    }
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
      populate @include(if: $populate) {
        ...markFields
      }
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
      populate @include(if: $populate) {
        ...markFields
      }
    }
    itemsMentioned {
      ...items
    }
  }
  people {
    name
    id
    populate @include(if: $populate) {
      ...personFields
    }
  }
  places {
    name
    id
    populate @include(if: $populate) {
      ...placeFields
    }
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
  documentName
}
${PersonFields}
${PlaceFields}
${TobaccoMarkFields}
`;

export const SearchParsedEntryDef = `
query parsedEntriesQuery($search: String, $options: FindAllLimitAndSkip, $populate: Boolean!) {
  rows: findParsedEntries(search: $search, options: $options) {
  	...entryFields
  }
  count: countEntries(search: $search)
}
${ParsedEntryFields}
`;
