export function getUnsignedUrl(url: string | undefined): string | undefined {
    if (url) {
        const match = url.includes("jpg") ? url.match(/profiles\/[^?]+\.jpg/) : url.match(/profiles\/[^?]+\.png/);
        return match ? match[0] : undefined;
    }
    else {
        return undefined;
    }
}