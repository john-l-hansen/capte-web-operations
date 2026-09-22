/**
 * Capte Design & Web Operations — Campaign Link & QR Generator
 * Component: <campaign-qr-generator>
 * Standard: ISO/IEC 18004 Reed-Solomon Matrix Encoder & Vector Exporter
 * Zero external dependencies.
 */

(function (global) {
  'use strict';

  /* =========================================================================
     1. GALOIS FIELD GF(256) ARITHMETIC (Characteristic Polynomial: 0x11D / 285)
     ========================================================================= */

  const GF_EXP = new Uint8Array(512);
  const GF_LOG = new Uint8Array(256);

  (function initGaloisField() {
    let val = 1;
    for (let i = 0; i < 255; i++) {
      GF_EXP[i] = val;
      GF_EXP[i + 255] = val;
      GF_LOG[val] = i;
      val = (val << 1) ^ (val & 128 ? 0x11D : 0);
    }
    GF_LOG[0] = 0; // Undefined mathematically, safe sentinel
  })();

  function gfMul(x, y) {
    if (x === 0 || y === 0) return 0;
    return GF_EXP[GF_LOG[x] + GF_LOG[y]];
  }

  function getRsGeneratorPoly(numEcWords) {
    let poly = [1];
    for (let i = 0; i < numEcWords; i++) {
      const next = [1, GF_EXP[i]];
      const res = new Array(poly.length + next.length - 1).fill(0);
      for (let j = 0; j < poly.length; j++) {
        for (let k = 0; k < next.length; k++) {
          res[j + k] ^= gfMul(poly[j], next[k]);
        }
      }
      poly = res;
    }
    return poly;
  }

  function calculateRsRemainder(data, numEcWords) {
    const genPoly = getRsGeneratorPoly(numEcWords);
    const remainder = new Array(numEcWords).fill(0);
    for (let i = 0; i < data.length; i++) {
      const factor = data[i] ^ remainder[0];
      remainder.shift();
      remainder.push(0);
      if (factor !== 0) {
        for (let j = 0; j < numEcWords; j++) {
          remainder[j] ^= gfMul(genPoly[j + 1], factor);
        }
      }
    }
    return remainder;
  }

  /* =========================================================================
     2. ISO/IEC 18004 TABLES & SPECIFICATIONS (VERSIONS 1–40)
     ========================================================================= */

  const ALIGNMENT_PATTERN_COORDS = [
    [], [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34],
    [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54], [6, 32, 58], [6, 34, 62],
    [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86],
    [6, 34, 62, 90], [6, 28, 50, 72, 94], [6, 26, 50, 74, 98], [6, 30, 54, 78, 102], [6, 28, 54, 80, 106],
    [6, 32, 58, 84, 110], [6, 30, 58, 86, 114], [6, 34, 62, 90, 118], [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126],
    [6, 26, 52, 78, 104, 130], [6, 30, 56, 82, 108, 134], [6, 34, 60, 86, 112, 138], [6, 30, 58, 86, 114, 142],
    [6, 34, 62, 90, 118, 146], [6, 30, 54, 78, 102, 126, 150], [6, 24, 50, 76, 102, 128, 154], [6, 28, 54, 80, 106, 132, 158],
    [6, 32, 58, 84, 110, 136, 162], [6, 26, 54, 82, 110, 138, 166], [6, 30, 58, 86, 114, 142, 170]
  ];

  // Block definitions: [ecPerBlock, g1Blocks, g1Data, g2Blocks, g2Data]
  const ECC_TABLE = [
    null,
    // V1 - V10
    { L: [7, 1, 19, 0, 0], M: [10, 1, 16, 0, 0], Q: [13, 1, 13, 0, 0], H: [17, 1, 9, 0, 0] },
    { L: [10, 1, 34, 0, 0], M: [16, 1, 28, 0, 0], Q: [22, 1, 22, 0, 0], H: [28, 1, 16, 0, 0] },
    { L: [15, 1, 55, 0, 0], M: [26, 1, 44, 0, 0], Q: [18, 2, 17, 0, 0], H: [22, 2, 13, 0, 0] },
    { L: [20, 1, 80, 0, 0], M: [18, 2, 32, 0, 0], Q: [26, 2, 24, 0, 0], H: [16, 4, 9, 0, 0] },
    { L: [26, 1, 108, 0, 0], M: [24, 2, 43, 0, 0], Q: [18, 2, 15, 2, 16], H: [22, 2, 11, 2, 12] },
    { L: [18, 2, 68, 0, 0], M: [16, 4, 27, 0, 0], Q: [24, 4, 19, 0, 0], H: [28, 4, 15, 0, 0] },
    { L: [20, 2, 78, 0, 0], M: [18, 4, 31, 0, 0], Q: [18, 2, 14, 4, 15], H: [26, 4, 13, 1, 14] },
    { L: [24, 2, 97, 0, 0], M: [22, 2, 38, 2, 39], Q: [22, 4, 18, 2, 19], H: [26, 4, 14, 2, 15] },
    { L: [30, 2, 116, 0, 0], M: [22, 3, 36, 2, 37], Q: [20, 4, 16, 4, 17], H: [24, 4, 12, 4, 13] },
    { L: [18, 2, 68, 2, 69], M: [26, 4, 43, 1, 44], Q: [24, 6, 19, 2, 20], H: [28, 6, 15, 2, 16] },
    // V11 - V20
    { L: [20, 4, 81, 0, 0], M: [30, 1, 50, 4, 51], Q: [28, 4, 22, 4, 23], H: [24, 3, 12, 8, 13] },
    { L: [24, 2, 92, 2, 93], M: [22, 6, 36, 2, 37], Q: [26, 4, 20, 6, 21], H: [28, 7, 14, 4, 15] },
    { L: [26, 4, 107, 0, 0], M: [22, 8, 37, 1, 38], Q: [24, 8, 20, 4, 21], H: [22, 12, 11, 4, 12] },
    { L: [30, 3, 115, 1, 116], M: [24, 4, 40, 5, 41], Q: [20, 11, 16, 5, 17], H: [24, 11, 12, 5, 13] },
    { L: [22, 5, 87, 1, 88], M: [24, 5, 41, 5, 42], Q: [30, 5, 24, 7, 25], H: [24, 11, 12, 7, 13] },
    { L: [24, 5, 98, 1, 99], M: [28, 7, 45, 3, 46], Q: [24, 15, 19, 2, 20], H: [30, 3, 15, 13, 16] },
    { L: [28, 1, 107, 5, 108], M: [28, 10, 46, 1, 47], Q: [28, 1, 22, 15, 23], H: [28, 2, 14, 17, 15] },
    { L: [30, 5, 120, 1, 121], M: [26, 9, 43, 4, 44], Q: [28, 17, 22, 1, 23], H: [28, 2, 14, 19, 15] },
    { L: [28, 3, 113, 4, 114], M: [26, 3, 44, 11, 45], Q: [26, 17, 21, 4, 22], H: [26, 9, 13, 16, 14] },
    { L: [28, 3, 107, 5, 108], M: [26, 3, 41, 13, 42], Q: [30, 15, 24, 5, 25], H: [28, 15, 15, 10, 16] },
    // V21 - V30
    { L: [28, 4, 116, 4, 117], M: [26, 17, 42, 0, 0], Q: [28, 17, 22, 6, 23], H: [30, 19, 16, 6, 17] },
    { L: [28, 2, 111, 7, 112], M: [28, 17, 46, 0, 0], Q: [30, 7, 24, 16, 25], H: [24, 34, 13, 0, 0] },
    { L: [30, 4, 121, 5, 122], M: [28, 4, 47, 14, 48], Q: [30, 11, 24, 14, 25], H: [30, 16, 15, 14, 16] },
    { L: [30, 6, 117, 4, 118], M: [28, 6, 45, 14, 46], Q: [30, 11, 24, 16, 25], H: [30, 30, 16, 2, 17] },
    { L: [26, 8, 106, 4, 107], M: [28, 8, 47, 13, 48], Q: [30, 7, 24, 22, 25], H: [30, 22, 15, 13, 16] },
    { L: [28, 10, 114, 2, 115], M: [28, 19, 46, 4, 47], Q: [28, 28, 22, 6, 23], H: [30, 33, 16, 4, 17] },
    { L: [30, 8, 122, 4, 123], M: [28, 22, 45, 3, 46], Q: [30, 8, 23, 26, 24], H: [30, 12, 15, 28, 16] },
    { L: [30, 3, 117, 10, 118], M: [28, 3, 45, 23, 46], Q: [30, 4, 24, 31, 25], H: [30, 11, 15, 31, 16] },
    { L: [30, 7, 116, 7, 117], M: [28, 21, 45, 7, 46], Q: [30, 1, 23, 37, 24], H: [30, 19, 15, 26, 16] },
    { L: [30, 5, 115, 10, 116], M: [28, 19, 47, 10, 48], Q: [30, 15, 24, 25, 25], H: [30, 23, 15, 25, 16] },
    // V31 - V40
    { L: [30, 13, 115, 3, 116], M: [28, 2, 46, 29, 47], Q: [30, 42, 24, 1, 25], H: [30, 23, 15, 28, 16] },
    { L: [30, 17, 115, 0, 0], M: [28, 10, 46, 23, 47], Q: [30, 10, 24, 35, 25], H: [30, 19, 15, 35, 16] },
    { L: [30, 17, 115, 1, 116], M: [28, 14, 46, 21, 47], Q: [30, 29, 24, 19, 25], H: [30, 11, 15, 46, 16] },
    { L: [30, 13, 115, 6, 116], M: [28, 14, 46, 23, 47], Q: [30, 44, 24, 7, 25], H: [30, 59, 16, 1, 17] },
    { L: [30, 12, 121, 7, 122], M: [28, 12, 47, 26, 48], Q: [30, 39, 24, 14, 25], H: [30, 22, 15, 41, 16] },
    { L: [30, 6, 121, 14, 122], M: [28, 6, 47, 34, 48], Q: [30, 46, 24, 10, 25], H: [30, 2, 15, 64, 16] },
    { L: [30, 17, 122, 4, 123], M: [28, 29, 46, 14, 47], Q: [30, 49, 24, 10, 25], H: [30, 24, 15, 46, 16] },
    { L: [30, 4, 122, 18, 123], M: [28, 13, 46, 32, 47], Q: [30, 48, 24, 14, 25], H: [30, 42, 15, 32, 16] },
    { L: [30, 20, 117, 4, 118], M: [28, 40, 47, 7, 48], Q: [30, 43, 24, 22, 25], H: [30, 10, 15, 67, 16] },
    { L: [30, 19, 118, 6, 119], M: [28, 18, 47, 31, 48], Q: [30, 34, 24, 34, 25], H: [30, 20, 15, 61, 16] }
  ];

  // 15-bit BCH Format Information lookup
  const FORMAT_BITS = [
    0x5412, 0x5125, 0x5E7C, 0x5B4B, 0x45F9, 0x40CE, 0x4F97, 0x4AA0,
    0x77C4, 0x72F3, 0x7DAA, 0x789D, 0x662F, 0x6318, 0x6C41, 0x6976,
    0x1689, 0x13BE, 0x1CE7, 0x19D0, 0x0762, 0x0255, 0x0D0C, 0x083B,
    0x355F, 0x3068, 0x3F31, 0x3A06, 0x24B4, 0x2183, 0x2EDA, 0x2BED
  ];

  // 18-bit BCH Version Information lookup (V7..V40)
  const VERSION_BITS = [
    null, null, null, null, null, null, null,
    0x07C94, 0x085BC, 0x09A99, 0x0A4D3,
    0x0BBF6, 0x0C762, 0x0D847, 0x0E60D,
    0x0F928, 0x10B78, 0x1145D, 0x12A17,
    0x13532, 0x149A6, 0x15683, 0x168C9,
    0x177EC, 0x18EC4, 0x191E1, 0x1AFAB,
    0x1B08E, 0x1CC1A, 0x1D33F, 0x1ED75,
    0x1F250, 0x209D5, 0x216F0, 0x228BA,
    0x2379F, 0x24B0B, 0x2542E, 0x26A64,
    0x27541, 0x28C69
  ];

  /* =========================================================================
     3. CORE QR CODE MATRIX ENCODER
     ========================================================================= */

  class QrEncoder {
    static encode(text, eccLevel = 'Q') {
      const ecc = (['L', 'M', 'Q', 'H'].includes(eccLevel.toUpperCase())) ? eccLevel.toUpperCase() : 'Q';
      const utf8Bytes = new TextEncoder().encode(text);
      const dataLen = utf8Bytes.length;

      // Select smallest version that accommodates the payload
      let version = 1;
      let spec = null;
      let totalDataWords = 0;

      for (let v = 1; v <= 40; v++) {
        const vSpec = ECC_TABLE[v][ecc];
        const cap = vSpec[1] * vSpec[2] + vSpec[3] * vSpec[4];
        const charCountBits = (v < 10) ? 8 : 16;
        const neededBits = 4 + charCountBits + dataLen * 8;
        if (neededBits <= cap * 8) {
          version = v;
          spec = vSpec;
          totalDataWords = cap;
          break;
        }
      }

      if (!spec) {
        throw new Error(`Payload exceeds maximum QR Code Version 40 capacity (${dataLen} bytes for ECC ${ecc}).`);
      }

      // Bit buffer assembly
      const bitBuffer = [];
      function putBits(val, len) {
        for (let i = len - 1; i >= 0; i--) {
          bitBuffer.push((val >>> i) & 1);
        }
      }

      // 1. Mode indicator (0100 for Byte Mode)
      putBits(4, 4);

      // 2. Character count indicator
      const charCountBits = (version < 10) ? 8 : 16;
      putBits(dataLen, charCountBits);

      // 3. UTF-8 byte stream
      for (let i = 0; i < utf8Bytes.length; i++) {
        putBits(utf8Bytes[i], 8);
      }

      // 4. Terminator (up to 4 zero bits)
      const totalBitsNeeded = totalDataWords * 8;
      const termLen = Math.min(4, totalBitsNeeded - bitBuffer.length);
      putBits(0, termLen);

      // 5. Byte alignment padding
      while (bitBuffer.length % 8 !== 0) {
        bitBuffer.push(0);
      }

      // 6. Pad codewords alternating 0xEC (236) and 0x11 (17)
      const padWords = [0xEC, 0x11];
      let padIdx = 0;
      while (bitBuffer.length < totalBitsNeeded) {
        putBits(padWords[padIdx % 2], 8);
        padIdx++;
      }

      // Convert bitBuffer to byte array
      const dataBytes = [];
      for (let i = 0; i < bitBuffer.length; i += 8) {
        let b = 0;
        for (let j = 0; j < 8; j++) {
          b = (b << 1) | bitBuffer[i + j];
        }
        dataBytes.push(b);
      }

      // 7. Error Correction Block Generation
      const [ecPerBlock, g1Blocks, g1DataWords, g2Blocks, g2DataWords] = spec;
      const blocks = [];
      let byteOffset = 0;

      for (let i = 0; i < g1Blocks; i++) {
        const bData = dataBytes.slice(byteOffset, byteOffset + g1DataWords);
        byteOffset += g1DataWords;
        const bEc = calculateRsRemainder(bData, ecPerBlock);
        blocks.push({ data: bData, ec: bEc });
      }
      for (let i = 0; i < g2Blocks; i++) {
        const bData = dataBytes.slice(byteOffset, byteOffset + g2DataWords);
        byteOffset += g2DataWords;
        const bEc = calculateRsRemainder(bData, ecPerBlock);
        blocks.push({ data: bData, ec: bEc });
      }

      // 8. Interleave Data Codewords
      const interleaved = [];
      const maxDataLen = Math.max(g1DataWords, g2DataWords);
      for (let col = 0; col < maxDataLen; col++) {
        for (let b = 0; b < blocks.length; b++) {
          if (col < blocks[b].data.length) {
            interleaved.push(blocks[b].data[col]);
          }
        }
      }

      // 9. Interleave Error Correction Codewords
      for (let col = 0; col < ecPerBlock; col++) {
        for (let b = 0; b < blocks.length; b++) {
          interleaved.push(blocks[b].ec[col]);
        }
      }

      // Convert interleaved to final raw bits
      const finalBits = [];
      for (let i = 0; i < interleaved.length; i++) {
        for (let b = 7; b >= 0; b--) {
          finalBits.push((interleaved[i] >>> b) & 1);
        }
      }

      // 10. Matrix Construction
      const matrixSize = version * 4 + 17;
      const matrix = Array.from({ length: matrixSize }, () => Array(matrixSize).fill(null));
      const isFunction = Array.from({ length: matrixSize }, () => Array(matrixSize).fill(false));

      function setFunction(r, c, val) {
        matrix[r][c] = val;
        isFunction[r][c] = true;
      }

      // Finder Patterns & Separators
      function drawFinder(row, col) {
        for (let r = -1; r <= 7; r++) {
          for (let c = -1; c <= 7; c++) {
            const mr = row + r;
            const mc = col + c;
            if (mr < 0 || mr >= matrixSize || mc < 0 || mc >= matrixSize) continue;
            if (r >= 0 && r <= 6 && c >= 0 && c <= 6) {
              const isDark = (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4));
              setFunction(mr, mc, isDark);
            } else {
              setFunction(mr, mc, false); // Separator
            }
          }
        }
      }

      drawFinder(0, 0);
      drawFinder(0, matrixSize - 7);
      drawFinder(matrixSize - 7, 0);

      // Timing Patterns
      for (let i = 8; i < matrixSize - 8; i++) {
        setFunction(6, i, i % 2 === 0);
        setFunction(i, 6, i % 2 === 0);
      }

      // Alignment Patterns
      const alignCoords = ALIGNMENT_PATTERN_COORDS[version] || [];
      for (let i = 0; i < alignCoords.length; i++) {
        for (let j = 0; j < alignCoords.length; j++) {
          const ar = alignCoords[i];
          const ac = alignCoords[j];
          if ((ar < 9 && ac < 9) || (ar < 9 && ac >= matrixSize - 9) || (ar >= matrixSize - 9 && ac < 9)) {
            continue; // Do not collide with finder patterns
          }
          for (let r = -2; r <= 2; r++) {
            for (let c = -2; c <= 2; c++) {
              const isDark = (Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0));
              setFunction(ar + r, ac + c, isDark);
            }
          }
        }
      }

      // Dark Module
      setFunction(matrixSize - 8, 8, true);

      // Reserve Format Information Areas
      for (let i = 0; i < 9; i++) {
        if (!isFunction[8][i]) isFunction[8][i] = true;
        if (!isFunction[i][8]) isFunction[i][8] = true;
      }
      for (let i = 0; i < 8; i++) {
        if (!isFunction[8][matrixSize - 1 - i]) isFunction[8][matrixSize - 1 - i] = true;
        if (!isFunction[matrixSize - 1 - i][8]) isFunction[matrixSize - 1 - i][8] = true;
      }

      // Reserve Version Information Areas (V >= 7)
      if (version >= 7) {
        for (let r = 0; r < 6; r++) {
          for (let c = 0; c < 3; c++) {
            isFunction[r][matrixSize - 11 + c] = true;
            isFunction[matrixSize - 11 + c][r] = true;
          }
        }
      }

      // 11. Place Data Bits in 2-Column Zig-Zag Track
      let bitIdx = 0;
      let right = matrixSize - 1;
      let upward = true;

      while (right > 0) {
        if (right === 6) right--; // Skip vertical timing line
        const col1 = right;
        const col2 = right - 1;

        for (let step = 0; step < matrixSize; step++) {
          const r = upward ? (matrixSize - 1 - step) : step;
          for (const c of [col1, col2]) {
            if (!isFunction[r][c]) {
              const bit = bitIdx < finalBits.length ? finalBits[bitIdx++] : 0;
              matrix[r][c] = (bit === 1);
            }
          }
        }
        upward = !upward;
        right -= 2;
      }

      // 12. Evaluate 8 ISO Mask Patterns & Pick Best Penalty
      const masks = [
        (r, c) => (r + c) % 2 === 0,
        (r, c) => r % 2 === 0,
        (r, c) => c % 3 === 0,
        (r, c) => (r + c) % 3 === 0,
        (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
        (r, c) => ((r * c) % 2 + (r * c) % 3) === 0,
        (r, c) => (((r * c) % 2 + (r * c) % 3) % 2) === 0,
        (r, c) => (((r + c) % 2 + (r * c) % 3) % 2) === 0
      ];

      const eccFormatMap = { L: 1, M: 0, Q: 3, H: 2 };
      const eccBits = eccFormatMap[ecc];

      let bestMask = 0;
      let minPenalty = Infinity;
      let bestMatrix = null;

      for (let maskIdx = 0; maskIdx < 8; maskIdx++) {
        const candidate = matrix.map(row => [...row]);
        const maskFn = masks[maskIdx];

        for (let r = 0; r < matrixSize; r++) {
          for (let c = 0; c < matrixSize; c++) {
            if (!isFunction[r][c]) {
              if (maskFn(r, c)) {
                candidate[r][c] = !candidate[r][c];
              }
            }
          }
        }

        // Format Information Placement (15 bits)
        const formatData = (eccBits << 3) | maskIdx;
        const formatCode = FORMAT_BITS[formatData];
        const formatModules = [];
        for (let i = 14; i >= 0; i--) {
          formatModules.push(((formatCode >>> i) & 1) === 1);
        }

        // Top-left finder format placement
        candidate[8][0] = formatModules[0];
        candidate[8][1] = formatModules[1];
        candidate[8][2] = formatModules[2];
        candidate[8][3] = formatModules[3];
        candidate[8][4] = formatModules[4];
        candidate[8][5] = formatModules[5];
        candidate[8][7] = formatModules[6];
        candidate[8][8] = formatModules[7];
        candidate[7][8] = formatModules[8];
        candidate[5][8] = formatModules[9];
        candidate[4][8] = formatModules[10];
        candidate[3][8] = formatModules[11];
        candidate[2][8] = formatModules[12];
        candidate[1][8] = formatModules[13];
        candidate[0][8] = formatModules[14];

        // Top-right & Bottom-left format placement
        for (let i = 0; i < 8; i++) {
          candidate[8][matrixSize - 1 - i] = formatModules[i];
        }
        for (let i = 0; i < 7; i++) {
          candidate[matrixSize - 7 + i][8] = formatModules[8 + i];
        }

        // Version Information Placement (V >= 7)
        if (version >= 7) {
          const vBits = VERSION_BITS[version];
          for (let i = 0; i < 18; i++) {
            const bit = ((vBits >>> i) & 1) === 1;
            const a = Math.floor(i / 3);
            const b = i % 3;
            // Bottom-left
            candidate[matrixSize - 11 + b][a] = bit;
            // Top-right
            candidate[a][matrixSize - 11 + b] = bit;
          }
        }

        const penalty = QrEncoder.calculatePenalty(candidate, matrixSize);
        if (penalty < minPenalty) {
          minPenalty = penalty;
          bestMask = maskIdx;
          bestMatrix = candidate;
        }
      }

      return {
        version,
        ecc,
        size: matrixSize,
        matrix: bestMatrix,
        mask: bestMask
      };
    }

    static calculatePenalty(mat, size) {
      let penalty = 0;

      // N1: 5 or more consecutive modules of identical color in rows / cols
      for (let r = 0; r < size; r++) {
        let count = 1;
        for (let c = 1; c < size; c++) {
          if (mat[r][c] === mat[r][c - 1]) {
            count++;
          } else {
            if (count >= 5) penalty += 3 + (count - 5);
            count = 1;
          }
        }
        if (count >= 5) penalty += 3 + (count - 5);
      }
      for (let c = 0; c < size; c++) {
        let count = 1;
        for (let r = 1; r < size; r++) {
          if (mat[r][c] === mat[r - 1][c]) {
            count++;
          } else {
            if (count >= 5) penalty += 3 + (count - 5);
            count = 1;
          }
        }
        if (count >= 5) penalty += 3 + (count - 5);
      }

      // N2: 2x2 blocks of identical color
      for (let r = 0; r < size - 1; r++) {
        for (let c = 0; c < size - 1; c++) {
          const val = mat[r][c];
          if (val === mat[r + 1][c] && val === mat[r][c + 1] && val === mat[r + 1][c + 1]) {
            penalty += 3;
          }
        }
      }

      // N3: 1:1:3:1:1 finder-like patterns (00001011101 or 10111010000)
      const pat1 = [false, false, false, false, true, false, true, true, true, false, true];
      const pat2 = [true, false, true, true, true, false, true, false, false, false, false];

      for (let r = 0; r < size; r++) {
        for (let c = 0; c <= size - 11; c++) {
          let m1 = true, m2 = true;
          for (let i = 0; i < 11; i++) {
            if (mat[r][c + i] !== pat1[i]) m1 = false;
            if (mat[r][c + i] !== pat2[i]) m2 = false;
          }
          if (m1 || m2) penalty += 40;
        }
      }
      for (let c = 0; c < size; c++) {
        for (let r = 0; r <= size - 11; r++) {
          let m1 = true, m2 = true;
          for (let i = 0; i < 11; i++) {
            if (mat[r + i][c] !== pat1[i]) m1 = false;
            if (mat[r + i][c] !== pat2[i]) m2 = false;
          }
          if (m1 || m2) penalty += 40;
        }
      }

      // N4: Balance of dark / light modules
      let darkCount = 0;
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (mat[r][c]) darkCount++;
        }
      }
      const total = size * size;
      const ratio = (darkCount / total) * 100;
      const k = Math.floor(Math.abs(ratio - 50) / 5);
      penalty += k * 10;

      return penalty;
    }
  }

  /* =========================================================================
     4. SVG & RASTER RENDERING UTILITIES
     ========================================================================= */

  function renderSvg(qrResult, options = {}) {
    const margin = options.margin !== undefined ? Math.max(0, parseInt(options.margin, 10)) : 4;
    const color = options.color || '#111215';
    const bgColor = options.bgColor || '#FAFAF8';
    const matrix = qrResult.matrix;
    const moduleCount = matrix.length;
    const totalSize = moduleCount + margin * 2;

    let pathData = '';
    for (let r = 0; r < moduleCount; r++) {
      for (let c = 0; c < moduleCount; c++) {
        if (matrix[r][c]) {
          const x = c + margin;
          const y = r + margin;
          pathData += `M${x},${y}h1v1h-1z `;
        }
      }
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalSize} ${totalSize}" shape-rendering="crispEdges" width="100%" height="100%" role="img" aria-label="QR Code">
  <rect width="${totalSize}" height="${totalSize}" fill="${bgColor}" />
  <path d="${pathData.trim()}" fill="${color}" />
</svg>`;
  }

  function renderCanvas(qrResult, options = {}) {
    const margin = options.margin !== undefined ? Math.max(0, parseInt(options.margin, 10)) : 4;
    const color = options.color || '#111215';
    const bgColor = options.bgColor || '#FAFAF8';
    const targetSize = options.size || 1024; // High DPI default
    const matrix = qrResult.matrix;
    const moduleCount = matrix.length;
    const totalModules = moduleCount + margin * 2;

    const canvas = document.createElement('canvas');
    canvas.width = targetSize;
    canvas.height = targetSize;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Fill background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, targetSize, targetSize);

    // Module scale
    const moduleScale = targetSize / totalModules;
    ctx.fillStyle = color;

    for (let r = 0; r < moduleCount; r++) {
      for (let c = 0; c < moduleCount; c++) {
        if (matrix[r][c]) {
          const x = Math.floor((c + margin) * moduleScale);
          const y = Math.floor((r + margin) * moduleScale);
          const w = Math.ceil((c + margin + 1) * moduleScale) - x;
          const h = Math.ceil((r + margin + 1) * moduleScale) - y;
          ctx.fillRect(x, y, w, h);
        }
      }
    }

    return canvas;
  }

  /* =========================================================================
     5. CONTRAST RATIO & SCANNABILITY CALCULATOR
     ========================================================================= */

  function parseHexToRgb(hex) {
    let clean = hex.replace('#', '').trim();
    if (clean.length === 3) {
      clean = clean.split('').map(c => c + c).join('');
    }
    const num = parseInt(clean, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  }

  function getLuminance(rgb) {
    const a = [rgb.r, rgb.g, rgb.b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  function calculateContrastRatio(hex1, hex2) {
    try {
      const lum1 = getLuminance(parseHexToRgb(hex1));
      const lum2 = getLuminance(parseHexToRgb(hex2));
      const brightest = Math.max(lum1, lum2);
      const darkest = Math.min(lum1, lum2);
      return (brightest + 0.05) / (darkest + 0.05);
    } catch {
      return 21; // fallback
    }
  }

  /* =========================================================================
     6. CUSTOM WEB COMPONENT: <campaign-qr-generator>
     ========================================================================= */

  let CampaignQrGeneratorElement = null;

  if (typeof window !== 'undefined' && typeof HTMLElement !== 'undefined') {
    CampaignQrGeneratorElement = class extends HTMLElement {
      static get observedAttributes() {
        return ['value', 'ecc', 'margin', 'color', 'bg-color', 'size'];
      }

      constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._lastResult = null;
      }

      connectedCallback() {
        this.render();
      }

      attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
          this.render();
        }
      }

      // Properties
      get value() { return this.getAttribute('value') || 'https://capte.co'; }
      set value(val) { this.setAttribute('value', val); }

      get ecc() { return (this.getAttribute('ecc') || 'Q').toUpperCase(); }
      set ecc(val) { this.setAttribute('ecc', val); }

      get margin() { return parseInt(this.getAttribute('margin') || '4', 10); }
      set margin(val) { this.setAttribute('margin', String(val)); }

      get color() { return this.getAttribute('color') || '#111215'; }
      set color(val) { this.setAttribute('color', val); }

      get bgColor() { return this.getAttribute('bg-color') || '#FAFAF8'; }
      set bgColor(val) { this.setAttribute('bg-color', val); }

      get size() { return parseInt(this.getAttribute('size') || '280', 10); }
      set size(val) { this.setAttribute('size', String(val)); }

      // Core generation
      generateQr() {
        try {
          const result = QrEncoder.encode(this.value, this.ecc);
          this._lastResult = result;
          return result;
        } catch (err) {
          this.dispatchEvent(new CustomEvent('qr-error', { detail: { error: err.message } }));
          return null;
        }
      }

      // Public export methods
      getSvgString() {
        if (!this._lastResult) this.generateQr();
        if (!this._lastResult) return '';
        return renderSvg(this._lastResult, {
          margin: this.margin,
          color: this.color,
          bgColor: this.bgColor
        });
      }

      async getPngBlob(targetSize = 1024) {
        if (!this._lastResult) this.generateQr();
        if (!this._lastResult) return null;
        const canvas = renderCanvas(this._lastResult, {
          margin: this.margin,
          color: this.color,
          bgColor: this.bgColor,
          size: targetSize
        });
        return new Promise(resolve => {
          canvas.toBlob(blob => resolve(blob), 'image/png');
        });
      }

      downloadSvg(filename = 'capte-campaign-qr.svg') {
        const svgStr = this.getSvgString();
        if (!svgStr) return;
        const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      async downloadPng(filename = 'capte-campaign-qr-300dpi.png', targetSize = 1024) {
        const blob = await this.getPngBlob(targetSize);
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      async copySvg() {
        const svgStr = this.getSvgString();
        if (navigator.clipboard && svgStr) {
          await navigator.clipboard.writeText(svgStr);
          return true;
        }
        return false;
      }

      async copyUrl() {
        if (navigator.clipboard && this.value) {
          await navigator.clipboard.writeText(this.value);
          return true;
        }
        return false;
      }

      render() {
        const qr = this.generateQr();
        if (!qr) {
          this.shadowRoot.innerHTML = `
            <style>
              :host { display: block; font-family: sans-serif; }
              .error-box { padding: 16px; background: #FFF5F5; border: 1px solid #FEB2B2; color: #C53030; border-radius: 6px; font-size: 13px; }
            </style>
            <div class="error-box">Error encoding QR: Payload exceeds supported capacity.</div>
          `;
          return;
        }

        const svgMarkup = renderSvg(qr, {
          margin: this.margin,
          color: this.color,
          bgColor: this.bgColor
        });

        this.shadowRoot.innerHTML = `
          <style>
            :host {
              display: inline-block;
              vertical-align: middle;
              contain: content;
            }
            .qr-wrapper {
              display: flex;
              align-items: center;
              justify-content: center;
              width: ${this.size}px;
              height: ${this.size}px;
              background: ${this.bgColor};
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0, 19, 132, 0.06);
              overflow: hidden;
              transition: transform 0.15s ease;
            }
            .qr-wrapper svg {
              width: 100%;
              height: 100%;
              display: block;
            }
          </style>
          <div class="qr-wrapper" role="img" aria-label="QR Code Preview">
            ${svgMarkup}
          </div>
        `;

        this.dispatchEvent(new CustomEvent('qr-render', {
          detail: {
            version: qr.version,
            ecc: qr.ecc,
            size: qr.size,
            mask: qr.mask
          }
        }));
      }
    };

    if (typeof customElements !== 'undefined' && !customElements.get('campaign-qr-generator')) {
      customElements.define('campaign-qr-generator', CampaignQrGeneratorElement);
    }
  }

  // Export module / global namespace
  const CapteQr = {
    QrEncoder,
    renderSvg,
    renderCanvas,
    calculateContrastRatio,
    CampaignQrGeneratorElement
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = CapteQr;
  } else {
    global.CapteQr = CapteQr;
  }

})(typeof window !== 'undefined' ? window : globalThis);
