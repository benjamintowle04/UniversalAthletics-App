
/**
 * 
 * @param url - The URL to be processed ex. "https://example.com/profiles/user123.jpg"
 * @returns unsigned URL or undefined if the URL does not match the expected pattern
 */
export function getUnsignedUrl(url: string | undefined): string | undefined {
    if (url) {
        const match = url.includes("jpg") ? url.match(/profiles\/[^?]+\.jpg/) : url.match(/profiles\/[^?]+\.png/);
        return match ? match[0] : undefined;
    }
    else {
        return undefined;
    }
}