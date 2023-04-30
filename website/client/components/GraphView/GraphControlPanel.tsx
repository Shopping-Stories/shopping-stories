import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import ShoppingBasketOutlinedIcon from "@mui/icons-material/ShoppingBasketOutlined";
import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import  Chip from "@mui/material/Chip";
import  Breadcrumbs  from "@mui/material/Breadcrumbs";
import Stack from "@mui/material/Stack";

import Divider from '@mui/material/Divider';
import PersonIcon from "@mui/icons-material/Person";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import RecordVoiceOverOutlinedIcon from "@mui/icons-material/RecordVoiceOver";
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import { FormControl, FormControlLabel, ToggleButton } from "@mui/material";
import { filterHandler, GraphPredicates } from "@components/GraphView/GraphTypes";

// import FormGroup from "@mui/material/FormGroup";
// import Button from "@mui/material/Button";
// import Toolbar from "@mui/material/Toolbar";
// import RemoveIcon from "@mui/icons-material/Remove";
// import Fab from "@mui/material/Fab";
// import ArrowRightIcon from '@mui/icons-material/ArrowRight';
// import Collapse from "@mui/material/Collapse";
// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListItemText from "@mui/material/ListItemText";
// import IconButton from "@mui/material/IconButton";
// import LegendToggleIcon from "@mui/icons-material/LegendToggle";
// import Fab from "@mui/material/Fab";

export interface GraphControlPanelProps {
    makePredicates: filterHandler
    toggleNodeLabels: (visible: boolean) => void
    nodeLabels: boolean
    filter?: GraphPredicates
    dates: Array<Date>
}

const GraphControlPanel = ({makePredicates, dates, nodeLabels, toggleNodeLabels}: GraphControlPanelProps) => {
    // const [open, setOpen] = useState(false);
    // const handleClick = () => {
    //     setOpen(!open);
    // };
    const [range, setRange] = useState<number[]>([1, dates.length])
    const [checked, setChecked] = useState<boolean>(false)
    // const [labels, setLabels] = useState(()=> ['nodes', 'edges'])
    const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
        let dateRange = undefined
        if (dates[0] !== dates[range[0]-1] || dates[dates.length-1] !== dates[range[1]-1]) {
            dateRange = { start: dates[range[0] - 1], end: dates[range[1] - 1] }
        } else {
            dateRange = { start: dates[0], end: dates[dates.length-1] }
        }
        // console.log(dateRange)
        if (e.target.checked && dateRange) {
            makePredicates("date", undefined, e.target.checked, dateRange)
        }
        else {
            if (dateRange){
                // dateRange = { start: dates[range[0]-1], end: dates[range[1]-1] }
                makePredicates("date", undefined, e.target.checked, undefined)
            }
        }
        setChecked(e.target.checked)
    }
    
    // const handleLabels = (e:React.MouseEvent<HTMLElement>, newLabels: string[]) => {
    //     console.log(e.target)
    //     console.log(newLabels)
    //     setLabels(newLabels)
    //     toggleNodeLabels(!('nodes' in newLabels))
    //     // if ('edges' in newLabels)
    //     //     toggleNodeLabels(!nodeLabels)
    // }
    
    const handleRangeChange = (e:Event, newValue: number[]) => {
        if (!newValue.length)
            console.log(e?.target)
        if (checked)
            // makePredicates("date", undefined, false, undefined)
            setChecked(false)
        // if (range[0] !== newValue[0] || range[1] !== newValue[1])
        setRange(newValue);
    };
    // console.log(range, dates)
    return (
        <Box >
            <Grid
                position={"absolute"}
                sx={{
                    display: 'flex',
                    left: '15px',
                    top: '15px',
                    // alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    flexGrow: 1,
                    width: "50vw",
                    borderTop: (theme) => `1px solid ${theme.palette.divider}`
                }}
            >
                <Grid
                    item
                    xs={3}
                >
                    <Typography gutterBottom mt={1}>Node Filters</Typography>
                    {/*<Stack direction={"row"}>*/}
                    <Grid container spacing={1}>
                        <Grid item xs={2}>
                            <Checkbox
                                // checked={!!filter && !filter.nodeTypes?.person}
                                icon={<PersonOutlinedIcon />}
                                checkedIcon={
                                    <PersonOutlinedIcon color={'error'} />
                                }
                                name={'person'}
                                onChange={(e) =>
                                    makePredicates(
                                        'node',
                                        'personAccount',
                                        !e.target.checked,
                                    )
                                }
                            />
                        </Grid>
                        <Grid item xs={2}>
                        <Checkbox
                            // checked={!!filter && !filter.nodeTypes?.item}
                            icon={<ShoppingBasketOutlinedIcon />}
                            checkedIcon={
                                <ShoppingBasketOutlinedIcon
                                    color={'error'}
                                />
                            }
                            name={'item'}
                            onChange={(e) =>
                                makePredicates(
                                    'node',
                                    'item',
                                    !e.target.checked,
                                )
                            }
                        />
                        </Grid>
                        <Grid item xs={2}>
                        <Checkbox
                            // checked={!!filter && !filter.nodeTypes?.item}
                            icon={<RecordVoiceOverOutlinedIcon />}
                            checkedIcon={
                                <RecordVoiceOverOutlinedIcon
                                    color={'error'}
                                />
                            }
                            name={'item'}
                            onChange={(e) =>
                                makePredicates(
                                    'node',
                                    'mention',
                                    !e.target.checked,
                                )
                            }
                        />
                        </Grid>
                        <Grid item xs={2}>
                        <Checkbox
                            // checked={!!filter && !filter.nodeTypes?.store}
                            icon={<StorefrontOutlinedIcon />}
                            checkedIcon={
                                <StorefrontOutlinedIcon color={'error'} />
                            }
                            name={'store'}
                            onChange={(e) =>
                                makePredicates(
                                    'node',
                                    'store',
                                    !e.target.checked,
                                )
                            }
                        />
                        </Grid>
                    </Grid>
                    {/*</Stack>*/}
                </Grid>
                <Grid
                    item
                    xs={6}
                    sx={{
                        borderLeft : (theme) => `1px solid ${theme.palette.divider}`,
                        alignItems: 'center'
                    }}
                >
                    {/*<Box sx={{ml: 1}}>*/}
                        <Grid container item xs={12} justifyContent={'space-evenly'} spacing={1}>
                            <Grid item xs={12}>
                                <Typography mt={1} ml={1}>Date Range</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack direction={"row"} alignItems={'center'}>
                                {
                                    dates.length !== 0
                                        ? <>
                                            <Slider
                                                sx={{ ml: 2, mr: 2 }}
                                                size={dates.length < 25 ? "medium" : "small"}
                                                // marks={dates.map((d,i)=>({value:i,label:d.toLocaleString().split(' ')[0]}))}
                                                marks={true}
                                                value={range}
                                                min={1}
                                                max={dates.length}
                                                onChange={(e, v)=>handleRangeChange(e, v as number[])}
                                                valueLabelDisplay="auto"
                                                valueLabelFormat={x=> dates ? dates[x-1].toLocaleString().split(', ')[0] : x}
                                            />
                                            <FormControlLabel control={<Switch
                                                    checked={checked}
                                                    onChange={handleCheck}
                                                />}
                                                label="Filter by Date"/>
                                        </>
                                        : <Typography sx={{ ml: 1 }}>N/A</Typography>
                                }
                                </Stack>
                            </Grid>
                            {/*<Grid item xs={4}>*/}
                            {/*    <Switch*/}
                            {/*        checked={checked}*/}
                            {/*        onChange={handleCheck}*/}
                            {/*    />*/}
                            {/*</Grid>*/}
                        </Grid>
                    {/*</Box>*/}
                    {/*</Grid>*/}
                </Grid>
                <Grid item xs={3}
                      sx={{
                          borderLeft : (theme) => `1px solid ${theme.palette.divider}`,
                          alignItems: 'center',
                      }}
                >
                    <Stack direction={'row'} ml={1} mt={2} alignItems={'center'}>
                        <Typography gutterBottom mt={1} ml={1}></Typography>
                        {/*<ToggleButtonGroup*/}
                        {/*    value={labels}*/}
                        {/*    onChange={handleLabels}*/}
                        {/*>*/}
                        
                        {/*</ToggleButtonGroup>*/}
                        <ToggleButton
                            selected={nodeLabels}
                            value={"nodes"}
                            onChange={() => toggleNodeLabels(!nodeLabels)}
                        >
                            Node Labels
                        </ToggleButton>
                        {/*<ToggleButton*/}
                        {/*    selected={nodeLabels}*/}
                        {/*    value={"edges"}*/}
                        {/*    onChange={() => toggleNodeLabels(!nodeLabels)}*/}
                        {/*>*/}
                        {/*    Edges*/}
                        {/*</ToggleButton>*/}
                    </Stack>
                </Grid>
            </Grid>
            <Box alignSelf={"flex-end"} position={"relative"}>
                <Box position={"absolute"} bottom={"30px"} left={"30px"} alignItems={"flex-start"}>
                    <Typography sx={{mb:1}} variant={"h5"} width={"100%"}>Legend</Typography>
                    <Breadcrumbs separator={" "}  sx={{mt:1, mb:1}}>
                        <Typography>Nodes</Typography>
                        <Typography variant={"h6"}>-</Typography>
                        {/*<ArrowRightIcon />*/}
                        <Chip icon={<PersonIcon/>} label={"Person"}/>
                        <Chip icon={<StorefrontIcon/>} label={"Store"}/>
                        <Chip icon={<ShoppingBasketIcon/>} label={"Item"}/>
                        <Chip icon={<RecordVoiceOverIcon/>} label={"Mentioned"}/>
                    </Breadcrumbs>
                    {/*<Divider orientation={"vertical"} variant={"middle"} flexItem={true}/>*/}
                    {/*<Divider sx={{mt:1,mb:1}}/>*/}
                    <Breadcrumbs separator={""}>
                        <Typography sx={{mr:1}}>Links</Typography>
                        <Typography variant={"h6"}>-</Typography>
                        {/*<ArrowRightIcon/>*/}
                        <Chip icon={<ShoppingBasketIcon/>}
                              label={"Item - Person"}
                            // label={"<->"}
                              onDelete={()=>{}}
                              color={"success"}
                              deleteIcon={<PersonIcon/>}
                        />
                        <Chip icon={<ShoppingBasketIcon/>}
                              label={"Item - Store"}
                            // label={"<->"}
                              onDelete={()=>{}}
                              color={"warning"}
                              deleteIcon={<StorefrontIcon/>}
                        />
                        <Chip icon={<ShoppingBasketIcon/>}
                              label={"Item - Mentioned"}
                            // label={"<->"}
                              onDelete={()=>{}}
                              color={"secondary"}
                              deleteIcon={<RecordVoiceOverIcon/>}
                        />
                        <Chip icon={<PersonIcon/>}
                              label={"Person - Person"}
                            // label={"<->"}
                              onDelete={()=>{}}
                              color={"info"}
                              deleteIcon={<PersonIcon/>}
                        />
                        <Chip icon={<PersonIcon/>}
                              label={"Person - Mentioned"}
                            // label={"<->"}
                              onDelete={()=>{}}
                              color={"error"}
                              deleteIcon={<RecordVoiceOverIcon/>}
                        />
                    </Breadcrumbs>
                    <Divider sx={{mt:1}}/>
                </Box>
            </Box>
        </Box>
    )
}

export default GraphControlPanel