"use strict";

// ── TABLEAU BUILT-IN PALETTE LOOKUP ──────────────────────────────────────
const TABLEAU_BUILTIN_PALETTES = {
  "blue_10_0": ["#C7DDEA","#AFCFE1","#97C0D7","#7FAFCA","#689BC0","#5487B1","#4475A0","#356790","#2A5783"],
  "orange_10_0": ["#F3C184", "#F0AE62", "#EE9A42", "#EF882D", "#ED7420", "#E25F1D", "#CC531F", "#B54820", "#9E3D22"],
  "green_10_0": ["#B9D9AF", "#A3CF95", "#8BC57D", "#74BA67", "#5DAA56", "#4D984B", "#3D8743", "#31773F", "#24693D"],
  "red_10_0": ["#F3B8AB", "#EEA08E", "#EA8972", "#E9725B", "#EA5C4C", "#E6453C", "#D92C34", "#C71532", "#AE123A"],
  "purple_10_0": ["#ECC6E3", "#E2BCD8", "#D7AFCA", "#CB9FBC", "#BB85A8", "#AC759B", "#9F6B93", "#8E5B86", "#7C4D79"],
  "brown_10_0": ["#E8D5B4","#DEBE8A","#D8A66B","#D08F57","#C97A4B","#BF6740","#B45539","#AA4435","#9F3632"],
  "gray_10_0": ["#E5E5E5","#D4D6D8","#C0C4C8","#AAB0B6","#959DA5","#818A94","#6D7782","#5B6470","#49525E"],
  "gray_warm_10_0": ["#D8D1CE","#CBC2BE","#BBB0AB","#AB9F9A","#9A8E89","#887C77","#776B67","#685D59","#59504E"],
  "blue_teal_10_0": ["#B7D7D1","#9BC9C7","#80BBC0","#67ACC0","#529DBA","#448DAF","#3A7D9F","#336C91","#2C5985"],
  "orange_gold_10_0": ["#E8C85E","#EDB657","#F0A54A","#F08F32","#EF791F","#E96418","#D5531D","#BA4522","#9E3A26"],
  "green_gold_10_0": ["#E5C75A","#CDBE58","#B1B953","#97B64F","#7FB255","#67A957","#529B53","#348347","#146C36"],
  "red_gold_10_0": ["#E8C85A","#EDA951","#F08C4B","#EC7247","#E65E47","#DF4D47","#D33A45","#C32942","#B71D3E"],
  "orange_blue_diverging_10_0": ["#9E3D22","#B54820","#CC531F","#E25F1D","#ED7420","#F3D9BE","#97C0D7","#689BC0","#4475A0","#356790","#2B5C8A"],
  "red_green_diverging_10_0": ["#AE123A","#C61E3F","#D93443","#E94F4A","#F07A66","#F2B3A3","#8BC97D","#6DB65F","#539F50","#3B8447","#24693D"],
  "green_blue_diverging_10_0": ["#24693D","#347D46","#4E9854","#72B464","#9BCF89","#D4DDD9","#A9C9DC","#7DAACE","#5C8FBC","#4373A0","#2A5783"],
  "red_blue_diverging_10_0": ["#A90C38","#C71F3E","#DC393F","#EB5A4F","#F3A091","#E7E2DE","#B8D1E1","#86B0D1","#5F90BC","#44709C","#2E5A87"],
  "red_black_10_0": ["#AE123A","#C71F3E","#DC393F","#EB5A4F","#F3A091","#DDD9D5","#B9BCBC","#969DA1","#78818A","#606A75","#49525E"],
  "gold_purple_diverging_10_0": ["#AD9024","#B89B34","#C6AA50","#D3BA6D","#DDC892","#E3D7D1","#D7C1D2","#C9A5C3","#BB8AB2","#AC7299"],
  "red_green_gold_diverging_10_0": ["#BE2A3E","#D44344","#E75D49","#F07A47","#F2A14A","#E7C65A","#A8BE5E","#77AF5B","#55994E","#3B8746","#22763F"],
  "sunrise_sunset_diverging_10_0": ["#33608C","#556AA0","#7B67A6","#A664A2","#CD6C95","#EC7C79","#F2B15A","#ED8D46","#E56B44","#D24844","#B81840"],
  "orange_blue_white_diverging_10_0": ["#9E3D22","#B94B20","#D45A1D","#EC7420","#F3B562","#F5F1EC","#C6DDEA","#93BED8","#679BC1","#4677A5","#2B5C8A"],
  "red_green_white_diverging_10_0": ["#AE123A","#C8243F","#DC4947","#ED725E","#F3A38F","#F3F1EE","#B9DFAF","#8BC57D","#5DAA56","#3F8847","#24693D"],
  "green_blue_white_diverging_10_0": ["#24693D","#3E864B","#5BA557","#82C06F","#B7DFAE","#F2F3F1","#C7DDEA","#97C0D7","#689BC0","#4475A0","#2A5783"],
  "red_blue_white_diverging_10_0": ["#A90C38","#C71F3E","#DC393F","#EB5A4F","#F3A091","#F4F3F2","#C6DDEA","#93BED8","#679BC1","#4677A5","#2E5A87"],
  "red_black_white_diverging_10_0": ["#AE123A","#C8243F","#DC4947","#ED725E","#F3A38F","#F3F2F1","#D0D2D1","#A7ADB0","#838C93","#626C77","#49525E"],
  "tableau-blue-light": ["#EEF2F7","#E7EDF5","#DFE8F3","#D8E2F0","#D1DDEE","#CBD9ED","#C9D7F1","#C7D9F2","#C4D8F3"],
  "tableau-orange-light": ["#F6F2EE","#F7EBDD","#F8E3CC","#F9DBBE","#FAD5B3","#FBCFA8","#FCCB9F","#FFCC9E","#FFCC9E"],
  "tableau-orange-blue-light": ["#FFCC9E","#FAD1AB","#F4D8BC","#EEE0CC","#EAE4D8","#E8E8E8","#DFE7EF","#D5E0EC","#CBD9E9","#C7D9F1","#C4D8F3"],
  "tableau-map-blue-green": ["#F5F5C8","#EEF2B3","#E0EA9A","#CBE18F","#AFD695","#91CC9D","#72C3A8","#58BCB5","#41B7C4"],
  "tableau-map-temperatur": ["#529985","#669C76","#81A364","#A6B04E","#D2C63F","#F0D347","#F2C04A","#E7A24A","#D4824D","#C26B51"]
};

// ── HELPER: Get built-in palette colors by name ──────────────────────────
function getBuiltInPaletteColors(paletteName) {
  if (!paletteName) return null;
  
  if (TABLEAU_BUILTIN_PALETTES[paletteName]) {
    return TABLEAU_BUILTIN_PALETTES[paletteName];
  }
  
  const lowerName = paletteName.toLowerCase();
  for (const [key, colors] of Object.entries(TABLEAU_BUILTIN_PALETTES)) {
    if (key.toLowerCase() === lowerName) {
      return colors;
    }
  }
  
  const normalized = paletteName.toLowerCase().replace(/[-\s]+/g, '');
  for (const [key, colors] of Object.entries(TABLEAU_BUILTIN_PALETTES)) {
    const keyNormalized = key.toLowerCase().replace(/[-\s]+/g, '');
    if (keyNormalized.includes(normalized) || normalized.includes(keyNormalized)) {
      return colors;
    }
  }
  
  return null;
}

const AUTOMATIC_PALETTE_BY_MARK = {
  automatic:    "blue_teal_10_0",
  bar:          "blue_10_0",
  line:         "blue_10_0",
  area:         "blue_teal_10_0",
  square:       "blue_teal_10_0",
  circle:       "blue_10_0",
  shape:        "blue_10_0",
  text:         "blue_10_0",
  map:          "blue_teal_10_0",
  multipolygon: "blue_teal_10_0",
  pie:          "blue_10_0",
  ganttbar:     "blue_10_0",
  polygon:      "blue_10_0",
  density:      "blue_10_0",
  heatmap:      "blue_10_0"
};
const DEFAULT_AUTOMATIC_PALETTE = "blue_10_0";

function getAutomaticPaletteForMark(markClass) {
  const key = String(markClass || "Automatic").toLowerCase().replace(/[\s_-]+/g, "");
  const name = AUTOMATIC_PALETTE_BY_MARK[key] || DEFAULT_AUTOMATIC_PALETTE;
  if (!AUTOMATIC_PALETTE_BY_MARK[key]) {
    console.log(`[Auto Palette] Mark type "${markClass}" not in table, using ${name}`);
  }
  return {
    name,
    colors: TABLEAU_BUILTIN_PALETTES[name].map(c => "FF" + c.replace("#", "").toUpperCase())
  };
}


(function () {

  /* ── Layout constants ─────────────────────────────────────────────────── */
  const PX_PER_COL  = 90;
  const PX_PER_ROW  = 22;
  const TITLE_ROWS  = 1;
  const COL_GAP     = 0;  
  const ROW_GAP     = 1;  
  const ROW_GROUP_THRESHOLD = 8;

  /* ── KPI Detection ─────────────────────────────────────────────────────── */
  function isKPICard(worksheet, summaryData) {
    if (!summaryData || !summaryData.data) return false;
    
    const rowCount = summaryData.data.length;
    const colCount = summaryData.columns?.length || 0;
    
    if (rowCount === 1 && colCount >= 2 && colCount <= 8) return true;
    
    return false;
  }

  function getExcelColumnName(colIndex) {
    let columnName = "";
    let dividend = colIndex + 1;

    while (dividend > 0) {
      let modulo = (dividend - 1) % 26;
      columnName = String.fromCharCode(65 + modulo) + columnName;
      dividend = Math.floor((dividend - modulo) / 26);
    }

    return columnName;
  }

  async function fetchAllSheetsData(sheets, concurrency = 4) {
  const results = [];
  const queue = [...sheets];
  
  async function worker() {
    while (queue.length) {
      const sheet = queue.shift();
      try {
        const data = await sheet.getSummaryDataAsync();
        results.push({ sheet, data, error: null });
      } catch (err) {
        results.push({ sheet, data: null, error: err });
      }
    }
  }
  
  const workers = Array(concurrency).fill().map(() => worker());
  await Promise.all(workers);
  return results;
}

  /* ── Range tracker ────────────────────────────────────────────────────── */
  function makeRangeTracker() {
    let minR = Infinity, minC = Infinity, maxR = 0, maxC = 0;
    return {
      update(r, c) {
        if (r < minR) minR = r;
        if (c < minC) minC = c;
        if (r > maxR) maxR = r;
        if (c > maxC) maxC = c;
      },
      toRange() {
        return {
          s: { r: minR === Infinity ? 0 : minR, c: minC === Infinity ? 0 : minC },
          e: { r: maxR, c: maxC },
        };
      },
    };
  }

  /* ── Color Helper Functions ──────────────────────────────────────────── */
  function getCategoryColorMap() {
    try {
      const saved = tableau.extensions.settings.get("twbCategoryColorMap");
      if (!saved) return {};
      return JSON.parse(saved);
    } catch (err) {
      console.warn("[getCategoryColorMap] Could not read settings:", err.message);
      return {};
    }
  }

  function isNumeric(value) {
    if (value === null || value === undefined) return false;
    
    const cleaned = String(value)
      .replace(/,/g, "")
      .replace(/%/g, "")
      .trim();
    
    return cleaned !== "" && !isNaN(Number(cleaned));
  }

  function shouldSkipConditionalFormatting(columnName, value, fieldRole = null) {
    if (!columnName) return false;
    
    const lowerColName = columnName.toLowerCase();
    
    const categoricalKeywords = [
      'year', 'quarter', 'month', 'date', 'time', 
      'category', 'region', 'product', 'name', 'id',
      'country', 'city', 'state', 'department', 'type',
      'status', 'group', 'segment', 'class'
    ];
    
    const geoKeywords = [
      'latitude', 'lat', 'latitud', 'ycoord', 'y_coord',
      'longitude', 'long', 'lon', 'longitud', 'xcoord', 'x_coord',
      'location', 'geo', 'geography', 'coordinates', 'coords',
      'postal', 'zip', 'zipcode', 'postcode', 'address'
    ];
    
    for (const keyword of geoKeywords) {
      if (lowerColName.includes(keyword)) {
        console.log(`🗺️ Skipping conditional formatting for geographic column: "${columnName}"`);
        return true;
      }
    }
    
    for (const keyword of categoricalKeywords) {
      if (lowerColName.includes(keyword)) {
        return true;
      }
    }
    
    if (value !== undefined && value !== null) {
      const strValue = String(value).trim();
      const numValue = parseFloat(strValue);
      
      if (!isNaN(numValue)) {
        if (lowerColName.includes('lat') && numValue >= -90 && numValue <= 90) {
          console.log(`🗺️ Skipping conditional formatting for latitude column: "${columnName}" (value: ${numValue})`);
          return true;
        }
        
        if (lowerColName.includes('lon') && numValue >= -180 && numValue <= 180) {
          console.log(`🗺️ Skipping conditional formatting for longitude column: "${columnName}" (value: ${numValue})`);
          return true;
        }
        
        if (lowerColName.match(/lat/i) && numValue >= -90 && numValue <= 90) {
          console.log(`🗺️ Skipping conditional formatting for geographic coordinate column: "${columnName}"`);
          return true;
        }
        
        if (lowerColName.match(/lon/i) && numValue >= -180 && numValue <= 180) {
          console.log(`🗺️ Skipping conditional formatting for geographic coordinate column: "${columnName}"`);
          return true;
        }
      }
      
      if (/^\d{4}$/.test(strValue)) {
        const yearNum = parseInt(strValue, 10);
        if (yearNum >= 1900 && yearNum <= 2100) {
          return true;
        }
      }
    }
    
    return false;
  }

  function isGeographicCoordinate(value, columnName) {
    if (!isNumeric(value)) return false;
    
    const lowerColName = columnName.toLowerCase();
    const numValue = parseFloat(String(value).trim());
    
    if (lowerColName.includes('latitude') || lowerColName.includes('lat')) {
      return numValue >= -90 && numValue <= 90;
    }
    
    if (lowerColName.includes('longitude') || lowerColName.includes('lon')) {
      return numValue >= -180 && numValue <= 180;
    }
    
    if (numValue >= -90 && numValue <= 90 && (lowerColName.includes('coord') || lowerColName.includes('geo'))) {
      return true;
    }
    
    if ((numValue >= -180 && numValue <= -90) || (numValue >= 90 && numValue <= 180)) {
      if (lowerColName.includes('coord') || lowerColName.includes('geo')) {
        return true;
      }
    }
    
    return false;
  }

  function isNumericForFormatting(value, columnName) {
    if (!isNumeric(value)) return false;
    
    if (columnName) {
      const strValue = String(value).trim();
      if (/^\d{4}$/.test(strValue)) {
        const yearNum = parseInt(strValue, 10);
        if (yearNum >= 1900 && yearNum <= 2100) {
          return false;
        }
      }
      
      if (isGeographicCoordinate(value, columnName)) {
        return false;
      }
    }
    
    return true;
  }

  function getZeroCenteredColor(value, maxAbs) {
    if (maxAbs === 0) {
      return "FFFFFF";
    }
    
    const intensity = Math.min(Math.abs(value) / maxAbs, 1);
    
    let r = 255;
    let g = 255;
    let b = 0;
    
    if (value > 0) {
      r = Math.round(255 * (1 - intensity));
      g = 255;
      b = Math.round(100 * (1 - intensity));
    } else if (value < 0) {
      r = 255;
      g = Math.round(255 * (1 - intensity));
      b = Math.round(100 * (1 - intensity));
    }
    
    return (
      "FF" +
      r.toString(16).padStart(2, "0") +
      g.toString(16).padStart(2, "0") +
      b.toString(16).padStart(2, "0")
    ).toUpperCase();
  }

  /* ── FALLBACK: Hardcoded conditional formatting (only used if no XML colors) ── */
  function applyConditionalFormattingToTable(worksheet, rows, headers, startRow, startCol, colWidths) {
    headers.forEach((header, colIndex) => {
      const columnName = header.fieldName || header.fieldId || `Column_${colIndex + 1}`;
      const firstValue = rows[0]?.[colIndex]?.formattedValue || rows[0]?.[colIndex]?.value;
      
      let shouldSkip = shouldSkipConditionalFormatting(columnName, firstValue);
      
      if (shouldSkip) {
        console.log(`⚠️ Skipping conditional formatting for column: "${columnName}"`);
        return;
      }
      
      const numericValues = [];
      
      rows.forEach(row => {
        const value = row[colIndex]?.formattedValue || row[colIndex]?.value;
        if (isNumericForFormatting(value, columnName)) {
          let numValue = String(value).replace(/,/g, "").replace(/%/g, "");
          numericValues.push(parseFloat(numValue));
        }
      });
      
      if (numericValues.length === 0) return;
      
      const maxAbs = Math.max(...numericValues.map(v => Math.abs(v)));
      
      rows.forEach((row, rowIndex) => {
        const rawValue = row[colIndex]?.formattedValue || row[colIndex]?.value;
        
        if (!isNumericForFormatting(rawValue, columnName)) return;
        
        let numValue = String(rawValue).replace(/,/g, "").replace(/%/g, "");
        const value = parseFloat(numValue);
        
        const excelRow = startRow + rowIndex;
        const excelCol = startCol + colIndex;
        const cell = worksheet.getCell(excelRow + 1, excelCol + 1);
        
        const color = getZeroCenteredColor(value, maxAbs);
        
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: color }
        };
      });
    });
  }

  /* ── Filter Extraction ─────────────────────────────────────────────────── */
  async function extractFilterValuesPerField(sheets) {
    const filterMap = new Map();
    
    for (const worksheet of sheets) {
      let filters = [];
      
      try {
        filters = await worksheet.getFiltersAsync();
      } catch (e) {
        console.warn(`Could not get filters for ${worksheet.name}:`, e);
        continue;
      }
      
      filters.forEach(filter => {
        const ignoredFields = ["Measure Names", "Measure Values"];
        if (ignoredFields.includes(filter.fieldName) || /^Month\(/i.test(filter.fieldName)) {
          return;
        }
        
        if (!filterMap.has(filter.fieldName)) {
          filterMap.set(filter.fieldName, {
            values: new Set(),
            worksheetNames: new Set()
          });
        }
        
        const filterData = filterMap.get(filter.fieldName);
        filterData.worksheetNames.add(worksheet.name);
        
        let value = "";
        
        if (filter.filterType === "categorical") {
          const appliedValues = (filter.appliedValues || []).map(v => v.formattedValue);
          appliedValues.forEach(v => filterData.values.add(v));
          value = appliedValues.join(", ");
        } else if (filter.filterType === "range") {
          value = (filter.minValue?.formattedValue || "") + " - " + (filter.maxValue?.formattedValue || "");
          filterData.values.add(value);
        } else {
          value = filter.filterType;
          filterData.values.add(value);
        }
      });
    }
    
    const result = {};
    for (const [fieldName, data] of filterMap.entries()) {
      result[fieldName] = Array.from(data.values);
    }
    
    return result;
  }

  /* ── Check if worksheet is a filter value table ───────────────────────── */
  function isFilterValueWorksheet(sheetName, summaryData) {
    if (/filter[_\- ]?\d+/i.test(sheetName) || 
        /values[_\- ]?\d+/i.test(sheetName) ||
        /_filter_\d+/i.test(sheetName)) {
      return true;
    }
    
    if (summaryData && summaryData.columns && summaryData.columns.length === 1) {
      const firstColumnName = summaryData.columns[0]?.fieldName || "";
      if (firstColumnName === "Values" || firstColumnName === "VALUE") {
        return true;
      }
    }
    
    return false;
  }

  /* ── Write Individual Filter Value Table ──────────────────────────────── */
  function writeIndividualFilterTable(worksheet, filterName, filterValues, originRow, originCol, rangeTracker) {
    let r = originRow;
    const C = originCol;

    let cleanName = filterName.replace(/_(Filter|filter)_\d+$/, '');
    cleanName = cleanName.replace(/_(Values|values)_\d+$/, '');

    titleCell(worksheet, r, C, `📋 ${cleanName}`);
    rangeTracker.update(r, C);
    r++;

    tableHeaderCell(worksheet, r, C, "SELECTED VALUE(S)");
    rangeTracker.update(r, C);
    r++;

    const values = Array.isArray(filterValues) ? filterValues : [filterValues];
    values.forEach((value, idx) => {
      tableDataCell(worksheet, r + idx, C, value, idx);
      rangeTracker.update(r + idx, C);
    });

    return 2 + values.length;
  }

  /* ── ExcelJS Cell Styling Functions ───────────────────────────────────── */
  function setCellValue(worksheet, row, col, value, options = {}) {
    const cell = worksheet.getCell(row + 1, col + 1);
    
    if (typeof value === 'number') {
      cell.value = value;
    } else {
      cell.value = value;
    }
    
    cell.font = {
      bold: options.bold || false,
      size: options.size || 11,
      name: 'Calibri',
      italic: options.italic || false
    };
    
    if (options.color) {
      cell.font.color = { argb: options.color };
    }
    
    cell.alignment = {
      vertical: 'center',
      horizontal: options.align || 'left',
      wrapText: options.wrapText || false
    };
    
    if (options.bgColor) {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: options.bgColor }
      };
    }
    
    if (options.border) {
      cell.border = options.border;
    }
  }

  const thinBorder = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' }
  };
  
  const thickBorder = {
    top: { style: 'medium' },
    left: { style: 'medium' },
    bottom: { style: 'medium' },
    right: { style: 'medium' }
  };

  function dashboardTitleCell(worksheet, row, col, value) {
    setCellValue(worksheet, row, col, value, {
      bold: true,
      size: 18,
      color: "FF1A73E8",
      align: "center",
      border: thickBorder
    });
  }

  function subtitleCell(worksheet, row, col, value) {
    setCellValue(worksheet, row, col, value, {
      bold: false,
      size: 11,
      color: "FF666666",
      align: "center"
    });
  }

  function titleCell(worksheet, row, col, value) {
    setCellValue(worksheet, row, col, value, {
      bold: true,
      size: 12,
      bgColor: "FFE8F0FE",
      align: "center",
      border: thickBorder
    });
  }

  function kpiLabelCell(worksheet, row, col, value) {
    setCellValue(worksheet, row, col, value, {
      bold: true,
      size: 11,
      bgColor: "FFF5F5F5",
      align: "left",
      border: thinBorder
    });
  }

  function kpiValueCell(worksheet, row, col, value) {
    let color = null;
    const valueStr = String(value);
    if (valueStr.includes('%')) {
      const numMatch = valueStr.match(/([+-]?\d+(?:\.\d+)?)/);
      if (numMatch) {
        const num = parseFloat(numMatch[1]);
        if (num > 0) color = "FF00AA00";
        if (num < 0) color = "FFFF0000";
      }
    }
    setCellValue(worksheet, row, col, value, {
      bold: true,
      size: 12,
      align: "right",
      color: color,
      border: thinBorder
    });
  }

  function tableHeaderCell(worksheet, row, col, value) {
    setCellValue(worksheet, row, col, value, {
      bold: true,
      size: 11,
      bgColor: "FF1A73E8",
      color: "FFFFFFFF",
      align: "center",
      border: thinBorder,
      wrapText: true
    });
  }

  function tableDataCell(worksheet, row, col, value, rowIndex = 0) {
    const bgColor = (rowIndex % 2 === 0) ? null : "FFF9F9F9";
    setCellValue(worksheet, row, col, value, {
      align: "left",
      size: 11,
      bgColor: bgColor,
      border: thinBorder,
      wrapText: true
    });
  }

  function writeDashboardTitle(worksheet, dashboardName, exportDate, originRow, originCol, rangeTracker) {
    let r = originRow;
    const C = originCol;
    
    dashboardTitleCell(worksheet, r, C, dashboardName);
    worksheet.mergeCells(r + 1, C + 1, r + 1, C + 5);
    rangeTracker.update(r, C);
    rangeTracker.update(r, C + 4);
    r++;
    
    subtitleCell(worksheet, r, C, `Exported on: ${exportDate}`);
    worksheet.mergeCells(r + 1, C + 1, r + 1, C + 5);
    rangeTracker.update(r, C);
    rangeTracker.update(r, C + 4);
    r++;
    
    r++;
    
    return r - originRow;
  }

  /* =============================================================================
   * parseTwbXmlInBrowser(xmlString) - Parses TITLES from XML
   * ============================================================================= */
  function parseTwbXmlInBrowser(xmlString) {
    const doc = new DOMParser().parseFromString(xmlString, "text/xml");
    const titleMap = {};

    const worksheetNodes = doc.getElementsByTagName("worksheet");

    for (let i = 0; i < worksheetNodes.length; i++) {
      const wsNode = worksheetNodes[i];
      const internalName = wsNode.getAttribute("name");
      if (!internalName) continue;

      const layoutNode = getDirectChildByTag(wsNode, "layout-options")
                      || getDirectChildByTag(wsNode, "layout");
      if (!layoutNode) continue;

      const titleNode = getDirectChildByTag(layoutNode, "title");
      if (!titleNode) continue;

      const fmtNode = titleNode.getElementsByTagName("formatted-text")[0];
      if (!fmtNode) continue;

      const runNodes = fmtNode.getElementsByTagName("run");
      const displayTitle = Array.from(runNodes)
        .map(r => r.textContent || "")
        .join("")
        .trim();

      if (displayTitle) {
        titleMap[internalName] = displayTitle;
        console.log(`[TWB parse] Title: "${internalName}" → "${displayTitle}"`);
      }
    }

    return titleMap;
  }

  function getDirectChildByTag(parent, tagName) {
    for (let i = 0; i < parent.childNodes.length; i++) {
      const child = parent.childNodes[i];
      if (child.nodeType === 1 && child.tagName === tagName) return child;
    }
    return null;
  }

  /* =============================================================================
   * parseColorsFromXml() - Parses BOTH gradient AND category colors from XML
   * This handles:
   *   1. Gradient color palettes (for numerical values like Amount, Boxes Shipped)
   *   2. Category color mappings (for categorical values like Country, Sales Person, Ship Mode)
   * ============================================================================= */
  function parseColorsFromXml(xmlString) {
    console.log(`[Color Parser] ==========================================`);
    console.log(`[Color Parser] Extracting ALL colors from XML...`);
    console.log(`[Color Parser] XML length: ${xmlString.length} characters`);
    
    const colorMap = {};
    const categoryColorMap = {};
    
    // ── PART 1: Find all worksheets and parse their colors ──
    const worksheetRegex = /<worksheet[^>]*name=['"]([^'"]+)['"][\s\S]*?<\/worksheet>/gi;
    let wsMatch;
    
    while ((wsMatch = worksheetRegex.exec(xmlString)) !== null) {
      const sheetName = wsMatch[1];
      const worksheetContent = wsMatch[0];
      
      console.log(`[Color Parser] Processing sheet: "${sheetName}"`);
      
      const sheetColors = {};
      
      // ── STEP 1: FIRST, detect which columns have color applied (visibility) ──
      const visibleColorFields = [];
      const encodingsRegex = /<encodings>([\s\S]*?)<\/encodings>/i;
      const encodingsMatch = encodingsRegex.exec(worksheetContent);
      
      if (encodingsMatch) {
        const encodingsContent = encodingsMatch[1];
        const colorTagRegex = /<color\s+column=['"]([^'"]+)['"]/gi;
        let colorMatch;
        
        while ((colorMatch = colorTagRegex.exec(encodingsContent)) !== null) {
          const columnField = colorMatch[1];
          let columnName = "Unknown";
          const nameMatch = columnField.match(/\[.*?:(.*?):/);
          if (nameMatch && nameMatch[1]) {
            columnName = nameMatch[1];
          } else {
            const simpleMatch = columnField.match(/\[(.*?)\]/);
            if (simpleMatch && simpleMatch[1]) {
              columnName = simpleMatch[1];
            }
          }
          visibleColorFields.push({
            columnName: columnName,
            field: columnField
          });
        }
      }
      
      console.log(`[Color Parser]   Columns with color applied: ${visibleColorFields.map(f => f.columnName).join(', ') || 'None'}`);
      
      // ── STEP 2: Find color encodings in <style> section ──
      const styleRegex = /<style>([\s\S]*?)<\/style>/i;
      const styleMatch = styleRegex.exec(worksheetContent);
      
      if (styleMatch) {
        const styleContent = styleMatch[1];
        
        // Find ALL color encodings (including self-closing)
        const encodingRegex = /<encoding[^>]*attr=['"]color['"][^>]*>/gi;
        let encodingMatch;
        let encodingCount = 0;
        
        while ((encodingMatch = encodingRegex.exec(styleContent)) !== null) {
          const fullEncodingTag = encodingMatch[0];
          encodingCount++;
          
          // Extract field from the encoding tag
          const fieldMatch = fullEncodingTag.match(/field=['"]([^'"]+)['"]/i);
          if (!fieldMatch) continue;
          const field = fieldMatch[1];
          
          // Extract column name from field
          let columnName = "Unknown";
          const nameMatch = field.match(/\[.*?:(.*?):/);
          if (nameMatch && nameMatch[1]) {
            columnName = nameMatch[1];
          } else {
            const simpleMatch = field.match(/\[(.*?)\]/);
            if (simpleMatch && simpleMatch[1]) {
              columnName = simpleMatch[1];
            }
          }
          
          console.log(`[Color Parser]   Found gradient encoding #${encodingCount}: column="${columnName}"`);
          
          // ── STEP 3: Check if this column has color applied in the view ──
          const hasColorApplied = visibleColorFields.some(v => 
            v.columnName === columnName || 
            v.columnName.includes(columnName) || 
            columnName.includes(v.columnName)
          );
          
          if (!hasColorApplied) {
            console.log(`[Color Parser]     ⏭️ Column "${columnName}" does NOT have color applied in view - skipping`);
            continue;
          }
          
          console.log(`[Color Parser]     ✅ Column "${columnName}" HAS color applied in view - processing colors`);
          
          const colors = [];
          let colorSource = 'none';
          let paletteName = null;
          let isCustomPalette = false;
          
          // ── STEP 4A: Check if this is a CUSTOM palette (has <color-palette> with explicit colors) ──
          // Priority 1: CUSTOM PALETTE
          const isSelfClosing = fullEncodingTag.trim().endsWith('/>');
          
          if (!isSelfClosing) {
            const encodingBlockRegex = new RegExp(`<encoding[^>]*field=['"]${field.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"][^>]*>([\\s\\S]*?)<\\/encoding>`, 'i');
            const encodingBlockMatch = encodingBlockRegex.exec(styleContent);
            
            if (encodingBlockMatch) {
              const encodingContent = encodingBlockMatch[1];
              
              const colorPaletteRegex = /<color-palette[^>]*>([\s\S]*?)<\/color-palette>/i;
              const colorPaletteMatch = colorPaletteRegex.exec(encodingContent);
              
              if (colorPaletteMatch) {
                const paletteContent = colorPaletteMatch[1];
                
                const colorRegex = /<color>#?([0-9a-fA-F]{6})<\/color>/gi;
                let colorMatch;
                
                while ((colorMatch = colorRegex.exec(paletteContent)) !== null) {
                  const hexColor = "FF" + colorMatch[1].toUpperCase();
                  colors.push(hexColor);
                }
                
                if (colors.length > 0) {
                  isCustomPalette = true;
                  colorSource = 'custom';
                  console.log(`[Color Parser]     ✅ CUSTOM PALETTE: Found ${colors.length} explicit colors`);
                }
              }
            }
          }
          
          // ── STEP 4B: If NOT custom, check if it's a BUILT-IN palette (has palette='xxx') ──
          // Priority 2: BUILT-IN PALETTE (INTERPOLATED)
          if (!isCustomPalette && colors.length === 0) {
            const paletteAttrRegex = /palette=['"]([^'"]+)['"]/i;
            const paletteAttrMatch = paletteAttrRegex.exec(fullEncodingTag);
            
            if (paletteAttrMatch) {
              paletteName = paletteAttrMatch[1];
              console.log(`[Color Parser]     Looking up built-in palette: "${paletteName}"`);
              
              if (paletteName.toLowerCase() === 'automatic') {
                console.log(`[Color Parser]     ⏭️ "automatic" - will use fallback`);
                continue;
              }
              
              const paletteColors = getBuiltInPaletteColors(paletteName);
              if (paletteColors) {
                paletteColors.forEach(c => {
                  const hexColor = c.startsWith('#') ? "FF" + c.substring(1).toUpperCase() : "FF" + c.toUpperCase();
                  colors.push(hexColor);
                });
                colorSource = 'builtin';
                console.log(`[Color Parser]     ✅ BUILT-IN PALETTE: Found ${colors.length} colors for "${paletteName}"`);
              } else {
                console.log(`[Color Parser]     ⚠️ Unknown built-in palette: "${paletteName}"`);
              }
            }
          }
          
          // ── STEP 4C: If still no colors, try by type ──
          // Priority 3: TYPE-BASED FALLBACK
          if (!isCustomPalette && colors.length === 0) {
            const typeAttrRegex = /type=['"]([^'"]+)['"]/i;
            const typeAttrMatch = typeAttrRegex.exec(fullEncodingTag);
            
            if (typeAttrMatch) {
              const paletteType = typeAttrMatch[1];
              console.log(`[Color Parser]     Trying to map by type: "${paletteType}"`);
              
              if (paletteType === 'interpolated' || paletteType === 'ordered-diverging') {
                const defaultColors = getBuiltInPaletteColors('ordered-diverging');
                if (defaultColors) {
                  defaultColors.forEach(c => {
                    const hexColor = c.startsWith('#') ? "FF" + c.substring(1).toUpperCase() : "FF" + c.toUpperCase();
                    colors.push(hexColor);
                  });
                  colorSource = 'type-fallback';
                  console.log(`[Color Parser]     ✅ Using default ordered-diverging (${colors.length} colors)`);
                }
              } else if (paletteType === 'ordered-sequential') {
                const defaultColors = getBuiltInPaletteColors('ordered-sequential');
                if (defaultColors) {
                  defaultColors.forEach(c => {
                    const hexColor = c.startsWith('#') ? "FF" + c.substring(1).toUpperCase() : "FF" + c.toUpperCase();
                    colors.push(hexColor);
                  });
                  colorSource = 'type-fallback';
                  console.log(`[Color Parser]     ✅ Using default ordered-sequential (${colors.length} colors)`);
                }
              } else if (paletteType === 'categorical') {
                const defaultColors = getBuiltInPaletteColors('tableau10');
                if (defaultColors) {
                  defaultColors.forEach(c => {
                    const hexColor = c.startsWith('#') ? "FF" + c.substring(1).toUpperCase() : "FF" + c.toUpperCase();
                    colors.push(hexColor);
                  });
                  colorSource = 'type-fallback';
                  console.log(`[Color Parser]     ✅ Using default tableau10 (${colors.length} colors)`);
                }
              }
            }
          }
          
          if (colors.length === 0) {
            console.log(`[Color Parser]     ⚠️ No colors found - will use fallback`);
            continue;
          }
          
          console.log(`[Color Parser]     ✅ Stored ${colors.length} colors for "${columnName}" (source: ${colorSource})`);
          
          // Store gradient colors
          sheetColors[columnName] = {
            colors: colors,
            field: field,
            type: 'gradient',
            source: colorSource,
            paletteName: paletteName || null,
            isCustom: isCustomPalette
          };
        }
      }
      
      // ── PART 3: Parse DATASOURCE-LEVEL category colors (UNCHANGED) ──
      const datasourceRegex = /<datasource[^>]*name=['"]([^'"]+)['"][\s\S]*?<\/datasource>/gi;
      let dsMatch;
      
      while ((dsMatch = datasourceRegex.exec(xmlString)) !== null) {
        const datasourceName = dsMatch[1];
        const datasourceContent = dsMatch[0];
        
        const dsStyleRegex = /<style>([\s\S]*?)<\/style>/i;
        const dsStyleMatch = dsStyleRegex.exec(datasourceContent);
        
        if (!dsStyleMatch) continue;
        
        const dsStyleContent = dsStyleMatch[1];
        
        const categoryEncodingRegex = /<encoding[^>]*attr=['"]color['"][^>]*field=['"]([^'"]+)['"][\s\S]*?type=['"]([^'"]+)['"][\s\S]*?>([\s\S]*?)<\/encoding>/gi;
        let catMatch;
        
        while ((catMatch = categoryEncodingRegex.exec(dsStyleContent)) !== null) {
          const field = catMatch[1];
          const paletteType = catMatch[2];
          const encodingContent = catMatch[3];
          
          const hasMapTags = /<map\s+to=/i.test(encodingContent);
          if (!hasMapTags) continue;
          
          let columnName = "Unknown";
          const nameMatch = field.match(/\[.*?:(.*?):/);
          if (nameMatch && nameMatch[1]) {
            columnName = nameMatch[1];
          } else {
            const simpleMatch = field.match(/\[(.*?)\]/);
            if (simpleMatch && simpleMatch[1]) {
              columnName = simpleMatch[1];
            }
          }
          
          console.log(`[Color Parser]   Found datasource category encoding: field="${field}", column="${columnName}"`);
          
          const mapRegex = /<map\s+to=['"](#?[0-9a-fA-F]{6})['"][\s\S]*?<bucket>(.*?)<\/bucket>/gi;
          const categoryColors = {};
          let mapMatch;
          let mapCount = 0;
          
          while ((mapMatch = mapRegex.exec(encodingContent)) !== null) {
            let color = mapMatch[1];
            let category = mapMatch[2].trim();
            
            if (color.startsWith('#')) {
              color = color.substring(1);
            }
            if (color.length === 6) {
              color = "FF" + color.toUpperCase();
            }
            
            categoryColors[category] = color;
            mapCount++;
          }
          
          if (mapCount > 0) {
            console.log(`[Color Parser]     Found ${mapCount} datasource category-color mappings for "${columnName}"`);
            
            const fieldKey = field;
            categoryColorMap[fieldKey] = {
              columnName: columnName,
              paletteType: paletteType,
              categoryColors: categoryColors,
              field: field,
              type: 'category'
            };
            
            sheetColors[columnName] = {
              colors: Object.values(categoryColors),
              categoryColors: categoryColors,
              field: field,
              type: 'category'
            };
          }
        }
      }
      
      if (Object.keys(sheetColors).length > 0) {
        colorMap[sheetName] = sheetColors;
        console.log(`[Color Parser] ✅ Sheet "${sheetName}" has ${Object.keys(sheetColors).length} color rules`);
      }
    }
    
    console.log(`[Color Parser] Total: ${Object.keys(colorMap).length} sheets with colors`);
    
    try {
      tableau.extensions.settings.set("twbCategoryColorMap", JSON.stringify(categoryColorMap));
    } catch (e) {
      console.warn("[Color Parser] Could not save category color map:", e.message);
    }
    
    return colorMap;
  }

  /* =============================================================================
   * parseColorVisibilityFromXml() - Parses which columns have color APPLIED
   * Looks at <encodings> section to see if <color> tag exists
   * ============================================================================= */
  function parseColorVisibilityFromXml(xmlString) {
    console.log(`[Visibility Parser] Extracting color visibility from XML...`);
    
    const visibilityMap = {};
    
    // Find all worksheets
    const worksheetRegex = /<worksheet[^>]*name=['"]([^'"]+)['"][\s\S]*?<\/worksheet>/gi;
    let wsMatch;
    
    while ((wsMatch = worksheetRegex.exec(xmlString)) !== null) {
      const sheetName = wsMatch[1];
      const worksheetContent = wsMatch[0];
      
      console.log(`[Visibility Parser] Processing sheet: "${sheetName}"`);
      
      const visibleColorFields = [];
      
      // Find <encodings> section
      const encodingsRegex = /<encodings>([\s\S]*?)<\/encodings>/i;
      const encodingsMatch = encodingsRegex.exec(worksheetContent);
      
      if (!encodingsMatch) {
        console.log(`[Visibility Parser]   ⚠️ No <encodings> section found`);
        continue;
      }
      
      const encodingsContent = encodingsMatch[1];
      
      // Find all <color> tags in encodings
      const colorTagRegex = /<color\s+column=['"]([^'"]+)['"]/gi;
      let colorMatch;
      let colorCount = 0;
      
      while ((colorMatch = colorTagRegex.exec(encodingsContent)) !== null) {
        const columnField = colorMatch[1];
        
        // Extract column name from field
        let columnName = "Unknown";
        const nameMatch = columnField.match(/\[.*?:(.*?):/);
        if (nameMatch && nameMatch[1]) {
          columnName = nameMatch[1];
        } else {
          const simpleMatch = columnField.match(/\[(.*?)\]/);
          if (simpleMatch && simpleMatch[1]) {
            columnName = simpleMatch[1];
          }
        }
        
        visibleColorFields.push({
          columnName: columnName,
          field: columnField
        });
        colorCount++;
      }
      
      if (colorCount > 0) {
        visibilityMap[sheetName] = visibleColorFields;
        console.log(`[Visibility Parser] ✅ Sheet "${sheetName}" has ${colorCount} columns with color applied`);
        visibleColorFields.forEach(f => console.log(`[Visibility Parser]   - ${f.columnName}`));
      } else {
        console.log(`[Visibility Parser] ℹ️ Sheet "${sheetName}" has NO color applied (only text)`);
        visibilityMap[sheetName] = [];
      }
    }
    
    return visibilityMap;
  }
  
  function parseMarkInfoFromXml(xmlString) {
    const info = {};
    const wsRegex = /<worksheet[^>]*name=['"]([^'"]+)['"][\s\S]*?<\/worksheet>/gi;
    let ws;

    while ((ws = wsRegex.exec(xmlString)) !== null) {
      const panes = [];
      const paneRegex = /<pane[\s>][\s\S]*?<\/pane>/gi;
      let p;

      while ((p = paneRegex.exec(ws[0])) !== null) {
        const markMatch  = p[0].match(/<mark\s+class=['"]([^'"]+)['"]/i);
        const colorMatch = p[0].match(/<color\s+column=['"]([^'"]+)['"]/i);
        panes.push({
          markClass:  markMatch ? markMatch[1] : "Automatic",
          colorField: colorMatch ? colorMatch[1] : null
        });
      }

      info[ws[1]] = { panes };
      console.log(`[Mark Parser] "${ws[1]}": ${panes.map(x => x.markClass).join(", ") || "no panes"}`);
    }
    return info;
  }

  function getMarkInfo() {
    try {
      const saved = tableau.extensions.settings.get("twbMarkInfo");
      return saved ? JSON.parse(saved) : {};
    } catch (err) {
      console.warn("[getMarkInfo] Could not read settings:", err.message);
      return {};
    }
  }

  function getMarkClassForColorField(sheetName, field) {
    const panes = (getMarkInfo()[sheetName] || {}).panes || [];
    const exact = panes.find(p => p.colorField === field);
    if (exact) return exact.markClass;
    const anyColor = panes.find(p => p.colorField);
    if (anyColor) return anyColor.markClass;
    return panes[0] ? panes[0].markClass : "Automatic";
  }
  /* =============================================================================
   * loadWorkbookFile() - Loads .twb/.twbx and parses BOTH titles AND colors
   * ============================================================================= */
  async function loadWorkbookFile() {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".twb,.twbx";
      input.style.display = "none";
      document.body.appendChild(input);

      input.onchange = async (event) => {
        document.body.removeChild(input);

        const file = event.target.files[0];
        if (!file) {
          console.log("[loadWorkbookFile] No file selected");
          resolve({});
          return;
        }

        console.log(`[loadWorkbookFile] Reading: ${file.name}`);

        try {
          let xmlString;
          const ext = file.name.split(".").pop().toLowerCase();

          if (ext === "twb") {
            xmlString = await new Promise((res, rej) => {
              const reader = new FileReader();
              reader.onload = (e) => res(e.target.result);
              reader.onerror = () => rej(new Error("FileReader failed reading .twb"));
              reader.readAsText(file, "utf-8");
            });
          } else if (ext === "twbx") {
            const arrayBuffer = await new Promise((res, rej) => {
              const reader = new FileReader();
              reader.onload = (e) => res(e.target.result);
              reader.onerror = () => rej(new Error("FileReader failed reading .twbx"));
              reader.readAsArrayBuffer(file);
            });

            if (typeof JSZip === "undefined") {
              throw new Error("JSZip not loaded. Add the JSZip script tag to index.html.");
            }

            const zip = await JSZip.loadAsync(arrayBuffer);
            const twbEntry = Object.values(zip.files).find(
              f => !f.dir && f.name.endsWith(".twb")
            );

            if (!twbEntry) {
              throw new Error("No .twb file found inside the .twbx archive.");
            }

            xmlString = await twbEntry.async("string");
          } else {
            throw new Error(`Unsupported file type ".${ext}". Please select a .twb or .twbx file.`);
          }

          const titleMap = parseTwbXmlInBrowser(xmlString);
          console.log(`[loadWorkbookFile] Parsed ${Object.keys(titleMap).length} titles`);

          const colorMap = parseColorsFromXml(xmlString);
          const visibilityMap = parseColorVisibilityFromXml(xmlString);
          const markInfoMap = parseMarkInfoFromXml(xmlString);
          tableau.extensions.settings.set("twbTitleMap", JSON.stringify(titleMap));
          tableau.extensions.settings.set("twbColorMap", JSON.stringify(colorMap));
          tableau.extensions.settings.set("twbVisibilityMap", JSON.stringify(visibilityMap));
          tableau.extensions.settings.set("twbMarkInfo", JSON.stringify(markInfoMap));
          tableau.extensions.settings.set("twbFileName", file.name);
          
          await tableau.extensions.settings.saveAsync();

          const fileLabel = document.getElementById("twb_file_label");
          if (fileLabel) {
            let categoryCount = 0;
            try {
              const savedCategoryMap = tableau.extensions.settings.get("twbCategoryColorMap");
              if (savedCategoryMap) {
                categoryCount = Object.keys(JSON.parse(savedCategoryMap)).length;
              }
            } catch (e) {}
            
            const colorCount = Object.keys(colorMap).length;
            const visibleCount = Object.keys(visibilityMap).filter(k => visibilityMap[k].length > 0).length;
            fileLabel.textContent = `✅ ${file.name} — ${Object.keys(titleMap).length} titles, ${colorCount} sheets with colors, ${visibleCount} sheets with colors applied, ${categoryCount} category color mappings`;
          }

          resolve(titleMap);

        } catch (err) {
          console.error("[loadWorkbookFile] Error:", err.message);
          alert(`Could not read workbook file:\n${err.message}`);
          resolve({});
        }
      };

      input.oncancel = () => {
        document.body.removeChild(input);
        resolve({});
      };

      input.click();
    });
  }


  /* =============================================================================
   * getTitleMap() - Gets titles from settings   * ============================================================================= */
  function getTitleMap() {
    try {
      const saved = tableau.extensions.settings.get("twbTitleMap");
      if (!saved) return {};
      return JSON.parse(saved);
    } catch (err) {
      console.warn("[getTitleMap] Could not read settings:", err.message);
      return {};
    }
  }

  /* =============================================================================
   * getColorMap() - Gets colors from settings
   * ============================================================================= */
  function getColorMap() {
    try {
      const saved = tableau.extensions.settings.get("twbColorMap");
      if (!saved) return {};
      return JSON.parse(saved);
    } catch (err) {
      console.warn("[getColorMap] Could not read settings:", err.message);
      return {};
    }
  }

  /* =============================================================================
   * getVisibilityMap() - Gets color visibility from settings
   * ============================================================================= */
  function getVisibilityMap() {
    try {
      const saved = tableau.extensions.settings.get("twbVisibilityMap");
      if (!saved) return {};
      return JSON.parse(saved);
    } catch (err) {
      console.warn("[getVisibilityMap] Could not read settings:", err.message);
      return {};
    }
  }

  /* =============================================================================
   * getCategoryColorMap() - Gets category colors from settings
   * ============================================================================= */
  function getCategoryColorMap() {
    try {
      const saved = tableau.extensions.settings.get("twbCategoryColorMap");
      if (!saved) return {};
      return JSON.parse(saved);
    } catch (err) {
      console.warn("[getCategoryColorMap] Could not read settings:", err.message);
      return {};
    }
  }

  /* ── buildLayoutMap ─────────────────────────────────────────────────── */
  function buildLayoutMap(dashboardObjects, titleMap = {}) {
    const map = new Map();
    
    const positionableObjects = (dashboardObjects || []).filter(
      (obj) => (obj.type === "worksheet" || obj.type === "filter" || obj.type === "parameter") &&
               obj.position &&
               typeof obj.position.x === "number" &&
               typeof obj.position.y === "number"
    );

    if (positionableObjects.length === 0) return map;

    let minX = Infinity, minY = Infinity;
    positionableObjects.forEach((obj) => {
      if (obj.position.x < minX) minX = obj.position.x;
      if (obj.position.y < minY) minY = obj.position.y;
    });

    positionableObjects.forEach((obj) => {
      const px = obj.position;
      const gridCol = Math.round((px.x - minX) / PX_PER_COL);
      const gridRow = Math.round((px.y - minY) / PX_PER_ROW);
      const gridW = Math.max(2, Math.round((px.width || 180) / PX_PER_COL));
      const gridH = Math.max(3, Math.round((px.height || 60) / PX_PER_ROW));
      
      let displayName = "";
      if (obj.type === "worksheet") {
        displayName = titleMap[obj.name]
                   || (obj.title && obj.title.trim() ? obj.title.trim() : null)
                   || obj.name;
      } else {
        displayName = (obj.name || "Filter").replace(/[_-]/g, " ");
      }

      map.set(obj.name || `filter_${gridRow}_${gridCol}`, {
        type: obj.type,
        gridRow: Math.max(0, gridRow),
        gridCol: Math.max(0, gridCol),
        gridW,
        gridH,
        displayName,
        originalName: obj.name
      });
    });

    return map;
  }

  function writeKPICardStacked(worksheet, visualName, columns, dataRow, originRow, originCol, rangeTracker) {
    let r = originRow;
    const C = originCol;
    
    titleCell(worksheet, r, C, visualName);
    worksheet.mergeCells(r + 1, C + 1, r + 1, C + 2);
    rangeTracker.update(r, C);
    rangeTracker.update(r, C + 1);
    r++;
    
    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      const cell = dataRow[i];
      
      let label = col.fieldName || col.fieldId || `Metric ${i + 1}`;
      label = label.replace(/^(SUM|AVG|COUNT|MIN|MAX|ATTR)_/gi, '');
      
      const value = cell?.formattedValue ?? (cell?.value !== undefined ? String(cell.value) : "—");
      
      kpiLabelCell(worksheet, r + i, C, label);
      kpiValueCell(worksheet, r + i, C + 1, value);
      
      rangeTracker.update(r + i, C);
      rangeTracker.update(r + i, C + 1);
    }
    
    return 1 + columns.length;
  }

  /* ── applyCategoryColorsToTable() - Applies category colors from XML ── */
  function applyCategoryColorsToTable(worksheet, rows, columns, startRow, startCol, sheetName, categoryColorMap, visibilityMap) {
    if (!categoryColorMap || Object.keys(categoryColorMap).length === 0) {
      return false;
    }
    
    const visibleColors = visibilityMap && visibilityMap[sheetName] ? visibilityMap[sheetName] : [];
    const visibleColumnNames = visibleColors.map(v => v.columnName);
    
    if (visibleColumnNames.length === 0) {
      return false;
    }
    
    let colorsApplied = false;
    
    columns.forEach((col, colIndex) => {
      const fieldId = col.fieldId || col.fieldName || `Col${colIndex + 1}`;
      const fieldName = col.fieldName || "";
      
      const hasColorApplied = visibleColumnNames.some(v => 
        fieldId.includes(v) || v.includes(fieldId) ||
        fieldName.includes(v) || v.includes(fieldName)
      );
      
      if (!hasColorApplied) return;
      
      let matchedMapping = null;
      
      for (const [key, mapping] of Object.entries(categoryColorMap)) {
        const mappingColumn = mapping.columnName || "";
        if (fieldId.includes(mappingColumn) || mappingColumn.includes(fieldId) ||
            fieldName.includes(mappingColumn) || mappingColumn.includes(fieldName)) {
          matchedMapping = mapping;
          break;
        }
      }
      
      if (!matchedMapping) {
        for (const visible of visibleColors) {
          for (const [key, mapping] of Object.entries(categoryColorMap)) {
            const mappingColumn = mapping.columnName || "";
            if (visible.columnName.includes(mappingColumn) || mappingColumn.includes(visible.columnName)) {
              matchedMapping = mapping;
              break;
            }
          }
          if (matchedMapping) break;
        }
      }
      
      if (!matchedMapping) return;
      
      const categoryColors = matchedMapping.categoryColors;
      if (!categoryColors || Object.keys(categoryColors).length === 0) return;
      
      console.log(`[Category Colors] Applying ${Object.keys(categoryColors).length} category colors for "${matchedMapping.columnName}"`);
      
      rows.forEach((row, rowIndex) => {
        const rawValue = row[colIndex]?.formattedValue || row[colIndex]?.value;
        if (rawValue === null || rawValue === undefined || rawValue === "") return;
        
        const strValue = String(rawValue).trim();
        
        let matchedColor = null;
        
        for (const [category, color] of Object.entries(categoryColors)) {
          if (strValue === category || strValue.toLowerCase() === category.toLowerCase()) {
            matchedColor = color;
            break;
          }
        }
        
        if (!matchedColor) {
          for (const [category, color] of Object.entries(categoryColors)) {
            if (strValue.includes(category) || category.includes(strValue)) {
              matchedColor = color;
              break;
            }
          }
        }
        
        if (matchedColor) {
          const excelRow = startRow + rowIndex;
          const excelCol = startCol + colIndex;
          const cell = worksheet.getCell(excelRow + 1, excelCol + 1);
          
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: matchedColor }
          };
          
          const r = parseInt(matchedColor.substring(2, 4), 16);
          const g = parseInt(matchedColor.substring(4, 6), 16);
          const b = parseInt(matchedColor.substring(6, 8), 16);
          const brightness = (r * 299 + g * 587 + b * 114) / 1000;
          
          if (brightness < 128) {
            cell.font = { color: { argb: "FFFFFFFF" } };
          }
          
          colorsApplied = true;
        }
      });
    });
    
    return colorsApplied;
  }
  /* ── applyTableauColors() - Uses XML gradient colors, but ONLY if applied in view ── */
  /* ── applyTableauColors() - Uses XML gradient colors, but ONLY if applied in view ── */
function applyTableauColors(worksheet, rows, columns, startRow, startCol, sheetName, colorMap, visibilityMap) {
 const sheetColors = (colorMap && colorMap[sheetName]) || {};
  
  // ── Get visible columns from visibilityMap ──
  const visibleColors = visibilityMap && visibilityMap[sheetName] ? visibilityMap[sheetName] : [];
  const visibleColumnNames = visibleColors.map(v => v.columnName);
  
  if (visibleColumnNames.length === 0) {
    console.log(`[Tableau Colors] ⚠️ Sheet "${sheetName}" has NO color applied in view. Skipping colors.`);
    return false;
  }
  
  console.log(`[Tableau Colors] ✅ Sheet "${sheetName}" has color applied to: ${visibleColumnNames.join(', ')}`);
  
  let colorsApplied = false;
  
  columns.forEach((col, colIndex) => {
    const fieldId = col.fieldId || col.fieldName || `Col${colIndex + 1}`;
    const fieldName = col.fieldName || "";
    
    // ── Check if this column has color applied in the view ──
    let hasColorApplied = false;
    
    // Get clean column name (remove prefixes)
    let cleanName = fieldId.replace(/^(SUM|AVG|COUNT|MIN|MAX|ATTR)_/gi, '');
    
    // Check if this column has color applied in the view
    for (const v of visibleColumnNames) {
      const cleanV = v.replace(/^[a-z]+:/, '');
      if (cleanName === v || v === cleanName || 
          cleanName.includes(v) || v.includes(cleanName) ||
          cleanName === cleanV || cleanV === cleanName ||
          cleanName.includes(cleanV) || cleanV.includes(cleanName)) {
        hasColorApplied = true;
        break;
      }
    }
    
    if (!hasColorApplied) {
      console.log(`[Tableau Colors] ⏭️ Skipping "${fieldId}" - color NOT applied in view`);
      return;
    }
    
    console.log(`[Tableau Colors] ✅ "${fieldId}" HAS color applied in view`);
    
    // ── Find the palette for this column ──
    let palette = null;
    let matchedKey = null;
    
    for (const [key, value] of Object.entries(sheetColors)) {
      if (value.type === 'category') continue;
      if (fieldId.includes(key) || key.includes(fieldId) ||
          cleanName.includes(key) || key.includes(cleanName)) {
        palette = value.colors;
        matchedKey = key;
        break;
      }
    }
    
    if (!palette) {
      for (const [key, value] of Object.entries(sheetColors)) {
        if (value.type === 'category') continue;
        if (fieldName.includes(key) || key.includes(fieldName)) {
          palette = value.colors;
          matchedKey = key;
          break;
        }
      }
    }
    
    if (!palette) {
      for (const visible of visibleColors) {
        for (const [key, value] of Object.entries(sheetColors)) {
          if (value.type === 'category') continue;
          if (visible.columnName.includes(key) || key.includes(visible.columnName)) {
            palette = value.colors;
            matchedKey = key;
            break;
          }
        }
        if (palette) break;
      }
    }
    
    if (!palette || palette.length === 0) {
      // ── Automatic palette: choose a fixed palette based on mark type ──
      const visible = visibleColors.find(v => {
        const cv = v.columnName.replace(/^[a-z]+:/, '');
        return cleanName.includes(cv) || cv.includes(cleanName);
      });

      // Only continuous number fields (…:qk]) get a gradient
      if (!visible || !/:qk\]$/.test(visible.field)) {
        console.log(`[Tableau Colors] No gradient palette for column "${fieldId}", skipping`);
        return;
      }

      const markClass = getMarkClassForColorField(sheetName, visible.field);
      const auto = getAutomaticPaletteForMark(markClass);
      palette = auto.colors;
      matchedKey = `automatic → ${auto.name} (mark: ${markClass})`;
      console.log(`[Tableau Colors] Automatic palette for "${fieldId}": mark "${markClass}" → ${auto.name}`);
    }
    
    console.log(`[Tableau Colors] ✅ Applying gradient palette "${matchedKey}" with ${palette.length} colors to column "${fieldId}"`);
    
    const numericValues = [];
    rows.forEach(row => {
      const value = row[colIndex]?.formattedValue || row[colIndex]?.value;
      if (isNumeric(value)) {
        let numValue = String(value).replace(/,/g, "").replace(/%/g, "");
        numericValues.push(parseFloat(numValue));
      }
    });
    
    if (numericValues.length === 0) return;
    
    const minVal = Math.min(...numericValues);
    const maxVal = Math.max(...numericValues);
    const range = maxVal - minVal;
    
    rows.forEach((row, rowIndex) => {
      const rawValue = row[colIndex]?.formattedValue || row[colIndex]?.value;
      if (!isNumeric(rawValue)) return;
      
      let numValue = String(rawValue).replace(/,/g, "").replace(/%/g, "");
      const value = parseFloat(numValue);
      
      const excelRow = startRow + rowIndex;
      const excelCol = startCol + colIndex;
      const cell = worksheet.getCell(excelRow + 1, excelCol + 1);
      
      let position = range === 0 ? 0.5 : (value - minVal) / range;
      position = Math.max(0, Math.min(1, position));
      
      const colorCount = palette.length;
      const step = 1 / (colorCount - 1);
      let color = palette[0];
      
      for (let i = 0; i < colorCount - 1; i++) {
        const pos1 = i * step;
        const pos2 = (i + 1) * step;
        
        if (position >= pos1 && position <= pos2) {
          const t = (position - pos1) / (pos2 - pos1);
          color = interpolateColor(palette[i], palette[i + 1], t);
          break;
        }
      }
      
      if (position >= 1) {
        color = palette[palette.length - 1];
      }
      
      if (color) {
        // Apply background color
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: color }
        };
        
        // ── FIX: Set font color for readability based on background brightness ──
        // Same logic as applyCategoryColorsToTable()
        const r = parseInt(color.substring(2, 4), 16);
        const g = parseInt(color.substring(4, 6), 16);
        const b = parseInt(color.substring(6, 8), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        
        // Preserve existing font properties, only change color for readability
        const currentFont = cell.font || {};
        if (brightness < 128) {
          // Dark background → white text
          cell.font = {
            bold: currentFont.bold || false,
            size: currentFont.size || 11,
            name: currentFont.name || 'Calibri',
            italic: currentFont.italic || false,
            color: { argb: "FFFFFFFF" }
          };
        } else {
          // Light background → black text
          cell.font = {
            bold: currentFont.bold || false,
            size: currentFont.size || 11,
            name: currentFont.name || 'Calibri',
            italic: currentFont.italic || false,
            color: { argb: "FF000000" }
          };
        }
        
        colorsApplied = true;
      }
    });
  });
  
  return colorsApplied;
}

  function interpolateColor(color1, color2, t) {
    if (color1.length === 6) color1 = "FF" + color1;
    if (color2.length === 6) color2 = "FF" + color2;
    
    const r1 = parseInt(color1.substring(2, 4), 16);
    const g1 = parseInt(color1.substring(4, 6), 16);
    const b1 = parseInt(color1.substring(6, 8), 16);
    
    const r2 = parseInt(color2.substring(2, 4), 16);
    const g2 = parseInt(color2.substring(4, 6), 16);
    const b2 = parseInt(color2.substring(6, 8), 16);
    
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);
    
    return "FF" + 
           r.toString(16).padStart(2, "0") +
           g.toString(16).padStart(2, "0") +
           b.toString(16).padStart(2, "0");
  }

  /* ── Updated writeRegularTable() with BOTH gradient AND category colors ── */
  /* ── Updated writeRegularTable() with BOTH gradient AND category colors AND row grouping ── */
function writeRegularTable(worksheet, visualName, columns, rows, originRow, originCol, rangeTracker, tableIndex, allTablesInfo, sheetName, colorMap, visibilityMap) {
  let r = originRow;
  const C = originCol;
  const numCols = columns.length;
  
  // Title
  titleCell(worksheet, r, C, visualName);
  if (numCols > 1) {
    worksheet.mergeCells(r + 1, C + 1, r + 1, C + numCols);
  }
  rangeTracker.update(r, C);
  rangeTracker.update(r, C + numCols - 1);
  r++;
  
  // Header
  const headerRow = r;
  columns.forEach((col, ci) => {
    let headerName = col.fieldName || col.fieldId || `Col${ci + 1}`;
    headerName = headerName.replace(/^(SUM|AVG|COUNT|MIN|MAX|ATTR)_/gi, '');
    tableHeaderCell(worksheet, r, C + ci, headerName);
    rangeTracker.update(r, C + ci);
  });
  r++;
  
  const dataStartRow = r;
  const totalRows = rows.length;
  const needsGrouping = totalRows > ROW_GROUP_THRESHOLD;
  
  // Write data rows with grouping
  rows.forEach((row, rowIdx) => {
    row.forEach((cell, ci) => {
      const value = cell.formattedValue ?? (cell.value !== undefined ? String(cell.value) : "");
      tableDataCell(worksheet, r, C + ci, value, rowIdx);
      rangeTracker.update(r, C + ci);
    });
    
    // Group overflow rows
    if (needsGrouping && rowIdx >= ROW_GROUP_THRESHOLD) {
      const excelRow = worksheet.getRow(r + 1);
      excelRow.outlineLevel = 1;
      excelRow.hidden = true;
    }
    r++;
  });
  
  // Summary note for grouped rows
  if (needsGrouping) {
    const hiddenCount = totalRows - ROW_GROUP_THRESHOLD;
    const noteText = `${hiddenCount} rows are hidden — use the row group controls [+] / [-] on the left to expand or collapse`;
    const noteCell = worksheet.getCell(r + 1, C + 1);
    noteCell.value = noteText;
    noteCell.font = { italic: true, size: 10, color: { argb: "FF888888" } };
    noteCell.alignment = { horizontal: "left", vertical: "center" };
    noteCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF5F5F5" } };
    // if (numCols > 1) {
    //   worksheet.mergeCells(r + 1, C + 1, r + 1, C + numCols);
    // }
    rangeTracker.update(r, C);
    r++;
  }
  
  // ── Apply XML Colors (category first, then gradient) ──
  const categoryColorMap = getCategoryColorMap();
  
  const categoryColorsApplied = applyCategoryColorsToTable(
    worksheet, rows, columns, dataStartRow, C, sheetName, categoryColorMap, visibilityMap
  );
  
  let gradientColorsApplied = false;
  if (!categoryColorsApplied) {
    gradientColorsApplied = applyTableauColors(
      worksheet, rows, columns, dataStartRow, C, sheetName, colorMap, visibilityMap
    );
  } else {
    console.log(`[Write Table] ✅ Category colors applied, skipping gradient colors for "${sheetName}"`);
  }
  
  if (!categoryColorsApplied && !gradientColorsApplied) {
    console.log(`[Write Table] Using fallback hardcoded colors for "${sheetName}"`);
    applyConditionalFormattingToTable(worksheet, rows, columns, dataStartRow, C, {});
  }
  
  // Set outline properties so the [+] button appears above the group
  if (needsGrouping) {
    worksheet.properties.outlineProperties = {
      summaryBelow: false,
      summaryRight: false,
    };
  }
  
  if (allTablesInfo) {
    allTablesInfo.push({
      name: visualName,
      headerRow: headerRow,
      leftCol: C,
      rightCol: C + numCols - 1,
      bottomRow: r - 1
    });
  }
  
  return r - originRow;
}

  function resolveCollisions(zones) {
  if (!zones || zones.length === 0) return zones;

  // Full row/header/note height a zone actually occupies on the sheet,
  // including its own hidden-but-physically-present grouped rows.
  function getVisualHeight(zone) {
    return (zone.allocatedRows || zone.rowCount || 5) + ROW_GAP;
  }

  // ── Group by EXACT gridRow (not a rounded bucket) ──
  const rowGroups = new Map();
  zones.forEach(zone => {
    const key = zone.gridRow;
    if (!rowGroups.has(key)) rowGroups.set(key, []);
    rowGroups.get(key).push(zone);
  });

  // ── Horizontal packing within each group ──
  const processedGroups = [];
  for (const [, group] of rowGroups) {
    group.sort((a, b) => a.gridCol - b.gridCol);
    const minRow = Math.min(...group.map(z => z.gridRow));
    group.forEach(z => { z.gridRow = minRow; });
    let cursor = group[0].gridCol;
    for (const item of group) {
      if (item.gridCol < cursor) item.gridCol = cursor;
      cursor = item.gridCol + item.gridW + COL_GAP;
    }
    const groupBottom = minRow + Math.max(...group.map(z => getVisualHeight(z))) + ROW_GAP;
    processedGroups.push({ minRow, items: group, bottom: groupBottom });
  }

  // ── Cascade vertical pushes until stable (not just one pass) ──
  processedGroups.sort((a, b) => a.minRow - b.minRow);
  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < processedGroups.length - 1; i++) {
      const upper = processedGroups[i];
      const lower = processedGroups[i + 1];
      let horizontalOverlap = false;
      for (const u of upper.items) {
        for (const l of lower.items) {
          const uLeft = u.gridCol, uRight = u.gridCol + u.gridW;
          const lLeft = l.gridCol, lRight = l.gridCol + l.gridW;
          if (uLeft < lRight && uRight > lLeft) { horizontalOverlap = true; break; }
        }
        if (horizontalOverlap) break;
      }
      if (horizontalOverlap && lower.minRow < upper.bottom) {
        const pushBy = upper.bottom - lower.minRow;
        lower.items.forEach(z => { z.gridRow += pushBy; });
        lower.minRow += pushBy;
        lower.bottom += pushBy;
        changed = true;
      }
    }
  }

  // ── Full pairwise safety-net scan across ALL zones, not just adjacent groups ──
  let fullPassChanged = true;
  const MAX_PASSES = 20;
  let pass = 0;
  while (fullPassChanged && pass < MAX_PASSES) {
    fullPassChanged = false;
    pass++;
    for (let i = 0; i < zones.length; i++) {
      for (let j = i + 1; j < zones.length; j++) {
        const a = zones[i], b = zones[j];
        const upper = a.gridRow <= b.gridRow ? a : b;
        const lower = a.gridRow <= b.gridRow ? b : a;
        const upperBottom = upper.gridRow + getVisualHeight(upper) + ROW_GAP;
        const colOverlap = upper.gridCol < lower.gridCol + lower.gridW &&
                            upper.gridCol + upper.gridW > lower.gridCol;
        const rowOverlap = lower.gridRow < upperBottom;
        if (colOverlap && rowOverlap) {
          lower.gridRow += (upperBottom - lower.gridRow);
          fullPassChanged = true;
        }
      }
    }
  }

  return zones;
}

  function applyAutoFilters(worksheet, allTablesInfo) {
    if (!allTablesInfo || allTablesInfo.length === 0) return;
    
    allTablesInfo.forEach(table => {
      const startCol = getExcelColumnName(table.leftCol);
      const endCol = getExcelColumnName(table.rightCol);
      const filterRange = `${startCol}${table.headerRow + 1}:${endCol}${table.bottomRow + 1}`;
      worksheet.autoFilter = filterRange;
    });
  }

  function setColumnWidths(worksheet, colWidths) {
    const maxColIdx = Object.keys(colWidths).length > 0 ? Math.max(...Object.keys(colWidths).map(Number)) : 0;
    
    for (let ci = 0; ci <= maxColIdx; ci++) {
      const width = colWidths[ci] || 12;
      worksheet.getColumn(ci + 1).width = Math.min(width + 2, 50);
    }
  }

  /* ── Main Export Logic ─────────────────────────────────────────────────── */
  document.addEventListener("DOMContentLoaded", () => {
    tableau.extensions.initializeAsync().then(() => {
      const dashboard = tableau.extensions.dashboardContent.dashboard;
      const sheets = dashboard.worksheets;

      const loadBtn = document.getElementById("load_workbook_btn");
      if (loadBtn) {
        loadBtn.addEventListener("click", async () => {
          loadBtn.disabled = true;
          loadBtn.textContent = "⏳ Loading...";
          await loadWorkbookFile();
          loadBtn.disabled = false;
          loadBtn.textContent = "📁 Load Workbook";
        });
      }

      const fileLabel = document.getElementById("twb_file_label");
      if (fileLabel) {
        const savedFileName = tableau.extensions.settings.get("twbFileName");
        const savedTitleMap = tableau.extensions.settings.get("twbTitleMap");
        const savedColorMap = tableau.extensions.settings.get("twbColorMap");
        const savedVisibilityMap = tableau.extensions.settings.get("twbVisibilityMap");
        const savedCategoryColorMap = tableau.extensions.settings.get("twbCategoryColorMap");
        
        if (savedFileName && savedTitleMap) {
          const titleCount = Object.keys(JSON.parse(savedTitleMap)).length;
          const colorCount = savedColorMap ? Object.keys(JSON.parse(savedColorMap)).length : 0;
          const visibilityCount = savedVisibilityMap ? 
            Object.keys(JSON.parse(savedVisibilityMap)).filter(k => JSON.parse(savedVisibilityMap)[k]?.length > 0).length : 0;
          const categoryCount = savedCategoryColorMap ? Object.keys(JSON.parse(savedCategoryColorMap)).length : 0;
          fileLabel.textContent = `✅ ${savedFileName} — ${titleCount} titles, ${colorCount} sheets with colors, ${visibilityCount} sheets with colors applied, ${categoryCount} category color mappings`;
        } else {
          fileLabel.textContent = "No workbook loaded — click 📁 to load titles and colors";
        }
      }

      const exportBtn = document.getElementById("export_button");
      if (exportBtn) {
        exportBtn.addEventListener("click", exportToExcel);
      }

      async function exportToExcel() {
  const btn = document.getElementById("export_button");
  btn.disabled = true;

  try {
    const filterValuesMap = await extractFilterValuesPerField(sheets);
    console.log("📊 Filter values per field:", filterValuesMap);

    const titleMap = getTitleMap();
    console.log(`[Export] Using ${Object.keys(titleMap).length} titles`);

    const colorMap = getColorMap();
    console.log(`[Export] Using ${Object.keys(colorMap).length} sheets with colors`);

    const visibilityMap = getVisibilityMap();
    console.log(`[Export] Using visibility map with ${Object.keys(visibilityMap).length} sheets`);

    const layoutMap = buildLayoutMap(dashboard.objects || [], titleMap);

    // ── 1. Build DZV map ──
    const dzvMap = {};
    (dashboard.objects || [])
      .filter(obj => obj.type === "worksheet")
      .forEach(obj => {
        dzvMap[obj.name] = obj.isVisible;
      });
    console.log("[DZV] Visibility map:", dzvMap);

    // ── 2. Fetch all sheets in parallel ──
    const allSheetsData = await fetchAllSheetsData(sheets);

    const filterValueItems = [];
    const dataWorksheetItems = [];

    for (const { sheet, data, error } of allSheetsData) {
      if (error) {
        console.warn(`Skipping "${sheet.name}": ${error.message}`);
        continue;
      }

      // ---- DZV check ----
      if (dzvMap[sheet.name] === false) {
        console.log(`[DZV] Skipping hidden sheet: "${sheet.name}"`);
        continue;
      }

      let summaryData = data;  // already fetched
      if (!summaryData.columns || summaryData.columns.length === 0) continue;
      if (!summaryData.data || summaryData.data.length === 0) continue;

      const layout = layoutMap.get(sheet.name);
      const visualName = (layout && layout.displayName) ? layout.displayName : sheet.name;

      if (isFilterValueWorksheet(sheet.name, summaryData)) {
        let matchedFilterName = null;
        let matchedValues = null;

        for (const [filterField, values] of Object.entries(filterValuesMap)) {
          const cleanFilterField = filterField.toLowerCase().replace(/[^a-z]/g, '');
          const cleanSheetName = sheet.name.toLowerCase().replace(/[^a-z]/g, '');
          if (cleanSheetName.includes(cleanFilterField) || cleanFilterField.includes(cleanSheetName)) {
            matchedFilterName = filterField;
            matchedValues = values;
            break;
          }
        }

        if (!matchedValues) {
          matchedFilterName = visualName;
          matchedValues = [`Values: ${summaryData.data.length} items`];
        }

        filterValueItems.push({
          type: "filterValue",
          name: sheet.name,
          visualName: visualName,
          filterName: matchedFilterName,
          values: matchedValues,
          layout: layout,
          rowCount: 2 + (Array.isArray(matchedValues) ? matchedValues.length : 1),
          originalData: summaryData
        });
      } else {
        const isKPI = isKPICard(sheet, summaryData);

        let item = {
          name: sheet.name,
          visualName: visualName,
          layout: layout,
          isKPI: isKPI,
          type: "worksheet"
        };

        if (isKPI) {
          item.columns = summaryData.columns;
          item.dataRow = summaryData.data[0];
          item.rowCount = 1 + summaryData.columns.length;
        } else {
          item.columns = summaryData.columns;
          item.rows = summaryData.data;
          item.rowCount = 2 + item.rows.length;
        }

        dataWorksheetItems.push(item);
      }
    }

    const allItems = [...filterValueItems, ...dataWorksheetItems];

    if (allItems.length === 0) {
      throw new Error("No data found in any visible worksheet.");
    }

    const placedItems = allItems.map((item, idx) => {
      if (item.layout) {
        const l = item.layout;
        let calculatedWidth = l.gridW;

        if (item.type === "filterValue") {
          calculatedWidth = Math.max(l.gridW, 3);
        } else if (item.isKPI) {
          calculatedWidth = Math.max(l.gridW, Math.min(6, item.columns.length + 1));
        } else {
          calculatedWidth = Math.max(l.gridW, Math.min(25, item.columns.length + 1));
        }

        return {
          ...item,
          gridRow: l.gridRow,
          gridCol: l.gridCol,
          gridW: calculatedWidth,
          allocatedRows: item.rowCount,
        };
      } else {
        const itemsPerRow = 3;
        const rowIdx = Math.floor(idx / itemsPerRow);
        const colIdx = idx % itemsPerRow;
        const gridRow = rowIdx * (Math.max(8, item.rowCount) + ROW_GAP);
        const gridCol = colIdx * 12;
        const gridW = (item.type === "filterValue") ? 4 : (item.isKPI ? 5 : 12);

        return {
          ...item,
          gridRow: gridRow,
          gridCol: gridCol,
          gridW: gridW,
          allocatedRows: item.rowCount,
        };
      }
    });

    resolveCollisions(placedItems);

// SNAP-OUT-OF-GROUPED-ROWS PASS
// Excel hides entire physical rows, not per-column cells. resolveCollisions
// only pushes items that horizontally overlap another item's column range —
// so a table in column K can still be placed on a row that a totally
// different table (in column A) has marked hidden=true for its own
// row-grouping. When the workbook opens with that group collapsed, the
// column-K table vanishes too, even though nothing "collided" by column.
// This pass detects that and pushes the item below the other table's full
// physical row range (not just its visible rows).
let snapChanged = true;
const MAX_SNAP_PASSES = 10;
let snapPass = 0;

while (snapChanged && snapPass < MAX_SNAP_PASSES) {
  snapChanged = false;
  snapPass++;

  for (const item of placedItems) {
    for (const other of placedItems) {
      if (item === other) continue;

      const otherTotal = other.allocatedRows || other.rowCount || 0;
      if (otherTotal <= ROW_GROUP_THRESHOLD + 2) continue; // other has no hidden rows

      const otherVisibleEnd = other.gridRow + ROW_GROUP_THRESHOLD + 3;
      const otherPhysicalEnd = other.gridRow + otherTotal + ROW_GAP;

      if (item.gridRow >= otherVisibleEnd && item.gridRow < otherPhysicalEnd) {
        item.gridRow = otherPhysicalEnd;
        snapChanged = true;
      }
    }
  }
}

    const workbook = new ExcelJS.Workbook();
    const sheetName = (dashboard.name || "Dashboard Export")
      .replace(/[\\\/\*\?\[\]:]/g, "")
      .slice(0, 31);
    const worksheet = workbook.addWorksheet(sheetName);

    const colWidths = {};
    const allTablesInfo = [];
    const tracker = makeRangeTracker();

    let currentRow = 0;
    const dashboardName = dashboard.name || "Dashboard Export";
    const exportDate = new Date().toLocaleString();
    const titleHeight = writeDashboardTitle(worksheet, dashboardName, exportDate, currentRow, 0, tracker);
    currentRow += titleHeight;

    colWidths[0] = Math.max(colWidths[0] || 0, 30);
    colWidths[1] = Math.max(colWidths[1] || 0, 20);
    colWidths[2] = Math.max(colWidths[2] || 0, 20);
    colWidths[3] = Math.max(colWidths[3] || 0, 20);
    colWidths[4] = Math.max(colWidths[4] || 0, 20);

    const adjustedItems = placedItems.map(item => ({
      ...item,
      gridRow: item.gridRow + currentRow
    }));

    for (let i = 0; i < adjustedItems.length; i++) {
      const item = adjustedItems[i];

      if (item.type === "filterValue") {
        writeIndividualFilterTable(
          worksheet,
          item.filterName,
          item.values,
          item.gridRow,
          item.gridCol,
          tracker
        );
        colWidths[item.gridCol] = Math.max(colWidths[item.gridCol] || 0, 35);
      } else if (item.isKPI) {
        writeKPICardStacked(
          worksheet,
          item.visualName,
          item.columns,
          item.dataRow,
          item.gridRow,
          item.gridCol,
          tracker
        );
        colWidths[item.gridCol] = Math.max(colWidths[item.gridCol] || 0, 22);
        colWidths[item.gridCol + 1] = Math.max(colWidths[item.gridCol + 1] || 0, 18);
      } else {
        writeRegularTable(
          worksheet,
          item.visualName,
          item.columns,
          item.rows,
          item.gridRow,
          item.gridCol,
          tracker,
          i,
          allTablesInfo,
          item.name,
          colorMap,
          visibilityMap
        );
        item.columns.forEach((col, ci) => {
          const excelColIdx = item.gridCol + ci;
          const nameLength = (col.fieldName ? col.fieldName.length + 1 : 7);
          colWidths[excelColIdx] = Math.max(colWidths[excelColIdx] || 0, Math.min(35, nameLength));
        });
      }
    }

    setColumnWidths(worksheet, colWidths);
    applyAutoFilters(worksheet, allTablesInfo);

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const now = new Date();
    const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
    const fname = `${sheetName}_${stamp}.xlsx`;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fname;
    link.click();
    URL.revokeObjectURL(link.href);

    console.log("✅ Export completed with DZV, parallel fetch, row grouping, and Tableau colors!");

  } catch (err) {
    console.error("[Export]", err);
    alert("Export failed. Check console (F12) for details.\n\n" + err.message);
  } finally {
    btn.disabled = false;
  }
}

    }).catch((err) => {
      console.error("[Tableau init]", err);
      alert("Failed to connect to Tableau: " + err.message);
      if (document.getElementById("export_button")) {
        document.getElementById("export_button").disabled = true;
      }
    });
  });

})();

