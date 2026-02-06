import { pipeline } from '@xenova/transformers';

export async function getEmbedding(text: string): Promise<number[]> {
    // Load the embedding pipeline (downloads model on first run)
    const extractor = await pipeline(
        'feature-extraction',
        'Xenova/all-MiniLM-L6-v2'
    );

    // Generate embedding
    const output = await extractor(text, {
        pooling: 'mean',
        normalize: true
    });

    // Convert to regular array
    return Array.from(output.data);
}
