"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinUrls = void 0;
const joinUrls = (urlStrings) => {
    const ensureLeadingSlash = (str) => {
        return str.startsWith("/") ? str : `/${str}`;
    };
    if (typeof urlStrings === "string") {
        return ensureLeadingSlash(urlStrings);
    }
    if (Array.isArray(urlStrings)) {
        const joinedUrl = urlStrings.map((str) => ensureLeadingSlash(str)).join("");
        return joinedUrl;
    }
    throw new Error("Argument must be a string or an array of strings");
};
exports.joinUrls = joinUrls;
