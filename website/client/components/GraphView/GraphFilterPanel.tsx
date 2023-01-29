import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import ShoppingBasketOutlinedIcon from "@mui/icons-material/ShoppingBasketOutlined";
import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import { GraphFilterPanelProps } from "@components/GraphView/GraphGui";
import { Breadcrumbs, Chip, FormControl, FormControlLabel, FormLabel } from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import Toolbar from "@mui/material/Toolbar";
import Divider from '@mui/material/Divider';
import PersonIcon from "@mui/icons-material/Person";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import RecordVoiceOverOutlinedIcon from "@mui/icons-material/RecordVoiceOver";
// import ArrowRightIcon from '@mui/icons-material/ArrowRight';
// import Collapse from "@mui/material/Collapse";
// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListItemText from "@mui/material/ListItemText";
// import IconButton from "@mui/material/IconButton";
// import LegendToggleIcon from "@mui/icons-material/LegendToggle";
// import Fab from "@mui/material/Fab";

const GraphFilterPanel = ({makePredicates, dates}: GraphFilterPanelProps) => {
    // const [open, setOpen] = useState(false);
    // const handleClick = () => {
    //     setOpen(!open);
    // };
    const [range, setRange] = useState<number[]>(dates.map(m=>m.value))
    const handleChange = (e:Event, newValue: number | number[]) => {
        console.log(e)
        setRange(newValue as number[]);
    };
    // console.log(range, dates)
    return (
        <>
            <Box
                position={"absolute"}
                sx={{
                    left: '15px',
                    top: '15px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                }}
            >
                <Toolbar>
                    {/*<Divider sx={{mb:1}} />*/}
                    <Box sx={{ alignItems: 'flex-start', flexWrap: 'wrap', display: 'flex',
                        borderTop: (theme) => `1px solid ${theme.palette.divider}`}}>
                        <FormControl >
                        {/*<Typography>Node Filters</Typography>*/}
                            <FormLabel component={"legend"}>Node Filters</FormLabel>
                            <FormGroup>
                                <Box>
                                    <FormControlLabel control={
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
                                    } label={""}/>
                                    <FormControlLabel control={
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
                                    } label={""}/>
                                    <FormControlLabel control={
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
                                    } label={""}/>
                                    <FormControlLabel control={
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
                                    } label={""}/>
                                </Box>
                            </FormGroup>
                        </FormControl>
                        <Divider
                            orientation="vertical"
                            flexItem
                            sx={{mr:2 }}
                        />
                        {
                            <FormControl>
                                <FormGroup>
                                    <Box>
                                        <FormLabel component={"legend"}>Date Range</FormLabel>
                                        <FormGroup>
                                            {/**/}
                                            {
                                                dates.length !== 0
                                                ? <Slider
                                                    sx={{ ml: 1, mr: 2 }}
                                                    marks={dates}
                                                    value={range}
                                                    onChange={handleChange}
                                                />
                                                : <Typography sx={{ ml: 1 }}>N/A</Typography>
                                            }
                                        </FormGroup>
                                    </Box>
                                </FormGroup>
                            </FormControl>
                        }
                    </Box>
                </Toolbar>
            </Box>
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
                              onDelete={()=>{}}
                              color={"success"}
                              deleteIcon={<PersonIcon/>}
                        />
                        <Chip icon={<ShoppingBasketIcon/>}
                              label={"Item - Store"}
                              onDelete={()=>{}}
                              color={"warning"}
                              deleteIcon={<StorefrontIcon/>}
                        />
                        <Chip icon={<ShoppingBasketIcon/>}
                              label={"Item - Mentioned"}
                              onDelete={()=>{}}
                              color={"secondary"}
                              deleteIcon={<RecordVoiceOverIcon/>}
                        />
                        <Chip icon={<PersonIcon/>}
                              label={"Person - Person"}
                              onDelete={()=>{}}
                              color={"info"}
                              deleteIcon={<PersonIcon/>}
                        />
                        <Chip icon={<PersonIcon/>}
                              label={"Person - Mentioned"}
                              onDelete={()=>{}}
                              color={"error"}
                              deleteIcon={<RecordVoiceOverIcon/>}
                        />
                        {/*<Chip icon={<ShoppingBasketOutlinedIcon/>}*/}
                        {/*      label={"Mention-to-Person"}*/}
                        {/*      onDelete={()=>{}}*/}
                        {/*      color={"primary"}*/}
                        {/*      deleteIcon={<PersonIcon/>}*/}
                        {/*/>*/}
                    </Breadcrumbs>
                    <Divider sx={{mt:1,}}/>
                </Box>
            </Box>
        </>
    )
}

export default GraphFilterPanel