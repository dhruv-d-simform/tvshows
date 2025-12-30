# Data Model: TV Show Search Web App

## Entities

### 1. TVShow

-   id: number
-   name: string
-   genres: string[]
-   language: string (optional)
-   premiered: string (date, optional)
-   premiered: string (date, optional)
-   rating (optional): {
    average: number (optional)
    }
-   image (optional): {
    medium: string (optional)
    original: string (optional)
    } (optional)
-   summary: string (optional)
-   externals (optional): {
    imdb: string (optional, IMDb link)
    }
-   _relationships:_
    -   seasons: Season[]
    -   cast: CastMember[]
    -   episodes: Episode[]
    -   images: {
        id: number
        type: string (poster, background, banner, typography)
        resolutions: {
        original: {
        url: string,
        width: number,
        height: number,
        },
        medium: {
        url: string,
        width: number,
        height: number,
        },
        }
        }[]

### 2. Season

-   id: number
-   number: number
-   episodeOrder: number (optional)
-   premiereDate: string (optional)
-   endDate: string (optional)
-   image: {
    medium: string (optional)
    original: string (optional)
    } (optional)
-   summary: string (optional)

### 3. Episode

-   id: number
-   name: string
-   season: number
-   number: number
-   runtime: number (optional)
-   rating (optional): {
    average: number (optional)
    }
-   image: {
    medium: string (optional)
    original: string (optional)
    } (optional)
-   summary: string (optional)

### 4. CastMember

-   person: {
    id: number
    name: string
    image: {
    medium: string (optional)
    original: string (optional)
    } (optional)
    }
-   character: {
    id: number
    name: string
    image: {
    medium: string (optional)
    original: string (optional)
    } (optional)
    }

### 5. RecentlyVisitedShow

-   show: TVShow (full show object, without \_embedded)
-   visitedAt: string (ISO date)

## Validation Rules

-   All fields from API are validated with Zod schemas.
-   All optional fields must be handled gracefully in UI (never break on missing data).
-   Recently visited shows are capped (e.g., 20 max) and stored in local storage as the full TVShow object (excluding \_embedded).

## State Transitions

-   When a user visits a show details page, the show is added to RecentlyVisitedShow (or updated if already present).
-   User can remove a show from recently visited list.

## Relationships

-   TVShow has many Seasons
-   Season has many Episodes
-   TVShow has many CastMembers

---

## Example: TVShow JSON (with \_embedded)

```json
{
    "id": 82,
    "name": "Game of Thrones",
    "language": "English",
    "genres": ["Drama", "Adventure", "Fantasy"],
    "premiered": "2011-04-17",
    "ended": "2019-05-19",
    "rating": {
        "average": 8.9
    },
    "externals": {
        "tvrage": 24493,
        "thetvdb": 121361,
        "imdb": "tt0944947"
    },
    "image": {
        "medium": "https://static.tvmaze.com/uploads/images/medium_portrait/498/1245274.jpg",
        "original": "https://static.tvmaze.com/uploads/images/original_untouched/498/1245274.jpg"
    },
    "summary": "<p>Based on the bestselling book series <i>A Song of Ice and Fire</i> by George R.R. Martin, ...</p>",
    "_embedded": {
        "seasons": [
            {
                "id": 307,
                "number": 1,
                "episodeOrder": 10,
                "premiereDate": "2011-04-17",
                "endDate": "2011-06-19",
                "image": {
                    "medium": "https://static.tvmaze.com/uploads/images/medium_portrait/24/60659.jpg",
                    "original": "https://static.tvmaze.com/uploads/images/original_untouched/24/60659.jpg"
                },
                "summary": "<p>Lord Eddard Stark is asked by his old friend, King Robert Baratheon, ...</p>"
            }
        ],
        "cast": [
            {
                "person": {
                    "id": 14079,
                    "name": "Emilia Clarke",
                    "image": {
                        "medium": "https://static.tvmaze.com/uploads/images/medium_portrait/460/1150100.jpg",
                        "original": "https://static.tvmaze.com/uploads/images/original_untouched/460/1150100.jpg"
                    }
                },
                "character": {
                    "id": 15611,
                    "name": "Daenerys Targaryen",
                    "image": {
                        "medium": "https://static.tvmaze.com/uploads/images/medium_portrait/567/1418483.jpg",
                        "original": "https://static.tvmaze.com/uploads/images/original_untouched/567/1418483.jpg"
                    }
                }
            }
        ],
        "episodes": [
            {
                "id": 4952,
                "name": "Winter is Coming",
                "season": 1,
                "number": 1,
                "runtime": 60,
                "rating": {
                    "average": 8.2
                },
                "image": {
                    "medium": "https://static.tvmaze.com/uploads/images/medium_landscape/478/1195111.jpg",
                    "original": "https://static.tvmaze.com/uploads/images/original_untouched/478/1195111.jpg"
                },
                "summary": "<p>Lord Eddard Stark, ruler of the North, is summoned to court by his old friend, King Robert Baratheon, ...</p>"
            }
        ],
        "images": [
            {
                "id": 581,
                "type": "poster",
                "main": false,
                "resolutions": {
                    "original": {
                        "url": "https://static.tvmaze.com/uploads/images/original_untouched/0/581.jpg",
                        "width": 680,
                        "height": 1000
                    },
                    "medium": {
                        "url": "https://static.tvmaze.com/uploads/images/medium_portrait/0/581.jpg",
                        "width": 210,
                        "height": 295
                    }
                }
            },
            {
                "id": 530046,
                "type": "background",
                "main": false,
                "resolutions": {
                    "original": {
                        "url": "https://static.tvmaze.com/uploads/images/original_untouched/213/533549.jpg",
                        "width": 1920,
                        "height": 1080
                    }
                }
            },
            {
                "id": 535427,
                "type": "typography",
                "main": false,
                "resolutions": {
                    "original": {
                        "url": "https://static.tvmaze.com/uploads/images/original_untouched/215/538947.jpg",
                        "width": 840,
                        "height": 380
                    }
                }
            },
            {
                "id": 1230408,
                "type": "poster",
                "main": true,
                "resolutions": {
                    "original": {
                        "url": "https://static.tvmaze.com/uploads/images/original_untouched/498/1245274.jpg",
                        "width": 2030,
                        "height": 3000
                    },
                    "medium": {
                        "url": "https://static.tvmaze.com/uploads/images/medium_portrait/498/1245274.jpg",
                        "width": 210,
                        "height": 295
                    }
                }
            }
        ]
    }
}
```
