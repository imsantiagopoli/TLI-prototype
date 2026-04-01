export type ContactRole = "broker" | "drayage" | "warehouse" | "carrier" | "customer" | "forwarder"

export interface Contact {
  id: string
  name: string
  company: string
  email: string
  phone: string
  role: ContactRole
  matchKeys: string[]
  notes: string
}

export const contacts: Contact[] = [
  // === BROKERS (matched by shipping line code) ===
  {
    id: "broker-emc",
    name: "Michael Chen",
    company: "Pacific Customs Brokerage",
    email: "mchen@pacificcustoms.com",
    phone: "(310) 555-0112",
    role: "broker",
    matchKeys: ["EMC"],
    notes: "Handles all Evergreen Marine containers. Primary broker for Ross direct shipments.",
  },
  {
    id: "broker-sml",
    name: "Linda Tran",
    company: "Harbor Freight Brokerage",
    email: "ltran@harborbrokerage.com",
    phone: "(310) 555-0234",
    role: "broker",
    matchKeys: ["SML"],
    notes: "SM Line specialist. Also handles customs exams at Pier A.",
  },
  {
    id: "broker-hyn",
    name: "David Park",
    company: "TransPacific Customs Services",
    email: "dpark@transpacificcs.com",
    phone: "(310) 555-0356",
    role: "broker",
    matchKeys: ["HYN"],
    notes: "HMM (Hyundai) broker. Covers TTI and ITS terminals.",
  },
  {
    id: "broker-one",
    name: "Sarah Kim",
    company: "West Coast Customs Brokers",
    email: "skim@westcoastbrokers.com",
    phone: "(310) 555-0478",
    role: "broker",
    matchKeys: ["ONE"],
    notes: "Ocean Network Express broker. Experienced with TraPac and WBCT.",
  },
  {
    id: "broker-mrsk",
    name: "James Rodriguez",
    company: "Global Trade Compliance",
    email: "jrodriguez@globaltradecomp.com",
    phone: "(310) 555-0591",
    role: "broker",
    matchKeys: ["MRSK"],
    notes: "Maersk dedicated broker. Handles APM terminal containers.",
  },
  {
    id: "broker-wan",
    name: "Kevin Nguyen",
    company: "Pacific Customs Brokerage",
    email: "knguyen@pacificcustoms.com",
    phone: "(310) 555-0623",
    role: "broker",
    matchKeys: ["WAN"],
    notes: "Wan Hai Lines broker. Same firm as EMC broker.",
  },

  // === DRAYAGE COMPANIES (matched by prodType / drayage code) ===
  {
    id: "drayage-ftdi",
    name: "Tony Martinez",
    company: "FTD Inc.",
    email: "dispatch@ftdinc.com",
    phone: "(562) 555-0711",
    role: "drayage",
    matchKeys: ["FTDI", "FTD"],
    notes: "Primary drayage for LA-FTD warehouse. High volume — schedule 24h in advance.",
  },
  {
    id: "drayage-nrt",
    name: "Robert Williams",
    company: "NRT Trucking",
    email: "dispatch@nrttrucking.com",
    phone: "(562) 555-0822",
    role: "drayage",
    matchKeys: ["NRT"],
    notes: "Handles direct-to-customer deliveries. Good for Ross and HomeGoods routes.",
  },
  {
    id: "drayage-hww",
    name: "Maria Garcia",
    company: "HWW Transport",
    email: "operations@hwwtransport.com",
    phone: "(562) 555-0933",
    role: "drayage",
    matchKeys: ["HWW"],
    notes: "Services LA-GPA and LA-TAC warehouses. Also does empty returns at TraPac.",
  },
  {
    id: "drayage-edray",
    name: "Chris Johnson",
    company: "E-Dray Services",
    email: "dispatch@edrayservices.com",
    phone: "(562) 555-1044",
    role: "drayage",
    matchKeys: ["E-DRAY", "EDRAY"],
    notes: "Burlington preferred drayage. Fast turnaround for TTI pickups.",
  },
  {
    id: "drayage-poetr",
    name: "Angela Lopez",
    company: "POE Transport",
    email: "ops@poetransport.com",
    phone: "(562) 555-1155",
    role: "drayage",
    matchKeys: ["POETR", "POE TRANS"],
    notes: "POE transload specialist. Handles container transfers between terminals.",
  },
  {
    id: "drayage-cnc",
    name: "Daniel Lee",
    company: "CNC Drayage",
    email: "scheduling@cncdrayage.com",
    phone: "(562) 555-1266",
    role: "drayage",
    matchKeys: ["CNC"],
    notes: "Ross direct shipment drayage. Works closely with Pacific Customs (EMC broker).",
  },

  // === WAREHOUSES (matched by warehouse code) ===
  {
    id: "warehouse-laftd",
    name: "Patricia Reyes",
    company: "FTD Warehouse — LA",
    email: "preyes@ftdwarehouse.com",
    phone: "(323) 555-2011",
    role: "warehouse",
    matchKeys: ["LA-FTD"],
    notes: "Primary TLI warehouse. Handles most domestic orders. Contact for receiving and pick tickets.",
  },
  {
    id: "warehouse-lagpa",
    name: "Steven Chang",
    company: "GPA Warehouse — LA",
    email: "schang@gpawarehouse.com",
    phone: "(323) 555-2122",
    role: "warehouse",
    matchKeys: ["LA-GPA"],
    notes: "Secondary warehouse. Overflow capacity. Good for HomeGoods and large palletized loads.",
  },
  {
    id: "warehouse-latac",
    name: "Jennifer Huang",
    company: "TAC Warehouse — LA",
    email: "jhuang@tacwarehouse.com",
    phone: "(323) 555-2233",
    role: "warehouse",
    matchKeys: ["LA-TAC"],
    notes: "Handles area rugs, tables, and oversized items. Burlington and Bealls orders.",
  },

  // === CARRIERS (matched by customer code for outbound) ===
  {
    id: "carrier-tjx",
    name: "Mark Thompson",
    company: "National Freight Lines",
    email: "mthompson@nationalfreight.com",
    phone: "(800) 555-3011",
    role: "carrier",
    matchKeys: ["TJ", "MA", "HG", "SR"],
    notes: "TJX Companies preferred carrier (TJ Maxx, Marshalls, HomeGoods, Sierra). Handles all TJX DC deliveries.",
  },
  {
    id: "carrier-ross",
    name: "Lisa Anderson",
    company: "Western Distribution Transport",
    email: "landerson@westerndist.com",
    phone: "(800) 555-3122",
    role: "carrier",
    matchKeys: ["RO"],
    notes: "Ross dedicated carrier. Must route through Ross vendor portal for ASN.",
  },
  {
    id: "carrier-burl",
    name: "Frank Davis",
    company: "Express Freight Systems",
    email: "fdavis@expressfreight.com",
    phone: "(800) 555-3233",
    role: "carrier",
    matchKeys: ["BU"],
    notes: "Burlington carrier. 48-hour scheduling lead time required.",
  },
  {
    id: "carrier-bealls",
    name: "Nancy Wilson",
    company: "Southeast Logistics",
    email: "nwilson@selogistics.com",
    phone: "(800) 555-3344",
    role: "carrier",
    matchKeys: ["BEL"],
    notes: "Bealls carrier. Delivers to FL distribution centers.",
  },
  {
    id: "carrier-gab",
    name: "Tom Harris",
    company: "Mid-Atlantic Carriers",
    email: "tharris@midatlanticcarriers.com",
    phone: "(800) 555-3455",
    role: "carrier",
    matchKeys: ["GAB"],
    notes: "Gabriel Brothers / Gabe's carrier. WV and PA delivery zones.",
  },
  {
    id: "carrier-hs",
    name: "Mark Thompson",
    company: "National Freight Lines",
    email: "mthompson@nationalfreight.com",
    phone: "(800) 555-3011",
    role: "carrier",
    matchKeys: ["HS"],
    notes: "HomeSense — same carrier as TJX family.",
  },
]

export function findContactByRole(role: ContactRole, matchKey: string): Contact | undefined {
  return contacts.find(
    (c) => c.role === role && c.matchKeys.some((k) => k === matchKey)
  )
}

export function findContactsByRole(role: ContactRole): Contact[] {
  return contacts.filter((c) => c.role === role)
}

export function resolveRecipient(
  actionCategory: string,
  context: {
    shippingLine?: string
    terminal?: string
    drayageCode?: string
    warehouse?: string
    custCode?: string
  }
): { contact: Contact | undefined; recipientType: ContactRole } {
  switch (actionCategory) {
    case "request-do":
    case "update-lfd": {
      const contact = context.shippingLine
        ? findContactByRole("broker", context.shippingLine)
        : undefined
      return { contact, recipientType: "broker" }
    }

    case "schedule-pickup":
    case "return-empty": {
      let contact: Contact | undefined
      if (context.drayageCode) {
        contact = findContactByRole("drayage", context.drayageCode)
      }
      return { contact, recipientType: "drayage" }
    }

    case "confirm-receipt":
    case "route-picks":
    case "pick-order": {
      const contact = context.warehouse
        ? findContactByRole("warehouse", context.warehouse)
        : undefined
      return { contact, recipientType: "warehouse" }
    }

    case "confirm-shipment":
    case "schedule-shipment": {
      const contact = context.custCode
        ? findContactByRole("carrier", context.custCode)
        : undefined
      return { contact, recipientType: "carrier" }
    }

    default:
      return { contact: undefined, recipientType: "broker" }
  }
}
