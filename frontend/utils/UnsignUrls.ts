export function getUnsignedUrl(url: string | undefined): string | undefined {
    if (url) {
        const match = url.match(/profiles\/[^?]+\.jpg/);
        return match ? match[0] : undefined;
    }
    else {
        return undefined;
    }
}