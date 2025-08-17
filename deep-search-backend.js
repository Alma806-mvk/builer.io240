"use strict";
// Deep Search Backend API (TypeScript)
// ------------------------------------
// 1. Place this file in your backend project root.
// 2. Install dependencies: npm install express axios dotenv cors
// 3. Create a .env file with:
//    GOOGLE_API_KEY=your_google_api_key
//    GOOGLE_CSE_ID=your_custom_search_engine_id
// 4. Run: npx ts-node deep-search-backend.ts
// 5. Deploy to Vercel/Heroku/Render as needed.
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g = Object.create(
        (typeof Iterator === "function" ? Iterator : Object).prototype,
      );
    return (
      (g.next = verb(0)),
      (g["throw"] = verb(1)),
      (g["return"] = verb(2)),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                    ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                    : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var cors = require("cors");
var axios = require("axios");
var dotenv = require("dotenv");
dotenv.config();
var app = express();
var PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());

// EmailOctopus configuration
var EMAILOCTOPUS_API_KEY =
  "eo_bd71e368a57da881edc1129945859046e4eeeac7c68743b2dea1e5714b573bbb";
var EMAILOCTOPUS_LIST_ID = "8a609ad8-5451-11f0-adb5-6daeb04650fb";
var EMAILOCTOPUS_BASE_URL = "https://emailoctopus.com/api/1.6";

// EmailOctopus subscription endpoint
app.post("/api/subscribe-thumbnail-notifications", function (req, res) {
  return __awaiter(void 0, void 0, void 0, function () {
    var _a,
      email,
      firstName,
      lastName,
      subscriptionData,
      response,
      result,
      error_1;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _b.trys.push([0, 3, , 4]);
          ((_a = req.body),
            (email = _a.email),
            (firstName = _a.firstName),
            (lastName = _a.lastName));
          if (!email) {
            return [
              2 /*return*/,
              res.status(400).json({
                success: false,
                error: "Email address is required",
              }),
            ];
          }
          // Validate email format
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return [
              2 /*return*/,
              res.status(400).json({
                success: false,
                error: "Invalid email format",
              }),
            ];
          }
          subscriptionData = {
            api_key: EMAILOCTOPUS_API_KEY,
            email_address: email,
            fields: {
              FirstName: firstName || "",
              LastName: lastName || "",
            },
            tags: ["thumbnail-studio-notification"],
            status: "SUBSCRIBED",
          };
          return [
            4 /*yield*/,
            axios.post(
              ""
                .concat(EMAILOCTOPUS_BASE_URL, "/lists/")
                .concat(EMAILOCTOPUS_LIST_ID, "/contacts"),
              subscriptionData,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              },
            ),
          ];
        case 1:
          response = _b.sent();
          result = response.data;
          console.log(
            "Successfully subscribed ".concat(
              email,
              " to thumbnail notifications",
            ),
            {
              contactId: result.id,
            },
          );
          return [
            2 /*return*/,
            res.json({
              success: true,
              message:
                "Successfully subscribed to thumbnail studio notifications!",
              contactId: result.id,
            }),
          ];
        case 2:
          error_1 = _b.sent();
          console.error("EmailOctopus subscription error:", error_1);
          // Handle specific EmailOctopus errors
          if (error_1.response && error_1.response.data) {
            var errorData = error_1.response.data;
            if (
              errorData.error &&
              errorData.error.code === "MEMBER_EXISTS_WITH_EMAIL_ADDRESS"
            ) {
              return [
                2 /*return*/,
                res.json({
                  success: true,
                  message: "You're already subscribed to notifications!",
                  alreadySubscribed: true,
                }),
              ];
            }
            return [
              2 /*return*/,
              res.status(400).json({
                success: false,
                error:
                  errorData.error.message ||
                  "Failed to subscribe to notifications",
              }),
            ];
          }
          return [
            2 /*return*/,
            res.status(500).json({
              success: false,
              error: "An unexpected error occurred. Please try again.",
            }),
          ];
        case 3:
          return [3 /*break*/, 4];
        case 4:
          return [2 /*return*/];
      }
    });
  });
});

// Helper: determine if extension is an image type
var IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "svg", "gif", "bmp", "webp"];
// Helper: clean extension (remove leading dot)
function cleanExt(ext) {
  return ext.replace(/^\./, "").toLowerCase();
}
// Helper: Validate a direct download link
function validateDirectDownload(url, ext) {
  return __awaiter(this, void 0, void 0, function () {
    var resp, contentType, contentLength, _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _b.trys.push([0, 2, , 3]);
          return [
            4 /*yield*/,
            axios_1.default.head(url, { timeout: 8000, maxRedirects: 3 }),
          ];
        case 1:
          resp = _b.sent();
          contentType = resp.headers["content-type"] || "";
          contentLength = parseInt(resp.headers["content-length"] || "0", 10);
          // Check file extension, content-type, and reasonable size
          if (
            url.toLowerCase().endsWith(ext.toLowerCase()) &&
            contentLength > 10 * 1024 && // >10KB
            (!contentType ||
              contentType.includes(ext.replace(".", "")) ||
              contentType.startsWith("application/") ||
              contentType.startsWith("video/") ||
              contentType.startsWith("audio/"))
          ) {
            return [
              2 /*return*/,
              { valid: true, size: contentLength, contentType: contentType },
            ];
          }
          return [2 /*return*/, { valid: false }];
        case 2:
          _a = _b.sent();
          return [2 /*return*/, { valid: false }];
        case 3:
          return [2 /*return*/];
      }
    });
  });
}
// Enhanced Google file search
function googleFileSearch(query, ext) {
  return __awaiter(this, void 0, void 0, function () {
    var cleanedExt, isImage, params, url, data;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          cleanedExt = cleanExt(ext);
          isImage = IMAGE_EXTENSIONS.includes(cleanedExt);
          params = {
            key: process.env.GOOGLE_API_KEY,
            cx: process.env.GOOGLE_CSE_ID,
            q: query,
            num: 10,
          };
          if (isImage) {
            params.searchType = "image";
          } else if (cleanedExt) {
            params.q += " filetype:".concat(cleanedExt);
          }
          url = "https://www.googleapis.com/customsearch/v1";
          return [4 /*yield*/, axios_1.default.get(url, { params: params })];
        case 1:
          data = _a.sent().data;
          if (!data.items) return [2 /*return*/, []];
          // Filter results to match extension
          return [
            2 /*return*/,
            data.items
              .filter(function (item) {
                if (isImage) {
                  // For images, check file format or link extension
                  var link = item.link || "";
                  var format = (item.fileFormat || "").toLowerCase();
                  return (
                    link.toLowerCase().endsWith("." + cleanedExt) ||
                    format.includes(cleanedExt)
                  );
                } else if (cleanedExt) {
                  // For other types, check link extension
                  return (item.link || "")
                    .toLowerCase()
                    .endsWith("." + cleanedExt);
                }
                return true;
              })
              .map(function (item) {
                return {
                  title: item.title,
                  url: item.link,
                  filetype: cleanedExt,
                  snippet: item.snippet,
                  contentType: item.mime || item.fileFormat || "",
                  size: undefined, // Optionally, fetch HEAD for size
                };
              }),
          ];
      }
    });
  });
}
// Main endpoint
app.get("/api/deep-search", function (req, res) {
  return __awaiter(void 0, void 0, void 0, function () {
    var query,
      ext,
      googleResults,
      validated,
      _i,
      googleResults_1,
      result,
      check,
      err_1;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          query = req.query.query || "";
          ext = req.query.ext || "";
          if (!query || !ext)
            return [
              2 /*return*/,
              res.status(400).json({ error: "Missing query or ext" }),
            ];
          _a.label = 1;
        case 1:
          _a.trys.push([1, 7, , 8]);
          return [4 /*yield*/, googleFileSearch(query, ext)];
        case 2:
          googleResults = _a.sent();
          console.log("Google returned:", googleResults.length, "results");
          console.log(googleResults);
          validated = [];
          ((_i = 0), (googleResults_1 = googleResults));
          _a.label = 3;
        case 3:
          if (!(_i < googleResults_1.length)) return [3 /*break*/, 6];
          result = googleResults_1[_i];
          return [4 /*yield*/, validateDirectDownload(result.url, ext)];
        case 4:
          check = _a.sent();
          if (check.valid) {
            validated.push(
              __assign(__assign({}, result), {
                size: check.size,
                contentType: check.contentType,
              }),
            );
          }
          _a.label = 5;
        case 5:
          _i++;
          return [3 /*break*/, 3];
        case 6:
          console.log("Validated results:", validated.length);
          res.json({ results: validated });
          return [3 /*break*/, 8];
        case 7:
          err_1 = _a.sent();
          res.status(500).json({ error: err_1.message || "Search failed" });
          return [3 /*break*/, 8];
        case 8:
          return [2 /*return*/];
      }
    });
  });
});
app.listen(PORT, function () {
  console.log("Deep Search API running on port ".concat(PORT));
});
