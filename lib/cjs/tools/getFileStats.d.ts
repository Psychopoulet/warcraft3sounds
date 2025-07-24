export default function getfileStats(file: string): Promise<{
    "exists": boolean;
    "size": number;
}>;
