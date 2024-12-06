const express = require("express");
const fs = require("fs");
const csvParser = require("csv-parser");

const app = express();
const PORT = 3000;

// Load BIN data from CSV
let binData = [];

fs.createReadStream("./data/bins.csv")
  .pipe(csvParser())
  .on("data", (row) => {
    binData.push(row);
  })
  .on("end", () => {
    console.log("CSV file successfully loaded.");
  });

// API Route to check BIN
app.get("/api/bin-checker/:bin", (req, res) => {
  const bin = req.params.bin;

  // Validate BIN length
  if (!/^\d{6}$/.test(bin)) {
    return res.status(400).json({ error: "Invalid BIN format. Must be 6 digits." });
  }

  // Search BIN in data
  const result = binData.find((entry) => entry.BIN === bin);

  if (result) {
    res.json({
      BIN: result.BIN,
      Brand: result.Brand,
      Type: result.Type,
      Category: result.Category,
      Issuer: result.Issuer,
      IssuerPhone: result.IssuerPhone,
      IssuerUrl: result.IssuerUrl,
      Country: {
        Name: result.CountryName,
        ISO2: result.isoCode2,
        ISO3: result.isoCode3,
      },
    });
  } else {
    res.status(404).json({ error: "BIN not found." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
