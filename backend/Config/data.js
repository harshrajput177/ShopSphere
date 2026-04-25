const allAttributes = {
    kurti: [
      { name: "Brand", type: "text" },
      { name: "Fabric", type: "select", options: ["Cotton", "Rayon", "Silk"] },
      { name: "Length", type: "select", options: ["Short", "Calf", "Ankle"] },
      { name: "Sleeve", type: "select", options: ["Sleeveless", "Half", "3/4", "Full"] },
      { name: "Occasion", type: "select", options: ["Casual", "Festive", "Party"] },
      { name: "Pattern", type: "select", options: ["Printed", "Embroidered", "Solid"] }
    ],

    saree: [
      { name: "Brand", type: "text" },
      { name: "Fabric", type: "select", options: ["Silk", "Cotton", "Georgette"] },
      { name: "Blouse Piece", type: "select", options: ["Yes", "No"] },
      { name: "Occasion", type: "select", options: ["Wedding", "Party", "Daily"] },
      { name: "Pattern", type: "select", options: ["Printed", "Embroidered"] }
    ],


    top: [
      { name: "Brand", type: "text" },
      { name: "Fabric", type: "select", options: ["Cotton", "Polyester"] },
      { name: "Neck", type: "select", options: ["Round", "V-Neck"] },
      { name: "Sleeve", type: "select", options: ["Sleeveless", "Half", "Full"] }
    ],

    dress: [
      { name: "Brand", type: "text" },
      { name: "Length", type: "select", options: ["Mini", "Midi", "Maxi"] },
      { name: "Fabric", type: "select", options: ["Cotton", "Silk", "Net"] },
      { name: "Occasion", type: "select", options: ["Casual", "Party"] }
    ],


    palazzo: [
      { name: "Brand", type: "text" },
      { name: "Fabric", type: "select", options: ["Cotton", "Rayon"] },
      { name: "Pattern", type: "select", options: ["Solid", "Printed"] }
    ],

    trousers: [
      { name: "Brand", type: "text" },
      { name: "Fit", type: "select", options: ["Slim", "Regular", "Relaxed"] },
      { name: "Fabric", type: "select", options: ["Cotton", "Polyester", "Linen"] },
      { name: "Pattern", type: "select", options: ["Solid", "Checked", "Striped"] },
      { name: "Rise", type: "select", options: ["High", "Mid", "Low"] }
    ],

    // 👗 MIDI DRESS
    mididress: [
      { name: "Brand", type: "text" },
      { name: "Length", type: "select", options: ["Midi"] },
      { name: "Fabric", type: "select", options: ["Cotton", "Chiffon", "Polyester"] },
      { name: "Neck", type: "select", options: ["Round", "V-Neck", "Square"] },
      { name: "Sleeve", type: "select", options: ["Sleeveless", "Half", "Full"] },
      { name: "Occasion", type: "select", options: ["Casual", "Party", "Office"] }
    ],

    // 👚 BLOUSE
    blouse: [
      { name: "Brand", type: "text" },
      { name: "Fabric", type: "select", options: ["Silk", "Cotton", "Net"] },
      { name: "Sleeve Type", type: "select", options: ["Sleeveless", "Half", "Full"] },
      { name: "Neck Design", type: "select", options: ["Round", "Deep Neck", "Boat Neck"] },
      { name: "Padding", type: "select", options: ["Yes", "No"] }
    ],

    // 👰 LEHENGA
    lehenga: [
      { name: "Brand", type: "text" },
      { name: "Fabric", type: "select", options: ["Silk", "Net", "Velvet"] },
      { name: "Work Type", type: "select", options: ["Embroidery", "Mirror Work", "Zari"] },
      { name: "Occasion", type: "select", options: ["Wedding", "Festive"] },
      { name: "Dupatta Included", type: "select", options: ["Yes", "No"] }
    ],

    // 👙 BRA
    bra: [
      { name: "Brand", type: "text" },
      { name: "Cup Size", type: "select", options: ["A", "B", "C", "D"] },
      { name: "Padding", type: "select", options: ["Padded", "Non-Padded"] },
      { name: "Wire", type: "select", options: ["Wired", "Non-Wired"] },
      { name: "Strap Type", type: "select", options: ["Regular", "Transparent", "Convertible"] },
      { name: "Fabric", type: "select", options: ["Cotton", "Lace", "Satin"] }
    ],

    // 🩲 PANTY
    panty: [
      { name: "Brand", type: "text" },
      { name: "Type", type: "select", options: ["Hipster", "Bikini", "Thong", "Boyshort"] },
      { name: "Fabric", type: "select", options: ["Cotton", "Lace", "Microfiber"] },
      { name: "Waist Rise", type: "select", options: ["Low", "Mid", "High"] }
    ],

    // 👘 NIGHTWEAR
    nightwear: [
      { name: "Brand", type: "text" },
      { name: "Fabric", type: "select", options: ["Cotton", "Satin", "Silk"] },
      { name: "Type", type: "select", options: ["Night Suit", "Night Dress"] },
      { name: "Sleeve", type: "select", options: ["Sleeveless", "Half", "Full"] }
    ],


    tshirt: [
      { name: "Brand", type: "text" },
      { name: "Fabric", type: "select", options: ["Cotton", "Polyester", "Blend"] },
      { name: "Fit", type: "select", options: ["Regular", "Slim", "Oversized"] },
      { name: "Sleeve Type", type: "select", options: ["Half", "Full"] },
      { name: "Neck Type", type: "select", options: ["Round", "V-Neck", "Polo"] },
      { name: "Pattern", type: "select", options: ["Solid", "Printed", "Striped"] }
    ],

    shirt: [
      { name: "Brand", type: "text" },
      { name: "Fit", type: "select", options: ["Slim", "Regular"] },
      { name: "Fabric", type: "select", options: ["Cotton", "Linen", "Denim"] },
      { name: "Sleeve", type: "select", options: ["Half", "Full"] },
      { name: "Collar Type", type: "select", options: ["Spread", "Mandarin"] },
      { name: "Pattern", type: "select", options: ["Solid", "Checks", "Printed"] }
    ],

    jeans: [
      { name: "Brand", type: "text" },
      { name: "Fit Type", type: "select", options: ["Slim", "Regular", "Skinny"] },
      { name: "Color", type: "text" },
      { name: "Fabric", type: "select", options: ["Denim", "Stretch Denim"] },
      { name: "Rise", type: "select", options: ["Low", "Mid", "High"] }
    ],

    trouser: [
      { name: "Brand", type: "text" },
      { name: "Fit", type: "select", options: ["Slim", "Regular"] },
      { name: "Fabric", type: "select", options: ["Cotton", "Polyester"] },
      { name: "Pattern", type: "select", options: ["Solid", "Checked"] }
    ],


    // 👖 FORMAL PANTS
    formalpants: [
      { name: "Brand", type: "text" },
      { name: "Fit", type: "select", options: ["Slim", "Regular", "Relaxed"] },
      { name: "Fabric", type: "select", options: ["Cotton", "Polyester", "Blend"] },
      { name: "Length", type: "select", options: ["Ankle", "Full LengtFh"] },
      { name: "Closure", type: "select", options: ["Button", "Zip"] }
    ],

    // 👘 KURTA
    kurta: [
      { name: "Brand", type: "text" },
      { name: "Fabric", type: "select", options: ["Cotton", "Silk", "Linen"] },
      { name: "Length", type: "select", options: ["Short", "Knee Length", "Long"] },
      { name: "Sleeve", type: "select", options: ["Full", "3/4"] },
      { name: "Pattern", type: "select", options: ["Solid", "Printed", "Embroidered"] },
      { name: "Occasion", type: "select", options: ["Casual", "Festive", "Wedding"] }
    ],

    // 👘 SHERWANI (WEDDING)
    sherwani: [
      { name: "Brand", type: "text" },
      { name: "Fabric", type: "select", options: ["Silk", "Velvet", "Brocade"] },
      { name: "Work", type: "select", options: ["Embroidery", "Zari", "Stone Work"] },
      { name: "Occasion", type: "select", options: ["Wedding", "Festive"] },
      { name: "Dupatta Included", type: "select", options: ["Yes", "No"] }
    ],

    // 🤵 SUIT (BLAZER SET)
    suit: [
      { name: "Brand", type: "text" },
      { name: "Fabric", type: "select", options: ["Wool", "Polyester", "Blend"] },
      { name: "Fit", type: "select", options: ["Slim", "Regular"] },
      { name: "Occasion", type: "select", options: ["Formal", "Wedding"] }
    ],

    // 🧥 BLAZER
    blazer: [
      { name: "Brand", type: "text" },
      { name: "Fabric", type: "select", options: ["Wool", "Cotton", "Polyester"] },
      { name: "Fit", type: "select", options: ["Slim", "Regular"] },
      { name: "Closure", type: "select", options: ["Single Breasted", "Double Breasted"] }
    ],

    // 🩲 UNDERWEAR
    underwear: [
      { name: "Brand", type: "text" },
      { name: "Type", type: "select", options: ["Brief", "Boxer", "Trunk"] },
      { name: "Fabric", type: "select", options: ["Cotton", "Microfiber"] },
      { name: "Waistband", type: "select", options: ["Elastic", "Soft Elastic"] }
    ],

    // 👕 INNERWEAR (VEST)
    innerwear: [
      { name: "Brand", type: "text" },
      { name: "Fabric", type: "select", options: ["Cotton", "Ribbed Cotton"] },
      { name: "Neck Type", type: "select", options: ["Round", "V-Neck"] },
      { name: "Sleeve", type: "select", options: ["Sleeveless"] }
    ],

    // 👕 POLO T-SHIRT
    polotshirt: [
      { name: "Brand", type: "text" },
      { name: "Fabric", type: "select", options: ["Cotton", "Polyester"] },
      { name: "Collar", type: "select", options: ["Polo Collar"] },
      { name: "Pattern", type: "select", options: ["Solid", "Striped"] }
    ],

    jacket: [
      { name: "Brand", type: "text" },
      { name: "Material", type: "select", options: ["Leather", "Denim", "Polyester"] },
      { name: "Closure", type: "select", options: ["Zip", "Button"] },
      { name: "Fit", type: "select", options: ["Regular", "Slim"] }
    ],

    hoodie: [
      { name: "Brand", type: "text" },
      { name: "Fabric", type: "select", options: ["Cotton", "Fleece"] },
      { name: "Sleeve", type: "select", options: ["Full"] },
      { name: "Pattern", type: "select", options: ["Solid", "Printed"] }
    ],

    shorts: [
      { name: "Brand", type: "text" },
      { name: "Length", type: "select", options: ["Above Knee", "Knee Length"] },
      { name: "Fabric", type: "select", options: ["Cotton", "Polyester"] }
    ]
};

module.exports = { allAttributes };