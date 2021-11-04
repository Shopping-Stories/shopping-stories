import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid } from '@material-ui/core';
import { Title } from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function VerticalTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 224 }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider' }}
      >
        <Tab label="About History Revealed" {...a11yProps(0)} />
        <Tab label="About the Project" {...a11yProps(1)} />
        <Tab label="The Transcription and Database Process" {...a11yProps(2)} />
        <Tab label="Ledger Basics" {...a11yProps(3)} />
        <Tab label="Acknowledgements" {...a11yProps(4)} />
      </Tabs>
      <TabPanel value={value} index={0}>
          About History Reveled
          <Grid
				container
				spacing={0}
				direction="column"
				alignItems="center"
				justifyContent="center"
				style={{ minHeight: '50vh' }}
			>
				<Box
					sx={{
						width: '60%',
						backgroundColor: 'primary.main',
						textAlign: 'center',
						// opacity: [0.9, 0.8, 0.7],
						// '&:hover': {
						// backgroundColor: 'primary.main',
						// opacity: [0.9, 0.8, 0.7],
						// },
					}}
				>
					<Typography>
                        <Title>About History Revealed</Title>
						<p>
                        History Revealed, Inc. is an independent, 501(c)(3) non-profit, historical research organization.
						</p>
						<p>
                        We focus on learning more about lesser-known individuals and groups of people from the past with a 
                        particular emphasis on individuals and communities whose stories were not historically told. 
                        Using historic documents, artifacts, buildings, and the landscape, we connect the dots of information 
                        in search of the larger story of these individuals and groups.
						</p>
                        <p> 
                        Because accessibility of our research is important to us, we engage in crowdsourcing to aid us and 
                        the public in making research discoveries. We create digital presentations and publications that 
                        showcase not only the data but also provide historical context and connections.
                        </p>
                        <p>We actively seek partnerships with universities, museums, and other historical organizations 
                            to exchange ideas, suggest solutions, and implement strategies to further advance the 
                            understanding of historically forgotten individuals and communities relating to the American experience.
                        </p>
                        </Typography>
				</Box>
			</Grid>
      </TabPanel>
      <TabPanel value={value} index={1}>
          About Shopping Stories
          <Grid
				container
				spacing={0}
				direction="column"
				alignItems="center"
				justifyContent="center"
				style={{ minHeight: '50vh' }}
			>
				<Box
					sx={{
						width: '60%',
						backgroundColor: 'primary.main',
						textAlign: 'center',
						// opacity: [0.9, 0.8, 0.7],
						// '&:hover': {
						// backgroundColor: 'primary.main',
						// opacity: [0.9, 0.8, 0.7],
						// },
					}}
				>
					<Typography>
                        <Title>The Shopping Stories Project</Title>
						<p>
                        Eighteenth-century ledgers detail tabular data: recording purchases, account holders, and payments. 
                        These transactions are very different from the typical prose of a letter or diary entry, however, 
                        they include as much, if not more, significant information to assist in the understanding of the past given 
                        they describe numerous people, places, objects, economies, politics, religion, etc., all from a single community. 
                        Ledgers especially reveal insights into the lives of less recognized members of a community, like women and the enslaved, 
                        through their accounts and purchases by and on behalf of them by others.
						</p>
						<p>
                        Without even connecting the ledgers to other documents, much can be learned 
                        from the accounts. Mrs. Elizabeth Connell made twelve trips to the store beginning 
                        on October 4, 1760, through December 17, 1761. With an individual account, she had money 
                        of her own, and the use of the title ‘Mrs.’ indicates she was most likely a widow. Connell’s account 
                        shows she had at least two children – an unnamed daughter and a son, Giles – both who made purchases against her account. 
                        She was responsible for people and property, as on June 25, 1761, she paid the sheriff and parish collector tithes 
                        and levies for two people and at least 400 acres of land. While she was not responsible for paying a tithe on herself, 
                        the two individuals may have either been enslaved or a white male over the age of 16 years (her son?). On this same day, 
                        she paid her account in tobacco and purchased a reap hook and nacconies (an Indian striped calico usually associated with 
                        clothing of the enslaved), thus it is likely she was responsible for at least one enslaved individual who farmed the tobacco. 
                        Connell was connected to at least three men – Giles, John Ford, and Sampson Turley – as they appeared as either a purchaser 
                        on her account (Giles purchased hats, Ford purchased buttons) or someone Connell paid (Turley with tobacco). 
                        She owned a firearm as she purchased shot (as did her son). The remainder of her purchases were typical of most 
                        customers to the store with a focus on materials to make clothing (fabrics, thread, buttons, pins, and needles); 
                        although, she also purchased some kitchen accoutrements, shoes, hats, and a large blanket.
						</p>
                        <p> 
                            To date, most research using ledgers (whether it be for a store, tradesperson, or individual) selects the most 
                            significant people or specific elements without attempting to understand the community in its entirety. Using 
                            store ledgers, Shopping Stories intends to develop a prosopography to uncover consumer interests, lives, and the 
                            larger community of people in the 18th century through an online, searchable database.
                        </p>
                        </Typography>
				</Box>
			</Grid>
            <Grid
				container
				spacing={0}
				direction="column"
				alignItems="center"
				justifyContent="center"
				style={{ minHeight: '50vh' }}
			>
				<Box
					sx={{
						width: '60%',
						backgroundColor: 'primary.main',
						textAlign: 'center',
						// opacity: [0.9, 0.8, 0.7],
						// '&:hover': {
						// backgroundColor: 'primary.main',
						// opacity: [0.9, 0.8, 0.7],
						// },
					}}
				>
					<Typography>
                        <Title>People, Places, and Things</Title>
                        <Title>The Power of the 18th-Century Ledgers of John Glassford & Company</Title>
						<p>
                        Scotsman John Glassford controlled a major portion of the Chesapeake tobacco trade by establishing stores along the Potomac 
                        River where planters sold tobacco and purchased goods such as rum, sugar, salt, cloth, and hardware, as well as slaves. 
                        The John Glassford & Company Papers, owned by the Library of Congress, detail the daily transactions of the company and 
                        include the records of twenty identified branch stores in the Tidewater of Virginia and Maryland. These store accounts 
                        capture a moment in time – at the height of the colonial tobacco trade when access to consumer goods extended not only to upper class 
                        planters, but increasingly to the middle and lower classes including craftspeople, tenants, hired white workers, and the enslaved community.
						</p>
						<p>
                        The first phase of the project involved a crowd-sourced effort to transcribe 11 ledgers, with over 4,300 pages from two Virginia stores in 
                        Colchester and Alexandria from 1758-1769. In the second phase, History Revealed, Inc. (HRI), worked with the University of Central Florida 
                        (UCF) on a community partnership grant with history students to explore the people, places, and objects found within the 1760/1761 
                        Colchester store ledger through essays published on the website, Economy of Goods. In addition, HRI posted transcription challenges on 
                        social media and blog posts to its website. In addition, interns developed an index of objects and an index of people and places found 
                        in the ledger. The UCF partnership is culminating in the development of this prototype web application to provide the ledger’s data in a publicly 
                        accessible format enabling searches by people, places, and objects contained within these manuscripts.
						</p>
                        <p> 
                        These ledgers provide a look at life prior to the American Revolution, a time of transition as colonists experienced greater trade restrictions 
                        with Great Britain. The goal is to better understand the community who frequented these stores, what they purchased, how they paid for their 
                        goods - a glimpse into their lives and the local economy of Northern Virginia from 1758-1804, all contained in these interactions.
                        </p>
                        </Typography>
				</Box>
			</Grid>
      </TabPanel>
      <TabPanel value={value} index={2}>
        Transcription and the database
        <Grid
				container
				spacing={0}
				direction="column"
				alignItems="center"
				justifyContent="center"
				style={{ minHeight: '50vh' }}
			>
				<Box
					sx={{
						width: '60%',
						backgroundColor: 'primary.main',
						textAlign: 'center',
						// opacity: [0.9, 0.8, 0.7],
						// '&:hover': {
						// backgroundColor: 'primary.main',
						// opacity: [0.9, 0.8, 0.7],
						// },
					}}
				>
					<Typography>
                        <Title>The Transcription and Database Process</Title>
						<p>
                        Going from original manuscripts to digital transcriptions 
                        is challenging. What started as eleven ledgers from the 
                        John Glassford & Company records found on six microfilm reels 
                        turned into nearly 4,400 transcription files through the efforts 
                        of numerous people and partners.
                        </p>
						<p>
                        Students from universities across the country, as well as a cadre 
                        of interested volunteers participated in transcribing through a 
                        crowd-sourced, citizen-historian model. A ledger page template and 
                        transcription manual provided methodology and guidance and an evolving 
                        glossary of words and abbreviations assisting those unfamiliar with 
                        cursive handwriting and 18th-century terminology. After reviewing the 
                        reference materials, volunteers transcribed a practice set of pages to a
                        ssess their basic level of understanding of both the instructions and 
                        the original manuscripts. Next, being provided individualized assistance 
                        throughout, volunteers were sent the images of folios to transcribe into 
                        spreadsheets and return for review and additional feedback. The transcripts 
                        went through at least two reviews prior to inclusion in this database.
						</p>
                        <p> 
                        Given the use of abbreviations and unique pattern of transactions, 
                        rather than limit transcripts to a straightforward duplication of 
                        the original, volunteers inserted assumed information, abbreviations, 
                        and standardized spellings in square brackets adjacent to the original text. 
                        The text included in the database is currently limited to those standardizations 
                        of abbreviations (e.g. oz = ounce(s)), spelling (e.g. ozenbrigs = osnaburg), 
                        and insertion of words needed to understand the transactions 
                        (e.g. ditto = what was being repeated). 
                        For inclusion in the database, when multiple items were grouped together in 
                        a single purchase, they were isolated by quantity, qualifier, adjective(s), 
                        item, and price.
                        </p>
                        <p>
                        At present, the database only includes a sampling of pages from the Colchester 
                        store ledger for 1760-1761. Stay tuned for additional information on how to 
                        search the database and as additional pages are added. Note: an account will not 
                        be required to access the ledger information.
                        </p>
                        </Typography>
				</Box>
			</Grid>
      </TabPanel>
      <TabPanel value={value} index={3}>
      <Grid
				container
				spacing={0}
				direction="column"
				alignItems="center"
				justifyContent="center"
				style={{ minHeight: '50vh' }}
			>
				<Box
					sx={{
						width: '60%',
						backgroundColor: 'primary.main',
						textAlign: 'center',
						// opacity: [0.9, 0.8, 0.7],
						// '&:hover': {
						// backgroundColor: 'primary.main',
						// opacity: [0.9, 0.8, 0.7],
						// },
					}}
				>
					<Typography>
                        <Title>A Look at Ledgers</Title>
						<p>
                        With no computers and databases to keep track of inventory and customers, 
                        businesses kept ledgers – books that kept the list of customers, 
                        what was purchased when, and how purchases were paid. Ledgers were used 
                        by anyone who ran a business from tradesmen like tailors, blacksmiths, 
                        and printers to those who operated general stores like the two 
                        History Revealed, Inc. (HRI) is currently studying in Colchester and Alexandria, Virginia.
                        </p>
                        </Typography>
				</Box>
			</Grid>
            <Grid
				container
				spacing={0}
				direction="column"
				alignItems="center"
				justifyContent="center"
				style={{ minHeight: '50vh' }}
			>
				<Box
					sx={{
						width: '60%',
						backgroundColor: 'primary.main',
						textAlign: 'center',
						// opacity: [0.9, 0.8, 0.7],
						// '&:hover': {
						// backgroundColor: 'primary.main',
						// opacity: [0.9, 0.8, 0.7],
						// },
					}}
				>
					<Typography>
                        <Title>Ledgers: The Basics</Title>
						<p>
                        Creation of ledgers started with waste books – similar to receipts. 
                        Then, at the conclusion of every day, all those small transactions 
                        were entered into a day book, by date. At the end of the year, 
                        the day book would be converted into an account ledger organized 
                        by customer providing the business owner a legal record of all the customers, 
                        what was purchased/when, and who still owed money. As the legal record of the
                         business’s transactions, it could be used as evidence in court.
                        </p>
                        <p>
                            Ledger accounts typically spread out across two pages: the page on the 
                            left side listed all the purchases (debits) and the page on the right 
                            listed all the payments (credits). Each account began with the customer’s 
                            name, and sometimes a profession, location of residence, familiar relationships, 
                            and/or who provided security (the person responsible for paying the account if 
                            the customer didn’t). The account information appeared either entirely above 
                            the purchases or spread across both pages. Beneath the account information 
                            appeared the transactions (either purchases or payments) by date with a matching 
                            annual account total on both pages.
                        </p>
                        </Typography>
				</Box>
			</Grid>
            <Grid
				container
				spacing={0}
				direction="column"
				alignItems="center"
				justifyContent="center"
				style={{ minHeight: '50vh' }}
			>
				<Box
					sx={{
						width: '60%',
						backgroundColor: 'primary.main',
						textAlign: 'center',
						// opacity: [0.9, 0.8, 0.7],
						// '&:hover': {
						// backgroundColor: 'primary.main',
						// opacity: [0.9, 0.8, 0.7],
						// },
					}}
				>
					<Typography>
                        <Title>Purchases and Payments</Title>
						<p>
                        In the 18th-century, while customers could pay at the time of sale, 
                        many people made their purchases on credit with the intent to pay their 
                        account after harvests of tobacco or other crops. Most purchases of goods 
                        and services were not done through bartering, but with credit; everything 
                        had value and that was what you paid or owed even when no money changed hands.
                        </p>
                        <p>
                        When looking at the ledger, the more straightforward page to understand is 
                        the debit or purchases page – what was purchased by the account holder or 
                        paid to others by the store on the customer’s behalf. Each row begins with a date, 
                        the word ‘To’ indicating the transaction results in a debt to the store, and then 
                        a list of transactions or purchases that occurred with a total on the far right. 
                        When lots of items were purchased or transactions occurred on the same day, rather 
                        than repeat the date again and again, the author simply creates a list and assumes 
                        the reader knows it is the same day.
                        </p>
                        <p> 
                        Purchases included not only goods; the store acted as a bank lending money, as a 
                        place to pay taxes and fines, payments for services rendered, or to pay back friends 
                        and family. The money could be either traditional currency or tobacco.
                        </p>
                        <p>
                        More challenging to understand is the credit page – how someone paid their account 
                        and what form that payment came in from cash to tobacco to payments made by others. 
                        Similar to the debit side, each transaction begins with a date, this time with the 
                        word ‘By’ which tells us the transaction will be paying the store, and then a list 
                        of transactions or payments that occurred with a total on the far right. And like 
                        the debit page, when transactions occurred on the same day, the author created a 
                        list rather than repeating the date each time. Payments in tobacco included the crop 
                        or transfer note information provided at the tobacco warehouse and the conversion rate 
                        for each one hundred pounds of tobacco.
                        </p>
                        <p>
                        While ledgers may seem complicated, they become easier when you see the pattern: a list 
                        of customers with purchase transactions on one page and payment transactions on the other.
                        </p>
                        </Typography>
				</Box>
			</Grid>
      </TabPanel>
      <TabPanel value={value} index={4}>
       Acknowledgements
       <Grid
				container
				spacing={0}
				direction="column"
				alignItems="center"
				justifyContent="center"
				style={{ minHeight: '50vh' }}
			>
				<Box
					sx={{
						width: '60%',
						backgroundColor: 'primary.main',
						textAlign: 'center',
						// opacity: [0.9, 0.8, 0.7],
						// '&:hover': {
						// backgroundColor: 'primary.main',
						// opacity: [0.9, 0.8, 0.7],
						// },
					}}
				>
					<Typography>
                        <Title>Acknowledgements</Title>
						<p>
                        Without the help of numerous individuals, we would not have been 
                        able to complete the initial transcriptions to make this database a reality.
                        </p>
                        <p>
                        We would especially like to thank the following for their hard work transcribing 
                        and reviewing the Colchester 1760/1761 ledger:
                        </p>
                        <p> 
                        Krisse Adams, Lori Arbuckle, Michelle Bakels, Julia Bennett, Laura Braddock, 
                        Barry Burr, Angela Claude, John Crowell Mackie, Rebecca Cruz, Robin Dunn, 
                        Charlotte Fennell, Kevin Gushman, Louise Haven, Andrew Heer, Morgan Holman, 
                        Mary & Alex Hughes, Molly Kerr, Altuan McGarvin, Teresa Mock, Sarah Myers, 
                        Sebastian Orrego, Christopher Owen, Nicholas Powers, Marian Price, 
                        Danielle Rodriguez, Rebecca Rodriguez, Jon Sanders, Richard Sickles, 
                        Allison Siegel, Joelle Simpson, Sarah Steele, Katherine Thurlow, Brett Trace, 
                        Nathan Van Buskirk, and Rachel Williams. 
                        </p>
                        <p> 
                        From 2016-2019, numerous undergraduate and graduate students at the 
                        University of Central Florida explored ways to think about the people, 
                        places, and objects found within the ledgers through research papers, 
                        blog posts, posters, infographics, website mock-ups, and theses through 
                        history classes with Dr. Rosalind Beiler (The Atlantic World, 1400-1900; 
                        Colonial America, 1607-1765; History & Historians; and Colloquia in Material Culture).
                        </p>
                        <p> 
                        Finally, the Shopping Stories website and database were developed as part of the 
                        University of Central Florida’s Computer Science Senior Design class with a terrific 
                        team of students: Andrew John (Project Manager), John Kennedy, and Laurell Cuza.
                        </p>
                        </Typography>
				</Box>
			</Grid>
            <Grid
				container
				spacing={0}
				direction="column"
				alignItems="center"
				justifyContent="center"
				style={{ minHeight: '50vh' }}
			>
				<Box
					sx={{
						width: '60%',
						backgroundColor: 'primary.main',
						textAlign: 'center',
						// opacity: [0.9, 0.8, 0.7],
						// '&:hover': {
						// backgroundColor: 'primary.main',
						// opacity: [0.9, 0.8, 0.7],
						// },
					}}
				>
					<Typography>
                        <Title>Image Credits</Title>
						<p>
                        High Life Below Stairs, John Collet, London, England, 1763, oil on canvas, 
                        accession #1991-175, A&B, image #TC2000-887. Courtesy of The Colonial Williamsburg 
                        Foundation, Gift of Mrs. Cora Ginsburg.
                        </p>
                        <p>
                        A map of the most inhabited part of Virginia containing the whole province of Maryland 
                        with part of Pensilvania [Pennsylvania], New Jersey and North Carolina, by Joshua Fry, 
                        Peter Jefferson, and Thomas Jefferys, 1755. Courtesy of the Library of Congress, 
                        Geography and Map Division.
                        </p>
                        <p> 
                        Ledger 1760-1761, Colchester, Virginia, Account of Elizabeth Connell (folio 23), 
                        from the John Glassford and Company Records. Courtesy of the Library of Congress, 
                        Manuscript Division.
                        </p>
                        <p> 
                        "Tobacco Production, Virginia, 18th cent.", Slavery Images: A Visual Record of 
                        the African Slave Trade and Slave Life in the Early African Diaspora, 
                        accessed October 21, 2020, http://slaveryimages.org/s/slaveryimages/item/1118.
                        </p>
                        </Typography>
				</Box>
			</Grid>
      </TabPanel>
    </Box>
  );
}
