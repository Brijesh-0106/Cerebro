import { pipeline } from '@xenova/transformers';

export async function getEmbedding(text: string): Promise<number[]> {
    // Load the embedding pipeline (downloads model on first run)
    const extractor = await pipeline(
        'feature-extraction',
        'Xenova/bge-small-en-v1.5'
    );

    console.log(extractor, "extractor")
    // Generate embedding
    const output = await extractor(text, {
        pooling: 'mean',
        normalize: true
    });

    // Convert to regular array
    return Array.from(output.data);
}
