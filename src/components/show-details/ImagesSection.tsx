/**
 * ImagesSection - Display images in masonry layout
 */

import type { TVShow } from '@/types';

interface ImagesSectionProps {
    show: TVShow;
}

export function ImagesSection({ show }: ImagesSectionProps) {
    const allImages = show._embedded?.images || [];

    if (allImages.length === 0) return null;

    return (
        <section className="border-t border-border bg-background py-12">
            <div className="container mx-auto px-4">
                <h2 className="mb-6 text-3xl font-bold text-foreground">
                    Images
                </h2>
                <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
                    {allImages.map((image) => {
                        const imageUrl =
                            image.resolutions?.original?.url ||
                            image.resolutions?.medium?.url;

                        return imageUrl ? (
                            <div
                                key={image.id}
                                className="mb-4 break-inside-avoid"
                            >
                                <img
                                    src={imageUrl}
                                    alt={`${show.name} - ${image.type}`}
                                    className="w-full rounded-lg"
                                    loading="lazy"
                                />
                            </div>
                        ) : null;
                    })}
                </div>
            </div>
        </section>
    );
}
