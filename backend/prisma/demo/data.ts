// =============================================================================
// Demo Product Data
// 90 realistic Indian retail products distributed across categories
// =============================================================================

export interface ProductData {
  id: string;
  categoryId: string;
  sku: string;
  barcode: string;
  name: string;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  taxRate: number;
  reorderLevel: number;
  /** Which store IDs carry this product (subset of all 8 stores) */
  storeDistribution: "all" | "most" | "some" | "few";
}

export const PRODUCTS: ProductData[] = [
  // ── Groceries (cat-grocery) ─────────────────────────────────────────────
  { id: "prod-0001", categoryId: "cat-grocery", sku: "GRC-RICE-5KG", barcode: "8901000000011", name: "Premium Basmati Rice 5kg", unit: "pcs", costPrice: 390, sellingPrice: 475, taxRate: 5, reorderLevel: 20, storeDistribution: "all" },
  { id: "prod-0002", categoryId: "cat-grocery", sku: "GRC-WHEAT-10K", barcode: "8901000000028", name: "Whole Wheat Atta 10kg", unit: "pcs", costPrice: 340, sellingPrice: 425, taxRate: 5, reorderLevel: 25, storeDistribution: "all" },
  { id: "prod-0003", categoryId: "cat-grocery", sku: "GRC-DAAL-1KG", barcode: "8901000000035", name: "Toor Dal 1kg", unit: "pcs", costPrice: 120, sellingPrice: 155, taxRate: 5, reorderLevel: 30, storeDistribution: "all" },
  { id: "prod-0004", categoryId: "cat-grocery", sku: "GRC-SUGAR-5KG", barcode: "8901000000042", name: "Refined Sugar 5kg", unit: "pcs", costPrice: 195, sellingPrice: 240, taxRate: 5, reorderLevel: 20, storeDistribution: "all" },
  { id: "prod-0005", categoryId: "cat-grocery", sku: "GRC-SALT-1KG", barcode: "8901000000059", name: "Iodised Salt 1kg", unit: "pcs", costPrice: 18, sellingPrice: 25, taxRate: 0, reorderLevel: 50, storeDistribution: "all" },
  { id: "prod-0006", categoryId: "cat-grocery", sku: "GRC-OIL-5L", barcode: "8901000000066", name: "Refined Sunflower Oil 5L", unit: "pcs", costPrice: 580, sellingPrice: 699, taxRate: 5, reorderLevel: 15, storeDistribution: "all" },
  { id: "prod-0007", categoryId: "cat-grocery", sku: "GRC-MASALA-100", barcode: "8901000000073", name: "Garam Masala 100g", unit: "pcs", costPrice: 55, sellingPrice: 79, taxRate: 5, reorderLevel: 40, storeDistribution: "most" },

  // ── Beverages (cat-beverages) ──────────────────────────────────────────
  { id: "prod-0008", categoryId: "cat-beverages", sku: "BEV-COLA-500", barcode: "8901000000080", name: "Cola Soft Drink 500ml", unit: "pcs", costPrice: 28, sellingPrice: 40, taxRate: 28, reorderLevel: 50, storeDistribution: "all" },
  { id: "prod-0009", categoryId: "cat-beverages", sku: "BEV-JUICE-1L", barcode: "8901000000097", name: "Mixed Fruit Juice 1L", unit: "pcs", costPrice: 72, sellingPrice: 99, taxRate: 12, reorderLevel: 30, storeDistribution: "all" },
  { id: "prod-0010", categoryId: "cat-beverages", sku: "BEV-WATER-1L", barcode: "8901000000104", name: "Mineral Water 1L", unit: "pcs", costPrice: 12, sellingPrice: 20, taxRate: 18, reorderLevel: 100, storeDistribution: "all" },
  { id: "prod-0011", categoryId: "cat-beverages", sku: "BEV-TEA-250G", barcode: "8901000000111", name: "Premium Tea Leaves 250g", unit: "pcs", costPrice: 140, sellingPrice: 195, taxRate: 5, reorderLevel: 25, storeDistribution: "most" },
  { id: "prod-0012", categoryId: "cat-beverages", sku: "BEV-COFFEE-200", barcode: "8901000000128", name: "Instant Coffee 200g", unit: "pcs", costPrice: 280, sellingPrice: 375, taxRate: 18, reorderLevel: 20, storeDistribution: "most" },

  // ── Dairy (cat-dairy) ──────────────────────────────────────────────────
  { id: "prod-0013", categoryId: "cat-dairy", sku: "DRY-MILK-1L", barcode: "8901000000135", name: "Full Cream Milk 1L", unit: "pcs", costPrice: 52, sellingPrice: 68, taxRate: 0, reorderLevel: 80, storeDistribution: "all" },
  { id: "prod-0014", categoryId: "cat-dairy", sku: "DRY-CURD-400G", barcode: "8901000000142", name: "Fresh Curd 400g", unit: "pcs", costPrice: 30, sellingPrice: 45, taxRate: 0, reorderLevel: 60, storeDistribution: "all" },
  { id: "prod-0015", categoryId: "cat-dairy", sku: "DRY-PANR-200G", barcode: "8901000000159", name: "Fresh Paneer 200g", unit: "pcs", costPrice: 65, sellingPrice: 90, taxRate: 0, reorderLevel: 40, storeDistribution: "most" },
  { id: "prod-0016", categoryId: "cat-dairy", sku: "DRY-GHEE-1L", barcode: "8901000000166", name: "Pure Desi Ghee 1L", unit: "pcs", costPrice: 420, sellingPrice: 545, taxRate: 12, reorderLevel: 15, storeDistribution: "most" },
  { id: "prod-0017", categoryId: "cat-dairy", sku: "DRY-BUTTER-500", barcode: "8901000000173", name: "Salted Butter 500g", unit: "pcs", costPrice: 210, sellingPrice: 270, taxRate: 12, reorderLevel: 25, storeDistribution: "most" },

  // ── Bakery (cat-bakery) ────────────────────────────────────────────────
  { id: "prod-0018", categoryId: "cat-bakery", sku: "BKY-BREAD-WHL", barcode: "8901000000180", name: "Whole Wheat Bread 400g", unit: "pcs", costPrice: 32, sellingPrice: 45, taxRate: 0, reorderLevel: 50, storeDistribution: "all" },
  { id: "prod-0019", categoryId: "cat-bakery", sku: "BKY-BISCUIT-200", barcode: "8901000000197", name: "Cream Biscuits 200g", unit: "pcs", costPrice: 20, sellingPrice: 30, taxRate: 18, reorderLevel: 60, storeDistribution: "all" },
  { id: "prod-0020", categoryId: "cat-bakery", sku: "BKY-CAKE-500", barcode: "8901000000204", name: "Chocolate Cake 500g", unit: "pcs", costPrice: 180, sellingPrice: 250, taxRate: 18, reorderLevel: 10, storeDistribution: "some" },
  { id: "prod-0021", categoryId: "cat-bakery", sku: "BKY-RUSK-300G", barcode: "8901000000211", name: "Toast Rusk 300g", unit: "pcs", costPrice: 35, sellingPrice: 50, taxRate: 18, reorderLevel: 40, storeDistribution: "most" },

  // ── Personal Care (cat-personal) ───────────────────────────────────────
  { id: "prod-0022", categoryId: "cat-personal", sku: "PRC-SOAP-125G", barcode: "8901000000228", name: "Moisturising Soap 125g", unit: "pcs", costPrice: 28, sellingPrice: 42, taxRate: 18, reorderLevel: 60, storeDistribution: "all" },
  { id: "prod-0023", categoryId: "cat-personal", sku: "PRC-SHAMP-200", barcode: "8901000000235", name: "Anti-Dandruff Shampoo 200ml", unit: "pcs", costPrice: 140, sellingPrice: 199, taxRate: 18, reorderLevel: 30, storeDistribution: "all" },
  { id: "prod-0024", categoryId: "cat-personal", sku: "PRC-TOOTH-150", barcode: "8901000000242", name: "Herbal Toothpaste 150g", unit: "pcs", costPrice: 55, sellingPrice: 85, taxRate: 18, reorderLevel: 40, storeDistribution: "all" },
  { id: "prod-0025", categoryId: "cat-personal", sku: "PRC-DEODR-150", barcode: "8901000000259", name: "Body Deodorant 150ml", unit: "pcs", costPrice: 120, sellingPrice: 175, taxRate: 28, reorderLevel: 20, storeDistribution: "most" },
  { id: "prod-0026", categoryId: "cat-personal", sku: "PRC-RAZOR-5PK", barcode: "8901000000266", name: "Disposable Razor 5-Pack", unit: "pcs", costPrice: 65, sellingPrice: 95, taxRate: 18, reorderLevel: 30, storeDistribution: "most" },

  // ── Household (cat-household) ──────────────────────────────────────────
  { id: "prod-0027", categoryId: "cat-household", sku: "HLD-DETERG-2L", barcode: "8901000000273", name: "Liquid Detergent 2L", unit: "pcs", costPrice: 180, sellingPrice: 245, taxRate: 18, reorderLevel: 20, storeDistribution: "all" },
  { id: "prod-0028", categoryId: "cat-household", sku: "HLD-FLOOR-1L", barcode: "8901000000280", name: "Floor Cleaner 1L", unit: "pcs", costPrice: 85, sellingPrice: 125, taxRate: 18, reorderLevel: 25, storeDistribution: "all" },
  { id: "prod-0029", categoryId: "cat-household", sku: "HLD-TOILET-500", barcode: "8901000000297", name: "Toilet Cleaner 500ml", unit: "pcs", costPrice: 55, sellingPrice: 79, taxRate: 18, reorderLevel: 30, storeDistribution: "all" },
  { id: "prod-0030", categoryId: "cat-household", sku: "HLD-TISSUE-6PK", barcode: "8901000000303", name: "Tissue Box 6-Pack", unit: "pcs", costPrice: 140, sellingPrice: 199, taxRate: 18, reorderLevel: 25, storeDistribution: "most" },
  { id: "prod-0031", categoryId: "cat-household", sku: "HLD-TRASH-50PK", barcode: "8901000000310", name: "Garbage Bags 50-Pack", unit: "pcs", costPrice: 90, sellingPrice: 135, taxRate: 18, reorderLevel: 20, storeDistribution: "most" },

  // ── Electronics — Mobile Accessories (cat-mobile-acc) ──────────────────
  { id: "prod-0032", categoryId: "cat-mobile-acc", sku: "MOB-CASE-UNI", barcode: "8901000000327", name: "Universal Phone Case", unit: "pcs", costPrice: 120, sellingPrice: 199, taxRate: 18, reorderLevel: 15, storeDistribution: "most" },
  { id: "prod-0033", categoryId: "cat-mobile-acc", sku: "MOB-CHRG-USBC", barcode: "8901000000334", name: "USB-C Fast Charger 25W", unit: "pcs", costPrice: 350, sellingPrice: 549, taxRate: 18, reorderLevel: 10, storeDistribution: "most" },
  { id: "prod-0034", categoryId: "cat-mobile-acc", sku: "MOB-SCGRD-TMP", barcode: "8901000000341", name: "Tempered Glass Screen Guard", unit: "pcs", costPrice: 45, sellingPrice: 99, taxRate: 18, reorderLevel: 30, storeDistribution: "most" },
  { id: "prod-0035", categoryId: "cat-mobile-acc", sku: "MOB-PBANK-10K", barcode: "8901000000358", name: "Power Bank 10000mAh", unit: "pcs", costPrice: 650, sellingPrice: 999, taxRate: 18, reorderLevel: 8, storeDistribution: "some" },

  // ── Electronics — Audio (cat-audio) ────────────────────────────────────
  { id: "prod-0036", categoryId: "cat-audio", sku: "AUD-EARBUD-BT", barcode: "8901000000365", name: "Wireless Earbuds", unit: "pcs", costPrice: 850, sellingPrice: 1299, taxRate: 18, reorderLevel: 10, storeDistribution: "some" },
  { id: "prod-0037", categoryId: "cat-audio", sku: "AUD-HEADPHN-01", barcode: "8901000000372", name: "Over-Ear Headphones", unit: "pcs", costPrice: 1200, sellingPrice: 1899, taxRate: 18, reorderLevel: 5, storeDistribution: "some" },
  { id: "prod-0038", categoryId: "cat-audio", sku: "AUD-SPKR-BT-01", barcode: "8901000000389", name: "Bluetooth Speaker 10W", unit: "pcs", costPrice: 950, sellingPrice: 1499, taxRate: 18, reorderLevel: 5, storeDistribution: "few" },

  // ── Electronics — Computer Accessories (cat-comp-acc) ──────────────────
  { id: "prod-0039", categoryId: "cat-comp-acc", sku: "CMP-MOUSE-WRL", barcode: "8901000000396", name: "Wireless Mouse", unit: "pcs", costPrice: 380, sellingPrice: 599, taxRate: 18, reorderLevel: 10, storeDistribution: "some" },
  { id: "prod-0040", categoryId: "cat-comp-acc", sku: "CMP-KYBRD-WRL", barcode: "8901000000402", name: "Wireless Keyboard", unit: "pcs", costPrice: 680, sellingPrice: 1099, taxRate: 18, reorderLevel: 8, storeDistribution: "some" },
  { id: "prod-0041", categoryId: "cat-comp-acc", sku: "CMP-USB-HUB-4", barcode: "8901000000419", name: "USB Hub 4-Port", unit: "pcs", costPrice: 250, sellingPrice: 399, taxRate: 18, reorderLevel: 10, storeDistribution: "few" },
  { id: "prod-0042", categoryId: "cat-comp-acc", sku: "CMP-WEBCAM-HD", barcode: "8901000000426", name: "HD Webcam 1080p", unit: "pcs", costPrice: 1100, sellingPrice: 1699, taxRate: 18, reorderLevel: 5, storeDistribution: "few" },

  // ── Home Appliances (cat-appliances) ───────────────────────────────────
  { id: "prod-0043", categoryId: "cat-appliances", sku: "APL-IRON-1000W", barcode: "8901000000433", name: "Steam Iron 1000W", unit: "pcs", costPrice: 850, sellingPrice: 1299, taxRate: 18, reorderLevel: 5, storeDistribution: "some" },
  { id: "prod-0044", categoryId: "cat-appliances", sku: "APL-MIXR-750W", barcode: "8901000000440", name: "Mixer Grinder 750W", unit: "pcs", costPrice: 2200, sellingPrice: 3199, taxRate: 18, reorderLevel: 3, storeDistribution: "some" },
  { id: "prod-0045", categoryId: "cat-appliances", sku: "APL-FAN-CEIL", barcode: "8901000000457", name: "Ceiling Fan 1200mm", unit: "pcs", costPrice: 1400, sellingPrice: 2099, taxRate: 18, reorderLevel: 3, storeDistribution: "few" },
  { id: "prod-0046", categoryId: "cat-appliances", sku: "APL-HEATER-01", barcode: "8901000000464", name: "Room Heater 2000W", unit: "pcs", costPrice: 1800, sellingPrice: 2699, taxRate: 18, reorderLevel: 2, storeDistribution: "few" },
  { id: "prod-0047", categoryId: "cat-appliances", sku: "APL-KETTLE-1L", barcode: "8901000000471", name: "Electric Kettle 1L", unit: "pcs", costPrice: 550, sellingPrice: 849, taxRate: 18, reorderLevel: 5, storeDistribution: "some" },

  // ── Kitchen (cat-kitchen) ──────────────────────────────────────────────
  { id: "prod-0048", categoryId: "cat-kitchen", sku: "KTN-PAN-NONSTK", barcode: "8901000000488", name: "Non-Stick Frying Pan 26cm", unit: "pcs", costPrice: 450, sellingPrice: 699, taxRate: 18, reorderLevel: 8, storeDistribution: "most" },
  { id: "prod-0049", categoryId: "cat-kitchen", sku: "KTN-PRESS-5L", barcode: "8901000000495", name: "Pressure Cooker 5L", unit: "pcs", costPrice: 1200, sellingPrice: 1799, taxRate: 18, reorderLevel: 5, storeDistribution: "most" },
  { id: "prod-0050", categoryId: "cat-kitchen", sku: "KTN-TIFFIN-3T", barcode: "8901000000501", name: "Stainless Steel Tiffin 3-Tier", unit: "pcs", costPrice: 350, sellingPrice: 549, taxRate: 18, reorderLevel: 10, storeDistribution: "some" },
  { id: "prod-0051", categoryId: "cat-kitchen", sku: "KTN-BOTTLE-1L", barcode: "8901000000518", name: "Insulated Water Bottle 1L", unit: "pcs", costPrice: 280, sellingPrice: 449, taxRate: 18, reorderLevel: 15, storeDistribution: "most" },
  { id: "prod-0052", categoryId: "cat-kitchen", sku: "KTN-CONTAINER-SET", barcode: "8901000000525", name: "Storage Container Set 5pcs", unit: "set", costPrice: 320, sellingPrice: 499, taxRate: 18, reorderLevel: 8, storeDistribution: "some" },

  // ── Furniture (cat-furniture) ──────────────────────────────────────────
  { id: "prod-0053", categoryId: "cat-furniture", sku: "FRN-CHAIR-PLST", barcode: "8901000000532", name: "Plastic Chair (Stackable)", unit: "pcs", costPrice: 550, sellingPrice: 849, taxRate: 18, reorderLevel: 5, storeDistribution: "some" },
  { id: "prod-0054", categoryId: "cat-furniture", sku: "FRN-TABLE-FOLD", barcode: "8901000000549", name: "Folding Table 4ft", unit: "pcs", costPrice: 1800, sellingPrice: 2699, taxRate: 18, reorderLevel: 2, storeDistribution: "few" },
  { id: "prod-0055", categoryId: "cat-furniture", sku: "FRN-SHELF-3T", barcode: "8901000000556", name: "3-Tier Storage Shelf", unit: "pcs", costPrice: 2200, sellingPrice: 3299, taxRate: 18, reorderLevel: 2, storeDistribution: "few" },
  { id: "prod-0056", categoryId: "cat-furniture", sku: "FRN-STOOL-WOD", barcode: "8901000000563", name: "Wooden Stool", unit: "pcs", costPrice: 450, sellingPrice: 699, taxRate: 18, reorderLevel: 5, storeDistribution: "some" },

  // ── Clothing (cat-clothing) ────────────────────────────────────────────
  { id: "prod-0057", categoryId: "cat-clothing", sku: "CLT-TSHIRT-M", barcode: "8901000000570", name: "Cotton T-Shirt (M)", unit: "pcs", costPrice: 180, sellingPrice: 299, taxRate: 5, reorderLevel: 20, storeDistribution: "most" },
  { id: "prod-0058", categoryId: "cat-clothing", sku: "CLT-JEANS-32", barcode: "8901000000587", name: "Denim Jeans (32)", unit: "pcs", costPrice: 650, sellingPrice: 999, taxRate: 12, reorderLevel: 10, storeDistribution: "most" },
  { id: "prod-0059", categoryId: "cat-clothing", sku: "CLT-KURTA-L", barcode: "8901000000594", name: "Cotton Kurta (L)", unit: "pcs", costPrice: 380, sellingPrice: 599, taxRate: 5, reorderLevel: 12, storeDistribution: "some" },
  { id: "prod-0060", categoryId: "cat-clothing", sku: "CLT-SAREE-SILK", barcode: "8901000000600", name: "Silk Saree", unit: "pcs", costPrice: 1800, sellingPrice: 2799, taxRate: 5, reorderLevel: 5, storeDistribution: "few" },
  { id: "prod-0061", categoryId: "cat-clothing", sku: "CLT-SOCKS-3PK", barcode: "8901000000617", name: "Ankle Socks 3-Pack", unit: "pcs", costPrice: 75, sellingPrice: 129, taxRate: 5, reorderLevel: 30, storeDistribution: "most" },

  // ── Footwear (cat-footwear) ────────────────────────────────────────────
  { id: "prod-0062", categoryId: "cat-footwear", sku: "FTW-SANDAL-M9", barcode: "8901000000624", name: "Casual Sandals (9)", unit: "pair", costPrice: 320, sellingPrice: 499, taxRate: 18, reorderLevel: 10, storeDistribution: "most" },
  { id: "prod-0063", categoryId: "cat-footwear", sku: "FTW-SNEAKER-10", barcode: "8901000000631", name: "Running Sneakers (10)", unit: "pair", costPrice: 1200, sellingPrice: 1899, taxRate: 18, reorderLevel: 5, storeDistribution: "some" },
  { id: "prod-0064", categoryId: "cat-footwear", sku: "FTW-SLIPPER-8", barcode: "8901000000648", name: "Bathroom Slippers (8)", unit: "pair", costPrice: 80, sellingPrice: 149, taxRate: 18, reorderLevel: 20, storeDistribution: "most" },
  { id: "prod-0065", categoryId: "cat-footwear", sku: "FTW-FORMAL-9", barcode: "8901000000655", name: "Formal Shoes (9)", unit: "pair", costPrice: 1500, sellingPrice: 2299, taxRate: 18, reorderLevel: 5, storeDistribution: "few" },

  // ── Stationery (cat-stationery) ────────────────────────────────────────
  { id: "prod-0066", categoryId: "cat-stationery", sku: "STN-NOTEBOOK-A4", barcode: "8901000000662", name: "Ruled Notebook A4 200pg", unit: "pcs", costPrice: 45, sellingPrice: 75, taxRate: 18, reorderLevel: 30, storeDistribution: "most" },
  { id: "prod-0067", categoryId: "cat-stationery", sku: "STN-PEN-10PK", barcode: "8901000000679", name: "Ballpoint Pen 10-Pack", unit: "pcs", costPrice: 55, sellingPrice: 89, taxRate: 18, reorderLevel: 40, storeDistribution: "most" },
  { id: "prod-0068", categoryId: "cat-stationery", sku: "STN-MARKER-SET", barcode: "8901000000686", name: "Highlighter Marker Set 5pcs", unit: "set", costPrice: 80, sellingPrice: 129, taxRate: 18, reorderLevel: 20, storeDistribution: "some" },
  { id: "prod-0069", categoryId: "cat-stationery", sku: "STN-STAPLER-01", barcode: "8901000000693", name: "Desktop Stapler", unit: "pcs", costPrice: 95, sellingPrice: 149, taxRate: 18, reorderLevel: 15, storeDistribution: "some" },

  // ── Sports (cat-sports) ────────────────────────────────────────────────
  { id: "prod-0070", categoryId: "cat-sports", sku: "SPT-CRICKET-BAT", barcode: "8901000000709", name: "Kashmir Willow Cricket Bat", unit: "pcs", costPrice: 850, sellingPrice: 1399, taxRate: 18, reorderLevel: 5, storeDistribution: "some" },
  { id: "prod-0071", categoryId: "cat-sports", sku: "SPT-FOOTBALL-5", barcode: "8901000000716", name: "Football Size 5", unit: "pcs", costPrice: 380, sellingPrice: 599, taxRate: 18, reorderLevel: 8, storeDistribution: "some" },
  { id: "prod-0072", categoryId: "cat-sports", sku: "SPT-YOGA-MAT", barcode: "8901000000723", name: "Yoga Mat 6mm", unit: "pcs", costPrice: 320, sellingPrice: 499, taxRate: 18, reorderLevel: 10, storeDistribution: "most" },
  { id: "prod-0073", categoryId: "cat-sports", sku: "SPT-SHUTTL-12", barcode: "8901000000730", name: "Badminton Shuttlecock 12-Pack", unit: "pcs", costPrice: 150, sellingPrice: 249, taxRate: 18, reorderLevel: 15, storeDistribution: "some" },
  { id: "prod-0074", categoryId: "cat-sports", sku: "SPT-SKIPPING-R", barcode: "8901000000747", name: "Skipping Rope", unit: "pcs", costPrice: 120, sellingPrice: 199, taxRate: 18, reorderLevel: 15, storeDistribution: "most" },

  // ── Toys (cat-toys) ────────────────────────────────────────────────────
  { id: "prod-0075", categoryId: "cat-toys", sku: "TOY-LEGO-BASIC", barcode: "8901000000754", name: "Building Blocks Set 100pcs", unit: "set", costPrice: 450, sellingPrice: 699, taxRate: 18, reorderLevel: 8, storeDistribution: "some" },
  { id: "prod-0076", categoryId: "cat-toys", sku: "TOY-PUZZLE-500", barcode: "8901000000761", name: "Jigsaw Puzzle 500pcs", unit: "pcs", costPrice: 280, sellingPrice: 449, taxRate: 18, reorderLevel: 10, storeDistribution: "some" },
  { id: "prod-0077", categoryId: "cat-toys", sku: "TOY-REMCAR-01", barcode: "8901000000778", name: "Remote Control Car", unit: "pcs", costPrice: 680, sellingPrice: 1099, taxRate: 18, reorderLevel: 5, storeDistribution: "some" },
  { id: "prod-0078", categoryId: "cat-toys", sku: "TOY-BOARD-LUDO", barcode: "8901000000785", name: "Ludo Board Game", unit: "pcs", costPrice: 120, sellingPrice: 199, taxRate: 18, reorderLevel: 12, storeDistribution: "most" },

  // ── Beauty (cat-beauty) ────────────────────────────────────────────────
  { id: "prod-0079", categoryId: "cat-beauty", sku: "BTY-CREAM-50G", barcode: "8901000000792", name: "Moisturising Face Cream 50g", unit: "pcs", costPrice: 150, sellingPrice: 225, taxRate: 28, reorderLevel: 20, storeDistribution: "most" },
  { id: "prod-0080", categoryId: "cat-beauty", sku: "BTY-LIPSTK-01", barcode: "8901000000808", name: "Matte Lipstick", unit: "pcs", costPrice: 220, sellingPrice: 349, taxRate: 28, reorderLevel: 15, storeDistribution: "most" },
  { id: "prod-0081", categoryId: "cat-beauty", sku: "BTY-NAILP-SET", barcode: "8901000000815", name: "Nail Polish Set 6pcs", unit: "set", costPrice: 180, sellingPrice: 299, taxRate: 28, reorderLevel: 10, storeDistribution: "some" },
  { id: "prod-0082", categoryId: "cat-beauty", sku: "BTY-EYELINER-01", barcode: "8901000000822", name: "Waterproof Eyeliner", unit: "pcs", costPrice: 130, sellingPrice: 199, taxRate: 28, reorderLevel: 15, storeDistribution: "some" },
  { id: "prod-0083", categoryId: "cat-beauty", sku: "BTY-SUNSCR-50", barcode: "8901000000839", name: "Sunscreen SPF 50 100ml", unit: "pcs", costPrice: 180, sellingPrice: 275, taxRate: 18, reorderLevel: 20, storeDistribution: "most" },

  // ── Pet Care (cat-petcare) ─────────────────────────────────────────────
  { id: "prod-0084", categoryId: "cat-petcare", sku: "PET-DOGFD-5KG", barcode: "8901000000846", name: "Dog Food Premium 5kg", unit: "pcs", costPrice: 850, sellingPrice: 1299, taxRate: 18, reorderLevel: 8, storeDistribution: "some" },
  { id: "prod-0085", categoryId: "cat-petcare", sku: "PET-CATFD-3KG", barcode: "8901000000853", name: "Cat Food 3kg", unit: "pcs", costPrice: 650, sellingPrice: 999, taxRate: 18, reorderLevel: 8, storeDistribution: "some" },
  { id: "prod-0086", categoryId: "cat-petcare", sku: "PET-LEASH-MED", barcode: "8901000000860", name: "Dog Leash Medium", unit: "pcs", costPrice: 180, sellingPrice: 299, taxRate: 18, reorderLevel: 10, storeDistribution: "few" },
  { id: "prod-0087", categoryId: "cat-petcare", sku: "PET-SHAMP-500", barcode: "8901000000877", name: "Pet Shampoo 500ml", unit: "pcs", costPrice: 140, sellingPrice: 225, taxRate: 18, reorderLevel: 10, storeDistribution: "few" },

  // ── Additional high-value products for dashboard variety ───────────────
  { id: "prod-0088", categoryId: "cat-appliances", sku: "APL-MICROWAVE-20L", barcode: "8901000000884", name: "Microwave Oven 20L", unit: "pcs", costPrice: 5500, sellingPrice: 7999, taxRate: 18, reorderLevel: 2, storeDistribution: "few" },
  { id: "prod-0089", categoryId: "cat-electronics", sku: "ELC-TABLET-10", barcode: "8901000000891", name: "Android Tablet 10 inch", unit: "pcs", costPrice: 8500, sellingPrice: 12999, taxRate: 18, reorderLevel: 2, storeDistribution: "few" },
  { id: "prod-0090", categoryId: "cat-appliances", sku: "APL-AIRPURIF-01", barcode: "8901000000907", name: "Air Purifier HEPA", unit: "pcs", costPrice: 6500, sellingPrice: 9999, taxRate: 18, reorderLevel: 1, storeDistribution: "few" },
];
