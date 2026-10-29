export type UkLocation = {
  slug: string;
  name: string;
  region: string;
  nation: "England" | "Scotland" | "Wales" | "Northern Ireland";
  nearby: string[];
  focus: string;
  landmark: string;
};

/** Curated list of major UK cities/towns for location-based SEO pages.
 *  Kept to ~40 to avoid thin/doorway-page risk from covering every UK town. */
export const UK_LOCATIONS: UkLocation[] = [
  { slug: "london", name: "London", region: "Greater London", nation: "England", nearby: ["Croydon", "Reading", "Watford"], focus: "fintech, media and scaleup SaaS", landmark: "the City and Canary Wharf" },
  { slug: "birmingham", name: "Birmingham", region: "West Midlands", nation: "England", nearby: ["Wolverhampton", "Coventry", "Solihull"], focus: "manufacturing, logistics and professional services", landmark: "the Jewellery Quarter" },
  { slug: "manchester", name: "Manchester", region: "Greater Manchester", nation: "England", nearby: ["Salford", "Stockport", "Bolton"], focus: "media, fintech and e-commerce", landmark: "MediaCityUK" },
  { slug: "leeds", name: "Leeds", region: "West Yorkshire", nation: "England", nearby: ["Bradford", "Wakefield", "Harrogate"], focus: "financial services and retail tech", landmark: "the Leeds financial district" },
  { slug: "liverpool", name: "Liverpool", region: "Merseyside", nation: "England", nearby: ["Birkenhead", "St Helens", "Southport"], focus: "logistics, creative industries and healthtech", landmark: "the Baltic Triangle" },
  { slug: "sheffield", name: "Sheffield", region: "South Yorkshire", nation: "England", nearby: ["Rotherham", "Barnsley", "Chesterfield"], focus: "advanced manufacturing and engineering", landmark: "the Advanced Manufacturing Park" },
  { slug: "bristol", name: "Bristol", region: "South West England", nation: "England", nearby: ["Bath", "Weston-super-Mare", "Yate"], focus: "aerospace, creative tech and fintech", landmark: "the Bristol Temple Quarter" },
  { slug: "newcastle", name: "Newcastle upon Tyne", region: "North East England", nation: "England", nearby: ["Gateshead", "Sunderland", "North Shields"], focus: "digital services and life sciences", landmark: "the Newcastle Helix" },
  { slug: "nottingham", name: "Nottingham", region: "East Midlands", nation: "England", nearby: ["Derby", "Mansfield", "Loughborough"], focus: "life sciences and retail tech", landmark: "the Nottingham Science Park" },
  { slug: "leicester", name: "Leicester", region: "East Midlands", nation: "England", nearby: ["Loughborough", "Rugby", "Melton Mowbray"], focus: "textiles, logistics and retail", landmark: "the Leicester Innovation Hub" },
  { slug: "coventry", name: "Coventry", region: "West Midlands", nation: "England", nearby: ["Birmingham", "Rugby", "Nuneaton"], focus: "automotive and advanced engineering", landmark: "the University of Warwick Science Park" },
  { slug: "bradford", name: "Bradford", region: "West Yorkshire", nation: "England", nearby: ["Leeds", "Halifax", "Keighley"], focus: "manufacturing and digital media", landmark: "the Bradford City Park" },
  { slug: "stoke-on-trent", name: "Stoke-on-Trent", region: "Staffordshire", nation: "England", nearby: ["Stafford", "Crewe", "Newcastle-under-Lyme"], focus: "ceramics, logistics and manufacturing", landmark: "the Ceramic Valley Enterprise Zone" },
  { slug: "wolverhampton", name: "Wolverhampton", region: "West Midlands", nation: "England", nearby: ["Birmingham", "Dudley", "Telford"], focus: "manufacturing and logistics", landmark: "the i54 business park" },
  { slug: "plymouth", name: "Plymouth", region: "South West England", nation: "England", nearby: ["Exeter", "Truro", "Torquay"], focus: "marine industries and defence tech", landmark: "the Plymouth Science Park" },
  { slug: "southampton", name: "Southampton", region: "South East England", nation: "England", nearby: ["Portsmouth", "Winchester", "Eastleigh"], focus: "maritime, logistics and e-commerce", landmark: "the Southampton Science Park" },
  { slug: "reading", name: "Reading", region: "South East England", nation: "England", nearby: ["Wokingham", "Bracknell", "Basingstoke"], focus: "enterprise software and telecoms", landmark: "the Thames Valley tech corridor" },
  { slug: "derby", name: "Derby", region: "East Midlands", nation: "England", nearby: ["Nottingham", "Burton upon Trent", "Chesterfield"], focus: "aerospace and rail engineering", landmark: "the Derby Pride Park business district" },
  { slug: "portsmouth", name: "Portsmouth", region: "South East England", nation: "England", nearby: ["Southampton", "Chichester", "Havant"], focus: "maritime tech and defence", landmark: "the Portsmouth Historic Dockyard business area" },
  { slug: "brighton", name: "Brighton and Hove", region: "South East England", nation: "England", nearby: ["Worthing", "Eastbourne", "Lewes"], focus: "digital media and creative startups", landmark: "the Brighton Digital Exchange" },
  { slug: "oxford", name: "Oxford", region: "South East England", nation: "England", nearby: ["Abingdon", "Bicester", "Witney"], focus: "biotech, academic spinouts and AI research", landmark: "the Oxford Science Park" },
  { slug: "cambridge", name: "Cambridge", region: "East of England", nation: "England", nearby: ["Ely", "Huntingdon", "Royston"], focus: "deep tech, biotech and AI startups", landmark: "the Cambridge Science Park" },
  { slug: "york", name: "York", region: "North Yorkshire", nation: "England", nearby: ["Harrogate", "Selby", "Malton"], focus: "tourism tech and professional services", landmark: "York Science Park" },
  { slug: "norwich", name: "Norwich", region: "East of England", nation: "England", nearby: ["Great Yarmouth", "Thetford", "Dereham"], focus: "insurtech and agri-tech", landmark: "the Norwich Research Park" },
  { slug: "milton-keynes", name: "Milton Keynes", region: "South East England", nation: "England", nearby: ["Bedford", "Northampton", "Luton"], focus: "logistics tech and retail innovation", landmark: "the Milton Keynes Innovation Centre" },
  { slug: "luton", name: "Luton", region: "East of England", nation: "England", nearby: ["Bedford", "Watford", "St Albans"], focus: "aviation and logistics", landmark: "the Luton Airport business district" },
  { slug: "northampton", name: "Northampton", region: "East Midlands", nation: "England", nearby: ["Milton Keynes", "Leicester", "Wellingborough"], focus: "logistics and distribution tech", landmark: "the Northampton Waterside" },
  { slug: "sunderland", name: "Sunderland", region: "North East England", nation: "England", nearby: ["Newcastle", "Durham", "South Shields"], focus: "automotive and advanced manufacturing", landmark: "the Sunderland Software Centre" },
  { slug: "hull", name: "Hull", region: "East Yorkshire", nation: "England", nearby: ["Beverley", "Grimsby", "Scunthorpe"], focus: "renewable energy and logistics", landmark: "the Hull Energy Estate" },
  { slug: "preston", name: "Preston", region: "Lancashire", nation: "England", nearby: ["Blackpool", "Blackburn", "Lancaster"], focus: "aerospace and manufacturing", landmark: "the Preston Digital Health hub" },
  { slug: "bournemouth", name: "Bournemouth", region: "South West England", nation: "England", nearby: ["Poole", "Christchurch", "Dorchester"], focus: "digital marketing and fintech", landmark: "the Bournemouth digital cluster" },
  { slug: "exeter", name: "Exeter", region: "South West England", nation: "England", nearby: ["Plymouth", "Taunton", "Torquay"], focus: "science, agri-tech and professional services", landmark: "the Exeter Science Park" },
  { slug: "swindon", name: "Swindon", region: "South West England", nation: "England", nearby: ["Oxford", "Bristol", "Chippenham"], focus: "automotive and logistics tech", landmark: "the Swindon Southmead Industrial Area" },
  { slug: "glasgow", name: "Glasgow", region: "Scotland", nation: "Scotland", nearby: ["Paisley", "East Kilbride", "Hamilton"], focus: "fintech, gaming and life sciences", landmark: "the Glasgow Tontine innovation district" },
  { slug: "edinburgh", name: "Edinburgh", region: "Scotland", nation: "Scotland", nearby: ["Livingston", "Dunfermline", "Musselburgh"], focus: "fintech, data science and SaaS", landmark: "the Edinburgh BioQuarter" },
  { slug: "aberdeen", name: "Aberdeen", region: "Scotland", nation: "Scotland", nearby: ["Inverurie", "Peterhead", "Stonehaven"], focus: "energy tech and subsea engineering", landmark: "the Aberdeen Energy Transition Zone" },
  { slug: "dundee", name: "Dundee", region: "Scotland", nation: "Scotland", nearby: ["Perth", "St Andrews", "Arbroath"], focus: "video game studios and life sciences", landmark: "the Dundee Waterfront" },
  { slug: "cardiff", name: "Cardiff", region: "Wales", nation: "Wales", nearby: ["Newport", "Barry", "Caerphilly"], focus: "fintech, media and compound semiconductors", landmark: "Cardiff Bay" },
  { slug: "swansea", name: "Swansea", region: "Wales", nation: "Wales", nearby: ["Neath", "Port Talbot", "Llanelli"], focus: "digital health and manufacturing", landmark: "the Swansea Bay Campus" },
  { slug: "newport", name: "Newport", region: "Wales", nation: "Wales", nearby: ["Cardiff", "Cwmbran", "Chepstow"], focus: "semiconductors and advanced manufacturing", landmark: "the Newport Compound Semiconductor Cluster" },
  { slug: "belfast", name: "Belfast", region: "Northern Ireland", nation: "Northern Ireland", nearby: ["Lisburn", "Bangor", "Newtownabbey"], focus: "fintech, cybersecurity and legaltech", landmark: "the Belfast Gasworks" },
  { slug: "derry", name: "Derry~Londonderry", region: "Northern Ireland", nation: "Northern Ireland", nearby: ["Strabane", "Limavady", "Letterkenny"], focus: "digital services and fintech", landmark: "Ebrington" },
];
