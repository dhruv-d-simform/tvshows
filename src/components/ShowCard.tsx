import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { TVShow } from '@/types';

interface ShowCardProps {
    show: TVShow;
    onClick?: () => void;
    onRemove?: () => void;
}

export function ShowCard({ show, onClick, onRemove }: ShowCardProps) {
    const year = show.premiered ? new Date(show.premiered).getFullYear() : null;
    const rating = show.rating?.average;
    const genres = show.genres.slice(0, 2).join(', ');

    return (
        <Card
            className="relative cursor-pointer hover:shadow-lg transition-shadow"
            onClick={onClick}
        >
            <CardContent className="p-4">
                <div className="flex gap-4">
                    <img
                        src={show.image?.medium || '/placeholder.png'}
                        alt={show.name}
                        className="w-20 h-28 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">
                            {show.name}
                        </h3>
                        <div className="text-xs text-muted-foreground space-y-1">
                            {year && <p>{year}</p>}
                            {genres && <p>{genres}</p>}
                            <div className="flex items-center gap-2">
                                {rating && <span>⭐ {rating}</span>}
                                {show.language && <span>{show.language}</span>}
                            </div>
                        </div>
                    </div>
                </div>
                {onRemove && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 p-1 h-6 w-6"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove();
                        }}
                    >
                        <X className="w-3 h-3" />
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
