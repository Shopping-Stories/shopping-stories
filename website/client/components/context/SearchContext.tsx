import {
    useReducer,
    useContext,
    createContext,
    ReactNode,
    Dispatch,
} from 'react'

type SearchState = {
    search: string,
    fuzzy: boolean,
    advanced: boolean
}
export type SearchAction =
    {
        type: 'SIMPLE' | 'FUZZY_SIMPLE' | 'ADVANCED' | 'FUZZY_ADVANCED'
        payload: string,
    }

const SearchStateContext = createContext<SearchState>({search:"", fuzzy:true, advanced:false})
const SearchDispatchContext = createContext<Dispatch<SearchAction>>(()=>{})

const reducer = (state: SearchState, action: SearchAction) => {
    console.log(state)
    console.log(action.payload)
    switch (action.type) {
        case 'SIMPLE':
            return {
                search: action.payload,
                fuzzy: false,
                advanced: false
            }
        case 'FUZZY_SIMPLE':
            return {
                search: action.payload,
                fuzzy: true,
                advanced: false
            }
        case 'ADVANCED':
            return {
                search: action.payload,
                fuzzy: false,
                advanced: true
            }
        case 'FUZZY_ADVANCED':
            return {
                search: action.payload,
                fuzzy: true,
                advanced: true
            }
        default:
            throw new Error(`Unknown action: ${JSON.stringify(action)}`)
    }
}

type SearchProviderProps = {
    children: ReactNode
    initialValue?: SearchState
}

const SearchProvider = ({
  children,
  initialValue = {search:"", fuzzy:true, advanced:false}
}: SearchProviderProps) => {
    const [state, dispatch] = useReducer(reducer, initialValue)
    return (
        <SearchDispatchContext.Provider value={dispatch}>
            <SearchStateContext.Provider value={state}>
                {children}
            </SearchStateContext.Provider>
        </SearchDispatchContext.Provider>
    )
}
//
export default SearchProvider
export const useSearch = () => useContext(SearchStateContext)
export const useSearchDispatch = () => useContext(SearchDispatchContext)