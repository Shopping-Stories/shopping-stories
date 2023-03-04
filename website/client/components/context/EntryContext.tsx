import {
    useReducer,
    useContext,
    createContext,
    ReactNode,
    Dispatch,
} from 'react'
import { Entry, ParserOutput } from "new_types/api_types";

type EntryState = Entry
export type EntryAction = {
    type: 'CREATE'
    payload: Entry
}

const EntryStateContext = createContext<EntryState>({})
const EntryDispatchContext = createContext<Dispatch<EntryAction>>(()=>{})

const reducer = (state: EntryState, action: EntryAction) => {
    console.log(state)
    switch (action.type) {
        case 'CREATE':
            return action.payload
        default:
            throw new Error(`Unknown action: ${JSON.stringify(action)}`)
    }
}

type EntryProviderProps = {
    children: ReactNode
    initialValue?: Entry
}

const EntryProvider = ({
    children,
    initialValue = {}
}: EntryProviderProps) => {
    const [state, dispatch] = useReducer(reducer, initialValue)
    return (
        <EntryDispatchContext.Provider value={dispatch}>
            <EntryStateContext.Provider value={state}>
                {children}
            </EntryStateContext.Provider>
        </EntryDispatchContext.Provider>
    )
}
export default EntryProvider
export const useEntry = () => useContext(EntryStateContext)
export const useEntryDispatch = () => useContext(EntryDispatchContext)