import {
    useReducer,
    useContext,
    createContext,
    ReactNode,
    Dispatch,
} from 'react'
// import { Entry } from "new_types/api_types";

type GraphItemState = string | number
export type GraphAction = {
    type: 'CREATE'
    payload: GraphItemState
}

const GraphItemContext = createContext<GraphItemState>('')
const GraphItemDispatchContext = createContext<Dispatch<GraphAction>>(()=>{})

const reducer = (state: GraphItemState, action: GraphAction) => {
    console.log(state)
    switch (action.type) {
        case 'CREATE':
            return action.payload
        default:
            throw new Error(`Unknown action: ${JSON.stringify(action)}`)
    }
}

type GraphItemProviderProps = {
    children: ReactNode
    initialValue?: string
}

const GraphItemProvider = ({
                           children,
                           initialValue = ''
                       }: GraphItemProviderProps) => {
    const [state, dispatch] = useReducer(reducer, initialValue)
    return (
        <GraphItemDispatchContext.Provider value={dispatch}>
            <GraphItemContext.Provider value={state}>
                {children}
            </GraphItemContext.Provider>
        </GraphItemDispatchContext.Provider>
    )
}
export default GraphItemProvider
export const useGraphItem = () => useContext(GraphItemContext)
export const useGraphItemDispatch = () => useContext(GraphItemDispatchContext)